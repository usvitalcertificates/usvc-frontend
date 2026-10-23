/* global console, process, window, sessionStorage, Event, URL, Buffer */
// Local browser regression: synthetic API responses only, no real emails/accounts.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const base = process.env.STAFF_RECOVERY_TEST_URL || "http://localhost:3195";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  let enroll = false,
    failQr = false,
    invalid = false;
  const requests = [];
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const token = `x.${Buffer.from(JSON.stringify({ role: "ADMIN", sub: "admin" })).toString("base64")}.x`;
  const staff = [
    {
      id: "admin",
      fullName: "Admin",
      email: "admin@example.test",
      role: "ADMIN",
      accountStatus: "active",
      mfaEnabled: true,
      activeOrders: 0,
    },
    ...["first", "second"].map((id) => ({
      id,
      fullName: `Test ${id}`,
      email: `${id}@example.test`,
      role: "CS",
      accountStatus: "active",
      mfaEnabled: true,
      activeOrders: 0,
    })),
  ];
  await context.route("**/api/backend/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname.replace("/api/backend", "");
    requests.push({ path, method: req.method() });
    let data = {},
      status = 200;
    if (path === "/auth/setup") {
      if (invalid) {
        status = 400;
        data = { message: "This setup or password reset link is invalid or has expired." };
      } else data = { ok: true, mfaToken: "synthetic-mfa", enroll };
    } else if (path === "/auth/mfa/enroll") {
      if (failQr) {
        failQr = false;
        status = 503;
        data = { message: "Temporary QR failure" };
      } else
        data = {
          secret: "SYNTHETICKEY",
          qrDataUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        };
    } else if (path === "/auth/mfa/verify" || path === "/auth/mfa/confirm")
      data = { accessToken: token, refreshToken: "synthetic-refresh" };
    else if (path === "/admin/staff") data = { staff };
    else if (path.match(/^\/admin\/staff\/[^/]+\/mfa-reset$/)) {
      const id = path.split("/")[3];
      staff.find((r) => r.id === id).mfaEnabled = false;
      data = { ok: true };
    } else if (path.endsWith("/password-reset")) data = { ok: true, emailed: true };
    else if (path === "/staff/orders") data = { orders: [], total: 0, pages: 1 };
    await route.fulfill({ status, json: data });
  });
  const setup = async () => {
    await page.goto(`${base}/auth?setup=synthetic-single-use`);
    await page.getByLabel("Create password").fill("SyntheticPassword123");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  };
  await setup();
  await page.getByText("Enter the current 6-digit code from your authenticator app.").waitFor();
  assert.equal(requests.filter((r) => r.path === "/auth/mfa/enroll").length, 0);
  assert.equal(new URL(page.url()).search, "");
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByRole("button", { name: "Verify and continue" }).click();
  await page.waitForURL("**/staff");
  console.log("PASS enrolled reset -> existing authenticator -> staff");
  requests.length = 0;
  enroll = true;
  failQr = true;
  await setup();
  await page.getByRole("button", { name: "Retry authenticator setup" }).waitFor();
  await page.getByRole("button", { name: "Retry authenticator setup" }).click();
  await page.getByLabel("6-digit code").waitFor();
  assert.equal(requests.filter((r) => r.path === "/auth/setup").length, 1);
  assert.equal(requests.filter((r) => r.path === "/auth/mfa/enroll").length, 2);
  await page.getByLabel("6-digit code").fill("123456");
  await page.getByRole("button", { name: "Complete setup" }).click();
  await page.waitForURL("**/staff");
  console.log("PASS new pairing and QR retry without reusing setup link");
  invalid = true;
  await setup();
  await page.getByRole("alert").waitFor();
  await page.getByRole("link", { name: "Return to staff sign in" }).click();
  await page.getByLabel("Work email").waitFor();
  console.log("PASS expired/consumed link has working sign-in escape");
  await page.evaluate((token) => {
    sessionStorage.setItem("usvc-staff-access", token);
    sessionStorage.setItem("usvc-staff-refresh", "synthetic-refresh");
  }, token);
  await page.goto(`${base}/staff/admin`);
  await page.getByText("first@example.test", { exact: true }).waitFor();
  for (const id of ["first", "second"]) {
    await page
      .getByRole("button", { name: `Reset 2-step for ${id}@example.test`, exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByText(new RegExp(`${id}@example.test`)).waitFor();
    if (id === "first") {
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      assert.equal(requests.filter((r) => r.path.endsWith("/mfa-reset")).length, 0);
      await page
        .getByRole("button", { name: `Reset 2-step for ${id}@example.test`, exact: true })
        .click();
    }
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Reset 2-step", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(requests.filter((r) => r.path === `/admin/staff/${id}/mfa-reset`).length, 1);
    const row = page.getByRole("row").filter({ hasText: `${id}@example.test` });
    await row.getByText("Not enrolled", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: `Reset password for ${id}@example.test`, exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByText(new RegExp(`${id}@example.test`))
      .waitFor();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Reset Password", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(requests.filter((r) => r.path === `/admin/staff/${id}/password-reset`).length, 1);
  }
  console.log(
    "PASS adjacent rows: cancel, confirm, authenticator and email actions target the displayed account",
  );
  staff.find((r) => r.id === "second").mfaEnabled = true;
  await page.getByRole("button", { name: "Refresh staff status" }).click();
  await page
    .getByRole("row")
    .filter({ hasText: "second@example.test" })
    .getByText("Enrolled", { exact: true })
    .waitFor();
  staff.find((r) => r.id === "first").mfaEnabled = true;
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page
    .getByRole("row")
    .filter({ hasText: "first@example.test" })
    .getByText("Enrolled", { exact: true })
    .waitFor();
  console.log("PASS manual and focus refresh update authenticator status");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/usvc-staff-recovery-admin-mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

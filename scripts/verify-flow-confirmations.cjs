/* global process, Buffer, console, URL, document, window, sessionStorage, Event */
/** Run against a completed local build: npm run start -- --port 3100, then npm run test:flow-confirmations.
 * All backend requests are intercepted. No real accounts, orders, emails or payments are used.
 * FLOW_TEST_BROWSER=chromium uses an installed Playwright Chromium instead of system Chrome.
 */
const assert = require("node:assert/strict");
const { setTimeout: pause } = require("node:timers/promises");
const { chromium } = require("playwright");
const base = process.env.FLOW_TEST_BASE_URL || "http://localhost:3100";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local test server only");
const copy = (value) => JSON.parse(JSON.stringify(value));
const address = {
  firstName: "Sample",
  lastName: "Applicant",
  line1: "123 Sample St",
  line2: "",
  city: "Albany",
  state: "New York",
  postalCode: "12207",
  country: "United States",
  addressType: "domestic",
};
const original = {
  _id: "flow-test",
  publicNumber: "USNY-BT-20261023-TEST01",
  certificate: "BIRTH",
  stateName: "New York",
  stateCode: "NY",
  stateSlug: "new-york",
  geo: { county: "Albany", city: "Albany" },
  reason: "Personal records",
  reasonOther: "",
  applicant: {
    relationship: "Self",
    firstName: "Sample",
    lastName: "Applicant",
    dateOfBirth: "1990-01-01",
    email: "sample@example.test",
    phone: "+15555550123",
  },
  subject: {
    firstName: "Sample",
    lastName: "Subject",
    sex: "Male",
    eventDate: "2000-01-01",
    stillLiving: "Yes",
  },
  family: {
    fatherStatus: "Unknown",
    motherFirstName: "Sample",
    motherCurrentLastName: "Parent",
    motherLastName: "Parent",
  },
  addresses: { home: address, shipping: address, billing: address },
  copies: 1,
  rush: false,
  deliveryMethod: "Regular",
  destinationType: "domestic",
  status: "IN_REVIEW",
  paymentStatus: "PAID",
  assignedTo: "actor",
  assignedName: "Test Actor",
  notes: [{ body: "Synthetic completion note", createdAt: "2026-10-23T00:00:00Z" }],
  document: {
    name: "completion.pdf",
    size: 1024,
    uploadedAt: "2026-10-23T00:00:00Z",
    uploadedBy: "actor",
  },
  createdAt: "2026-10-23T00:00:00Z",
  cardLast4: "1111",
  amountCents: 14900,
  pricing: { serviceCents: 14900, rushCents: 0, totalCents: 14900 },
};
const roster = [
  {
    id: "actor",
    fullName: "Test Actor",
    email: "actor@example.test",
    role: "ADMIN",
    accountStatus: "active",
    mfaEnabled: true,
    activeOrders: 0,
  },
  {
    id: "agent",
    fullName: "Test Agent",
    email: "agent@example.test",
    role: "FULFILLMENT",
    accountStatus: "active",
    mfaEnabled: true,
    activeOrders: 0,
  },
  {
    id: "pending",
    fullName: "Pending Agent",
    email: "pending@example.test",
    role: "CS",
    accountStatus: "pending",
    mfaEnabled: false,
    activeOrders: 0,
  },
  {
    id: "disabled",
    fullName: "Disabled Agent",
    email: "disabled@example.test",
    role: "CS",
    accountStatus: "disabled",
    mfaEnabled: false,
    activeOrders: 0,
  },
];
async function until(predicate) {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (predicate()) return;
    await pause(20);
  }
  throw new Error("Timed out waiting for test request");
}
(async () => {
  const browser = await chromium.launch({
    channel: process.env.FLOW_TEST_BROWSER === "chromium" ? undefined : "chrome",
    headless: true,
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    sessionStorage.setItem(
      "usvc-staff-access",
      `x.${window.btoa(JSON.stringify({ role: "ADMIN", sub: "actor", email: "actor@example.test" }))}.x`,
    );
    sessionStorage.setItem("usvc-staff-refresh", "synthetic-refresh");
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let order = copy(original),
    staff = copy(roster),
    failNext = null,
    holdPath = null,
    releaseHeld = null;
  const writes = [],
    passed = [];
  await context.route("**/api/backend/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname.replace("/api/backend", "");
    const method = request.method();
    let body = {};
    if (method === "GET") {
      if (path === "/staff/orders/flow-test") body = order;
      else if (path === "/admin/staff") body = { staff };
      else if (path.endsWith("/audit")) body = { auditEvents: [] };
      else if (path === "/staff/orders") body = { orders: [], total: 0, pages: 1 };
      else if (path === "/staff/unpaid-orders/flow-test")
        body = {
          order: {
            id: "flow-test",
            publicNumber: order.publicNumber,
            certificate: "BIRTH",
            stateCode: "NY",
            stateName: "New York",
            customerName: "Sample Applicant",
            email: "sample@example.test",
            phone: "+15555550123",
            createdAt: original.createdAt,
            amountCents: 14900,
            currency: "USD",
            paymentStatus: "PENDING",
            status: "DRAFT",
            outcome: "NOT_CONTACTED",
            unresolved: false,
          },
          history: [],
        };
    } else {
      const payload = (request.headers()["content-type"] || "").includes("application/json")
        ? request.postDataJSON()
        : { multipart: true };
      writes.push({ path, method, payload });
      if (path === holdPath)
        await new Promise((resolve) => {
          releaseHeld = resolve;
        });
      if (failNext === path) {
        failNext = null;
        return route.fulfill({
          status: 422,
          contentType: "application/json",
          body: JSON.stringify({
            message: "Synthetic server rejection",
            errors: { "applicant.firstName": "Check this name" },
          }),
        });
      }
      if (path === "/orders/flow-test/status") {
        order.status = payload.status;
        if (payload.status === "GTG" || payload.status === "TO_CS") order.assignedTo = null;
      }
      if (path === "/orders/flow-test/reopen") order.status = payload.status;
      if (path === "/staff/orders/flow-test/correction")
        for (const key of [
          "applicant",
          "subject",
          "family",
          "addresses",
          "geo",
          "reason",
          "reasonOther",
          "deliveryMethod",
          "destinationType",
        ])
          if (payload[key] !== undefined) order[key] = payload[key];
      if (path === "/orders/flow-test/document")
        order.document =
          method === "DELETE" ? null : { ...original.document, name: "new-completion.pdf" };
      if (path === "/staff/orders/flow-test/reassign") {
        order.assignedTo = payload.staffId;
        order.assignedName = "Test Agent";
      }
      if (path === "/staff/unpaid-orders/flow-test/resume-link")
        body = {
          url: "http://localhost:3100/resume#synthetic-token",
          expiresAt: "2026-10-25T00:00:00Z",
        };
      if (path.startsWith("/auth/invite") || path.endsWith("/password-reset"))
        body = { emailed: true };
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  const count = (path) => writes.filter((write) => write.path === path).length;
  const dialog = () => page.getByRole("dialog");
  async function navigate(path) {
    await page.goto(base + path);
    await page.addStyleTag({
      content:
        "html,body,* {scroll-behavior:auto!important;transition:none!important;animation:none!important}",
    });
  }
  async function detail(status = "IN_REVIEW") {
    order = copy(original);
    order.status = status;
    await navigate("/staff/flow-test");
    await page.getByRole("tab", { name: "Summary", exact: true }).waitFor();
  }
  async function cs() {
    order = copy(original);
    order.status = "TO_CS";
    await navigate("/staff/cs/edit/flow-test");
    await page.locator(".staff-application-sections").waitFor();
  }
  async function exercise(name, open, label, path, { failure = false, pending = false } = {}) {
    const before = count(path);
    await open();
    await dialog().waitFor();
    assert.equal(count(path), before, `${name}: initiating action must not mutate`);
    assert(await page.evaluate(() => Boolean(document.activeElement.closest('[role="dialog"]'))));
    if ((await dialog().locator("input, select, textarea").count()) === 0) {
      assert.equal(
        await dialog()
          .getByRole("button", { name: "Cancel", exact: true })
          .evaluate((node) => node === document.activeElement),
        true,
      );
    }
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => Boolean(document.activeElement.closest('[role="dialog"]'))));
    await page.keyboard.press("Shift+Tab");
    assert(await page.evaluate(() => Boolean(document.activeElement.closest('[role="dialog"]'))));
    await page.keyboard.press("Escape");
    await dialog().waitFor({ state: "hidden" });
    assert.equal(count(path), before);
    assert(
      await page.evaluate(() => document.activeElement !== document.body),
      `${name}: restore opener focus`,
    );
    await open();
    await dialog().waitFor();
    if (failure) failNext = path;
    if (pending) holdPath = path;
    await dialog()
      .getByRole("button", { name: label, exact: true })
      .evaluate((button) => {
        button.click();
        button.click();
      });
    await until(() => count(path) === before + 1);
    if (pending) {
      await until(() => releaseHeld !== null);
      assert.equal(await dialog().getAttribute("aria-busy"), "true");
      assert.equal(
        await dialog().getByRole("button", { name: "Cancel", exact: true }).isDisabled(),
        true,
      );
      await page.keyboard.press("Escape");
      await page.mouse.click(2, 2);
      assert.equal(await dialog().count(), 1);
      const release = releaseHeld;
      releaseHeld = null;
      holdPath = null;
      release();
    }
    if (failure) {
      await dialog()
        .getByRole("alert")
        .getByText("Synthetic server rejection", { exact: true })
        .waitFor();
      assert.equal(count(path), before + 1, `${name}: failed action must not auto-retry`);
      await dialog().getByRole("button", { name: label, exact: true }).click();
      await until(() => count(path) === before + 2);
    }
    await dialog().waitFor({ state: "hidden" });
    assert.equal(
      count(path),
      before + (failure ? 2 : 1),
      `${name}: one request per explicit confirmation`,
    );
    passed.push(name);
    console.log("PASS", name);
  }
  try {
    await detail();
    await page.getByRole("tab", { name: "Application (Owners only)", exact: true }).click();
    await page
      .getByRole("button", { name: "Proceed to Notes & Document Upload", exact: true })
      .click();
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll('[role="tab"]')).some(
        (tab) =>
          tab.getAttribute("aria-selected") === "true" &&
          tab.textContent?.includes("Notes & Document Upload"),
      ),
    );
    passed.push("Application hand-off to Notes tab");
    const chooseSubmission = async () => {
      await page.getByRole("tab", { name: "Notes & Document Upload", exact: true }).click();
      await page.getByRole("button", { name: "Submit to Government Agency", exact: true }).click();
    };
    await exercise(
      "Agency submission: cancel, keyboard trap, duplicate guard, pending dismissal, failure/retry",
      chooseSubmission,
      "Mark as submitted",
      "/orders/flow-test/status",
      { failure: true, pending: true },
    );
    assert.equal(
      writes.filter((w) => w.path === "/orders/flow-test/status").at(-1).payload.status,
      "SUBMITTED",
    );
    await detail("PAID");
    await exercise(
      "Start order processing",
      () =>
        page.getByRole("button", { name: "Start Order Processing", exact: true }).first().click(),
      "Start Order Processing",
      "/orders/flow-test/status",
    );
    assert.equal(writes.at(-1).payload.status, "IN_REVIEW");
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll('[role="tab"]')).some(
        (tab) =>
          tab.getAttribute("aria-selected") === "true" &&
          tab.textContent?.includes("Application (Owners only)"),
      ),
    );
    await detail();
    const toCs = async () => {
      await page.getByRole("tab", { name: "Application (Owners only)", exact: true }).click();
      await page.getByLabel("Note for CS (required)").fill("Synthetic CS review required");
      await page.getByLabel("Substatus (optional)").selectOption("1st Contact");
      await page.getByRole("button", { name: "Send to CS", exact: true }).click();
    };
    await exercise("To CS with required note", toCs, "Send To CS", "/orders/flow-test/status");
    assert.equal(writes.at(-1).payload.note, "Synthetic CS review required");
    assert.equal(writes.at(-1).payload.substatus, "1st Contact");
    await detail("TO_CS");
    await exercise(
      "GTG from order detail",
      async () => {
        await page.getByRole("tab", { name: "Application (Owners only)", exact: true }).click();
        await page.getByRole("button", { name: "Mark GTG", exact: true }).click();
      },
      "Mark GTG",
      "/orders/flow-test/status",
    );
    await detail("GTG");
    await exercise(
      "Resume after GTG",
      async () => {
        await page.getByRole("tab", { name: "Application (Owners only)", exact: true }).click();
        await page.getByRole("button", { name: "Resume Order Processing", exact: true }).click();
      },
      "Resume Order Processing",
      "/orders/flow-test/status",
    );
    await detail();
    await exercise(
      "Drop ownership",
      () => page.getByRole("button", { name: "Drop Ownership", exact: true }).click(),
      "Drop Ownership",
      "/staff/orders/flow-test/release",
    );
    await detail();
    await exercise(
      "Reassignment",
      async () => {
        await page.getByLabel("Reassign to").focus();
        await page.getByLabel("Reassign to").selectOption("agent");
      },
      "Reassign order",
      "/staff/orders/flow-test/reassign",
    );
    assert.equal(writes.at(-1).payload.staffId, "agent");
    await detail("SUBMITTED");
    const reopen = async () => {
      await page.getByRole("button", { name: "Reopen order…", exact: true }).click();
      assert.equal(
        await dialog().getByRole("button", { name: "Restore status", exact: true }).isDisabled(),
        true,
      );
      await dialog()
        .getByLabel("Reason (required, recorded in the audit trail)")
        .fill("Synthetic accidental submission");
    };
    await exercise("Reason-required reopen", reopen, "Restore status", "/orders/flow-test/reopen");
    for (const replace of [false, true]) {
      await detail();
      if (!replace) {
        order.document = null;
        await navigate("/staff/flow-test");
        await page.getByRole("tab", { name: "Summary", exact: true }).waitFor();
      }
      await page.getByRole("tab", { name: "Notes & Document Upload", exact: true }).click();
      const selectFile = () =>
        page.locator('input[type="file"]').setInputFiles({
          name: "new-completion.pdf",
          mimeType: "application/pdf",
          buffer: Buffer.from("%PDF-1.4\n% synthetic\n%%EOF"),
        });
      await exercise(
        replace ? "PDF replacement" : "New PDF upload",
        selectFile,
        replace ? "Replace PDF" : "Upload PDF",
        "/orders/flow-test/document",
      );
      assert.equal(writes.at(-1).payload.multipart, true);
    }
    await detail();
    await page.getByRole("tab", { name: "Notes & Document Upload", exact: true }).click();
    await exercise(
      "PDF deletion",
      () => page.getByRole("button", { name: "Delete", exact: true }).click(),
      "Delete",
      "/orders/flow-test/document",
    );
    await cs();
    await page.getByLabel("First Name of Requestor", { exact: false }).fill("Corrected");
    assert.equal(
      await page.getByRole("button", { name: "Mark GTG", exact: true }).isDisabled(),
      true,
    );
    const save = () => page.getByRole("button", { name: "Save corrections", exact: true }).click();
    await save();
    await dialog().waitFor();
    await page.getByLabel("First Name of Requestor", { exact: false }).evaluate((input) => {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(
        input,
        "Changed during refresh",
      );
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await dialog().waitFor({ state: "hidden" });
    assert.equal(count("/staff/orders/flow-test/correction"), 0);
    passed.push("Stale correction snapshot cancels without mutation");
    await page.getByLabel("Your Social Security Number", { exact: true }).fill("123-45-6789");
    await page.getByLabel("Credit Card Number", { exact: true }).fill("4111111111111111");
    await page.getByLabel("Credit Card Expiry Date (MM/YY)", { exact: true }).fill("12/30");
    await page.getByLabel("CVV", { exact: true }).fill("123");
    const savePrivate = async () => {
      await save();
      await dialog().waitFor();
      const text = await dialog().innerText();
      assert(
        !text.includes("123-45-6789") &&
          !text.includes("4111111111111111") &&
          !text.includes("12/30"),
      );
    };
    await exercise(
      "CS save with private replacements and server-error retry",
      savePrivate,
      "Save corrections",
      "/staff/orders/flow-test/correction",
      { failure: true },
    );
    assert.equal(
      await page.getByRole("button", { name: "Mark GTG", exact: true }).isEnabled(),
      true,
    );
    await page.getByLabel("Note", { exact: true }).fill("Synthetic optional GTG note");
    assert.equal(
      await page.getByRole("button", { name: "Mark GTG", exact: true }).isEnabled(),
      true,
    );
    await exercise(
      "CS GTG with optional note",
      () => page.getByRole("button", { name: "Mark GTG", exact: true }).click(),
      "Mark GTG",
      "/orders/flow-test/status",
    );
    assert.equal(writes.at(-1).payload.note, "Synthetic optional GTG note");
    await navigate("/staff/unpaid-orders/flow-test");
    await page.getByRole("button", { name: "Generate resume link", exact: false }).waitFor();
    await exercise(
      "Create recovery link",
      () => page.getByRole("button", { name: "Generate resume link", exact: false }).click(),
      "Create recovery link",
      "/staff/unpaid-orders/flow-test/resume-link",
    );
    await exercise(
      "Replace recovery link",
      () => page.getByRole("button", { name: "Replace link", exact: false }).click(),
      "Create recovery link",
      "/staff/unpaid-orders/flow-test/resume-link",
    );
    const admin = async () => {
      staff = copy(roster);
      await navigate("/staff/admin");
      await page.getByLabel("Role for agent@example.test").waitFor();
    };
    const adminActions = [
      [
        "Role change",
        async () => {
          await page.getByLabel("Role for agent@example.test").focus();
          await page.getByLabel("Role for agent@example.test").selectOption("CS");
        },
        "Change Role",
        "/admin/staff/agent",
      ],
      [
        "Session revocation",
        () =>
          page
            .getByRole("button", { name: "Revoke sessions for agent@example.test", exact: true })
            .click(),
        "Revoke sessions",
        "/admin/staff/agent/revoke",
      ],
      [
        "MFA reset",
        () =>
          page
            .getByRole("button", { name: "Reset 2-step for agent@example.test", exact: true })
            .click(),
        "Reset 2-step",
        "/admin/staff/agent/mfa-reset",
      ],
      [
        "Password reset",
        () =>
          page
            .getByRole("button", { name: "Reset password for agent@example.test", exact: true })
            .click(),
        "Reset Password",
        "/admin/staff/agent/password-reset",
      ],
      [
        "Deactivate account",
        () =>
          page.getByRole("button", { name: "Deactivate agent@example.test", exact: true }).click(),
        "Deactivate account",
        "/admin/staff/agent",
      ],
      [
        "Reactivate account",
        () =>
          page
            .getByRole("button", { name: "Reactivate disabled@example.test", exact: true })
            .click(),
        "Reactivate account",
        "/admin/staff/disabled",
      ],
      [
        "Resend invitation",
        () =>
          page
            .getByRole("button", {
              name: "Re-send invitation to pending@example.test",
              exact: true,
            })
            .click(),
        "Re-send invitation",
        "/auth/invite/pending/resend",
      ],
    ];
    for (const [name, open, label, path] of adminActions) {
      await admin();
      await exercise(name, open, label, path);
    }
    await admin();
    const invite = async () => {
      await page.getByRole("button", { name: /Invite staff member/ }).click();
      await dialog().getByLabel("Full name").fill("New Agent");
      await dialog().getByLabel("Work email").fill("new@example.test");
    };
    await exercise("Staff invitation", invite, "Send invitation", "/auth/invite");
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await detail();
      await chooseSubmission();
      await dialog().waitFor();
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      );
      await page.screenshot({ path: `/tmp/usvc-flow-confirm-${width}.png` });
      await dialog().getByRole("button", { name: "Cancel", exact: true }).click();
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await navigate("/staff/settings");
    await page.getByLabel("Current password", { exact: true }).fill("synthetic-current");
    await page
      .getByLabel("New password (8+ characters)", { exact: true })
      .fill("synthetic-new-password");
    await page.getByLabel("Confirm new password", { exact: true }).fill("synthetic-new-password");
    const password = async () => {
      await page.getByRole("button", { name: "Change password", exact: true }).click();
      await dialog().waitFor();
      const text = await dialog().innerText();
      assert(!text.includes("synthetic-current") && !text.includes("synthetic-new-password"));
    };
    await exercise("Own-password change", password, "Change password", "/auth/password");
    const limited = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await limited.addInitScript(() =>
      sessionStorage.setItem(
        "usvc-staff-access",
        `x.${window.btoa(JSON.stringify({ role: "FULFILLMENT", sub: "actor", email: "actor@example.test" }))}.x`,
      ),
    );
    let deniedWrites = 0;
    await limited.route("**/api/backend/**", async (route) => {
      const request = route.request();
      if (request.method() !== "GET") deniedWrites++;
      const path = new URL(request.url()).pathname;
      const body = path.endsWith("/staff/orders/flow-test")
        ? { ...original, document: null, notes: [] }
        : path.endsWith("/audit")
          ? { auditEvents: [] }
          : { orders: [], staff: [], total: 0 };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
    const limitedPage = await limited.newPage();
    await limitedPage.goto(base + "/staff/flow-test");
    await limitedPage.getByRole("tab", { name: "Notes & Document Upload", exact: true }).click();
    assert.equal(
      await limitedPage
        .getByRole("button", { name: "Submit to Government Agency", exact: true })
        .isDisabled(),
      true,
    );
    await limitedPage
      .getByText("Upload the completion PDF and add at least one internal note above.", {
        exact: true,
      })
      .waitFor();
    await limitedPage.goto(base + "/staff/cs/edit/flow-test");
    await limitedPage
      .getByText("Order editing is restricted to CS and ADMIN roles.", { exact: true })
      .waitFor();
    assert.equal(deniedWrites, 0);
    passed.push("Fulfillment submission prerequisites and CS role restriction preserved");
    await limited.close();
    assert.deepEqual(errors, []);
    console.log(
      JSON.stringify({ passed, protectedMutations: writes.length, pageErrors: errors }, null, 2),
    );
  } finally {
    if (releaseHeld) releaseHeld();
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

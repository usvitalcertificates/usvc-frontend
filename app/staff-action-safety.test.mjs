import test from "node:test";
import assert from "node:assert/strict";
import { hasUnsavedApplicationChanges } from "../lib/staff-action-safety.ts";

const form = {
  applicant: { firstName: "Example" },
  subject: { firstName: "Subject" },
  family: { fatherStatus: "Unknown" },
  addresses: { shipping: { line1: "Example address" } },
  county: "Albany",
  reason: "Personal records",
  deliveryMethod: "Regular",
  ssn: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  note: "",
};
const initial = JSON.stringify(form);
test("saved applications and optional GTG notes do not block GTG", () => {
  assert.equal(hasUnsavedApplicationChanges(null, ""), false);
  assert.equal(hasUnsavedApplicationChanges(form, initial), false);
  assert.equal(
    hasUnsavedApplicationChanges({ ...form, note: "Reviewed and corrected" }, initial),
    false,
  );
});
test("unsaved application edits and sensitive replacements block GTG", () => {
  for (const patch of [
    { applicant: { firstName: "Changed" } },
    { subject: { firstName: "Changed" } },
    { family: { fatherStatus: "Known" } },
    { addresses: { shipping: { line1: "Changed" } } },
    { county: "Queens" },
    { reason: "Other" },
    { deliveryMethod: "UPS Air" },
    { ssn: "123-45-6789" },
    { cardNumber: "4111111111111111" },
    { cardExpiry: "12/30" },
    { cardCvc: "123" },
  ])
    assert.equal(hasUnsavedApplicationChanges({ ...form, ...patch }, initial), true);
  assert.equal(hasUnsavedApplicationChanges(form, ""), true);
});
test("saving a correction establishes a new clean baseline", () => {
  const corrected = { ...form, county: "Saratoga", note: "" };
  assert.equal(hasUnsavedApplicationChanges(corrected, JSON.stringify(corrected)), false);
  assert.equal(
    hasUnsavedApplicationChanges({ ...corrected, note: "GTG" }, JSON.stringify(corrected)),
    false,
  );
});

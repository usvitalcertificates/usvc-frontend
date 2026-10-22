import test from "node:test";
import assert from "node:assert/strict";
import {
  applicationSections,
  applicationCopyText,
  applicationReasonLabel,
  resolveFormConfig,
  applicationSectionKeys,
  visiblePersonFields,
} from "../lib/form-config.ts";
import { parseDateUS, dateEntryUS, formatDateUS } from "../lib/date-format.ts";

const order = (certificate, extra = {}) => ({
  certificate,
  stateName: "California",
  stateCode: "CA",
  stateSlug: "california",
  geo: { county: "Alameda", city: "Oakland" },
  reason: "Other",
  reasonOther: "Personal record",
  applicant: {
    firstName: "Example",
    lastName: "Applicant",
    relationship: "Other",
    relationshipOther: "Representative",
    dateOfBirth: "1990-12-31",
  },
  subject: { sex: "Female", eventDate: "2000-02-29" },
  family: { fatherStatus: "Known" },
  addresses: {
    home: { addressType: "military", state: "APO" },
    shipping: { addressType: "international", country: "Canada" },
  },
  copies: 2,
  rush: true,
  deliveryMethod: "UPS Air",
  ...extra,
});
for (const [type, title, family] of [
  ["BIRTH", "Information About the Subject", true],
  ["DEATH", "Information About the Subject", false],
  ["MARRIAGE", "Marriage Details", false],
  ["DIVORCE", "Divorce Details", false],
]) {
  test(`${type} has public section order, labels, and consecutive numbering`, () => {
    const sections = applicationSections(order(type));
    assert.deepEqual(
      sections.map((s) => s.title),
      [
        "Information About the Certificate",
        "Information About the Requestor",
        title,
        ...(family ? ["Parent / Family Information"] : []),
        "Shipping & Contact Information",
        "Copies & Processing",
        "Billing Details",
        "Credit Card Details",
      ],
    );
    assert.deepEqual(
      sections.map((s) => s.number),
      sections.map((_, i) => i + 1),
    );
    const fields = sections.flatMap((s) => s.groups.flatMap((g) => g.fields));
    assert.equal(
      fields.find((f) => f.path === "reason").label,
      type === "BIRTH" || type === "DEATH"
        ? "Reason for Request"
        : "Reason for requesting this certificate",
    );
    assert.equal(
      fields.find((f) => f.path === "applicant.firstName").label,
      "First Name of Requestor",
    );
    assert.equal(fields.find((f) => f.path === "applicant.middleName").value, "");
    assert.equal(fields.find((f) => f.path === "applicant.dateOfBirth").required, true);
    assert.equal(fields.find((f) => f.path === "subject.middleName").required, undefined);
    assert.equal(
      fields.find((f) => f.path === "geo.county").label,
      `County where the ${type.toLowerCase()} occurred`,
    );
  });
}
test("spouses share the event section; missing legacy fields remain available", () => {
  for (const type of ["MARRIAGE", "DIVORCE"]) {
    const section = applicationSections(order(type, { subject: {}, family: {} })).find(
      (s) => s.key === "subject",
    );
    assert.deepEqual(
      section.groups.map((g) => g.title),
      ["Spouse 1", "Spouse 2"],
    );
    assert.equal(
      section.groups[1].fields.find((f) => f.path === "family.spouseMaidenLastName").required,
      true,
    );
    assert.equal(
      section.groups[0].fields.find((f) => f.path === "subject.eventDate").required,
      true,
    );
  }
});
test("birth gender and father status follow the public conditional fields", () => {
  const fields = (data) =>
    applicationSections(data).flatMap((s) => s.groups.flatMap((g) => g.fields));
  const male = fields(
    order("BIRTH", {
      subject: { sex: "Male" },
      family: { fatherStatus: "Unknown", fatherFirstName: "Old value" },
    }),
  );
  assert.equal(
    male.some((f) => f.path === "subject.subjectMaidenLastName"),
    false,
  );
  assert.equal(
    male.some((f) => f.path === "family.fatherFirstName"),
    false,
  );
  const female = fields(order("BIRTH"));
  assert.equal(female.find((f) => f.path === "subject.subjectMaidenLastName").required, true);
  assert.equal(female.find((f) => f.path === "family.fatherFirstName").required, true);
});
test("address groups and jurisdiction names match the public form", () => {
  const data = order("BIRTH");
  const fields = applicationSections(data, "parish").flatMap((s) =>
    s.groups.flatMap((g) => g.fields),
  );
  assert.equal(
    fields.find((f) => f.path === "geo.county").label,
    "Parish where the birth occurred",
  );
  assert.equal(fields.find((f) => f.path === "addresses.home.state").label, "APO/FPO");
  assert.equal(
    fields.find((f) => f.path === "addresses.shipping.state").label,
    "International State/Province",
  );
  assert.ok(fields.some((f) => f.path === "addresses.shipping.country"));
  assert.equal(
    fields.some((f) => f.path === "addresses.home.country"),
    false,
  );
  assert.equal(fields.find((f) => f.path === "addresses.shipping.addressType").locked, false);
});
test("copy includes exact labels and US dates, omitting blanks and secrets", () => {
  const sections = applicationSections(order("BIRTH"));
  const text = applicationCopyText(sections.flatMap((s) => s.groups.flatMap((g) => g.fields)));
  assert.match(text, /Your date of birth: 12\/31\/1990/);
  assert.match(text, /Subject's Date of Birth: 02\/29\/2000/);
  assert.doesNotMatch(text, /Middle Name|Social Security|Credit Card Number|1990-12-31/);
});
test("shared public configuration resolves state overrides and conditional fields", () => {
  const config = resolveFormConfig("california", "birth-certificate");
  assert.equal(config.requestor.showSsn, true);
  assert.equal(applicationSectionKeys(config).at(-1), "submit");
  assert.equal(
    visiblePersonFields(config, true, "Male").some((f) => f.key === "subjectMaidenLastName"),
    false,
  );
  assert.equal(
    applicationReasonLabel("divorce-certificate"),
    "Reason for requesting this certificate",
  );
});
test("US entry validates leap years and impossible dates without timezone shifts", () => {
  for (const [entry, iso] of [
    ["02/29/2000", "2000-02-29"],
    ["12/31/1990", "1990-12-31"],
    ["01/01/2026", "2026-01-01"],
  ]) {
    assert.equal(parseDateUS(entry), iso);
    assert.equal(dateEntryUS(iso), entry);
    assert.equal(formatDateUS(iso), entry);
  }
  for (const invalid of [
    "02/29/1900",
    "02/30/2024",
    "13/01/2024",
    "00/01/2024",
    "1/1/2024",
    "2024-01-01",
    "",
    "01/01/0000",
  ])
    assert.equal(parseDateUS(invalid), null);
});

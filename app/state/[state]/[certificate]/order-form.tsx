"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { createOrder, verifyOrderBeforePayment, type Certificate } from "@/lib/api";
import { getAnalyticsAttribution, trackAnalytics } from "@/app/analytics";
import { isCountyTemporarilyUnavailable } from "@/lib/county-availability";
import {
  PROCESSING_CLARIFICATION_NOTE,
  resolveFormConfig,
  type CertificateSlug,
  type FieldDef,
} from "@/lib/form-config";
import {
  jurisdictionLabel,
  jurisdictionNoun,
  loadStateGeography,
  type StateGeography,
} from "@/lib/geo";
import {
  ADDRESS_SECTION_NOTES,
  ADDRESS_TYPE_OPTIONS,
  APO_FPO_OPTIONS,
  INTERNATIONAL_COUNTRIES,
  PROCESSING_PAYMENT_AUTHORIZATION_TEXT,
  STATES,
} from "@/lib/states";

const certificateMap: Record<string, Certificate> = {
  "birth-certificate": "BIRTH",
  "death-certificate": "DEATH",
  "marriage-certificate": "MARRIAGE",
  "divorce-certificate": "DIVORCE",
};
const stateCodes: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  "district-of-columbia": "DC",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new-hampshire": "NH",
  "new-jersey": "NJ",
  "new-mexico": "NM",
  "new-york": "NY",
  "north-carolina": "NC",
  "north-dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "puerto-rico": "PR",
  "rhode-island": "RI",
  "south-carolina": "SC",
  "south-dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west-virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
};

const DRAFT_EXCLUDED = new Set([
  "requestorSsn",
  "confirmEmail",
  "cardNumber",
  "cardExpiry",
  "cardSecurityCode",
]);

function readable(value: string) {
  return value
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function addressTypeOf(label: string): "domestic" | "military" | "international" {
  if (label.startsWith("US Military")) return "military";
  if (label.startsWith("International")) return "international";
  return "domestic";
}

const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Live SSN mask: digits capped at 9, hyphens inserted as XXX-XX-XXXX. */
function formatSsnInput(value: string): string {
  const digits = digitsOnly(value).slice(0, 9);
  const parts = [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5, 9)].filter(
    (part) => part !== "",
  );
  return parts.join("-");
}

/** Light SSN plausibility: 9 digits, area not 000/666/9xx, group not 00, serial not 0000. */
function isPlausibleSsn(value: string): boolean {
  const digits = digitsOnly(value);
  if (!/^\d{9}$/.test(digits)) return false;
  const area = digits.slice(0, 3);
  if (area === "000" || area === "666" || area[0] === "9") return false;
  if (digits.slice(3, 5) === "00" || digits.slice(5) === "0000") return false;
  return true;
}

/** Live card mask: digits capped at 16, grouped XXXX XXXX XXXX XXXX. */
function formatCardInput(value: string): string {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function cardBrandOf(value: string): "visa" | "mastercard" | null {
  const digits = digitsOnly(value);
  if (!digits) return null;
  if (digits[0] === "4") return "visa";
  if (digits[0] === "5") return "mastercard";
  return null;
}

/** Live expiry mask: digits capped at 4, slash inserted as MM/YY. */
function formatExpiryInput(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length <= 2 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isPlausibleExpiryMonth(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 2) return true;
  const month = Number(digits.slice(0, 2));
  return month >= 1 && month <= 12;
}

/** Rewrite an uncontrolled input in place (typing, paste, autofill). */
function applyMask(event: { target?: EventTarget | null }, format: (value: string) => string) {
  const input = event.target as HTMLInputElement | null;
  if (!input || typeof input.value !== "string") return;
  const next = format(input.value);
  if (next !== input.value) input.value = next;
}

/** Backend error key -> form input name(s). Dynamic subject/family keys use the
 *  config field key as the input name; address keys map to prefixed inputs. */
function inputNamesForError(key: string): string[] {
  switch (key) {
    case "county":
      return ["county"];
    case "reasonOther":
      return ["reasonOther"];
    case "requestorSsn":
      return ["requestorSsn"];
    case "applicant.email":
      return ["email"];
    case "applicant.dateOfBirth":
      return ["applicantDob"];
    case "applicant.phone":
      return ["phone"];
    case "applicant.relationshipOther":
      return ["relationshipOther"];
    case "paymentCard.number":
      return ["cardNumber"];
    case "paymentCard.expiry":
      return ["cardExpiry"];
    case "paymentCard.securityCode":
      return ["cardSecurityCode"];
    case "signature":
      return ["signature"];
    default:
      break;
  }
  if (key.startsWith("subject.") || key.startsWith("family."))
    return [key.slice(key.indexOf(".") + 1)];
  const address =
    /^addresses\.(home|shipping|billing)\.(line1|line2|city|state|postalCode|country)$/.exec(key);
  if (address) {
    const suffix: Record<string, string> = {
      line1: "Line1",
      line2: "Line2",
      city: "City",
      state: "State",
      postalCode: "Zip",
      country: "Country",
    };
    return [`${address[1]}${suffix[address[2]]}`];
  }
  return [];
}

/** Backend error key -> owning section number (scroll fallback). */
function sectionForError(key: string): number {
  if (key === "county" || key === "reasonOther") return 1;
  if (key === "requestorSsn" || key.startsWith("applicant.")) return 2;
  if (key.startsWith("subject.")) return 3;
  if (key.startsWith("family.")) return 4;
  if (key.startsWith("addresses.home.") || key.startsWith("addresses.shipping.")) return 5;
  if (key === "totalCents") return 6;
  if (key.startsWith("addresses.billing.")) return 7;
  if (key.startsWith("paymentCard.")) return 8;
  if (key === "consents" || key === "signature") return 10;
  return 11;
}

/** Rank for picking the first error in form order (lower = earlier). */
function errorRank(key: string): number {
  switch (key) {
    case "county":
      return 10;
    case "reasonOther":
      return 11;
    case "applicant.relationshipOther":
      return 20;
    case "requestorSsn":
      return 21;
    case "applicant.dateOfBirth":
      return 22;
    case "applicant.email":
      return 23;
    case "applicant.phone":
      return 24;
    case "totalCents":
      return 60;
    case "paymentCard.number":
      return 81;
    case "paymentCard.expiry":
      return 82;
    case "paymentCard.securityCode":
      return 83;
    case "consents":
      return 100;
    case "signature":
      return 101;
    default:
      break;
  }
  if (key.startsWith("subject.")) return 30;
  if (key.startsWith("family.")) return 40;
  if (key.startsWith("addresses.")) return 50;
  return 200;
}

/** Form input name -> backend error key(s) to clear once the user edits it.
 *  `county` is excluded: its select clears its own error, and the
 *  blocked-county banner derives from the live selection. */
function errorKeysForInput(name: string): string[] {
  switch (name) {
    case "county":
      return [];
    case "reasonOther":
      return ["reasonOther"];
    case "requestorSsn":
      return ["requestorSsn"];
    case "email":
      return ["applicant.email"];
    case "confirmEmail":
      return ["applicant.email"];
    case "applicantDob":
      return ["applicant.dateOfBirth"];
    case "phone":
    case "phoneVisible":
      return ["applicant.phone"];
    case "relationshipOther":
      return ["applicant.relationshipOther"];
    case "cardNumber":
      return ["paymentCard.number"];
    case "cardExpiry":
      return ["paymentCard.expiry"];
    case "cardSecurityCode":
      return ["paymentCard.securityCode"];
    case "signature":
      return ["signature"];
    default:
      break;
  }
  const address = /^(home|shipping|billing)(Line1|Line2|City|State|Zip|Country)$/.exec(name);
  if (address) {
    const field: Record<string, string> = {
      Line1: "line1",
      Line2: "line2",
      City: "city",
      State: "state",
      Zip: "postalCode",
      Country: "country",
    };
    return [`addresses.${address[1]}.${field[address[2]]}`];
  }
  if (name) return [`subject.${name}`, `family.${name}`];
  return [];
}

function Field({
  def,
  defaultValue,
  error,
}: {
  def: FieldDef;
  defaultValue?: string;
  error?: string;
}) {
  const id = `field-${def.key}`;
  return (
    <label className={`application-field${def.wide ? " wide" : ""}`} htmlFor={id}>
      {def.label} {def.required ? <span>*</span> : null}
      {def.type === "select" ? (
        <select id={id} name={def.key} required={def.required} defaultValue={defaultValue ?? ""}>
          <option value="">Please select…</option>
          {(def.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={def.key}
          type={def.type === "date" ? "date" : "text"}
          required={def.required}
          defaultValue={defaultValue ?? ""}
        />
      )}
      {def.help ? <small>{def.help}</small> : null}
      {error ? (
        <small className="application-error" role="alert">
          {error}
        </small>
      ) : null}
    </label>
  );
}

function FormSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="application-section" id={`application-section-${number}`}>
      <h2>
        <span>{number}.</span> {title}
      </h2>
      <div className="patriotic-rule" aria-hidden="true" />
      <div className="application-section-content">{children}</div>
    </section>
  );
}

function AddressFields({
  prefix,
  legend,
  draft,
  typeLabel,
  requestorFirst,
  requestorLast,
  errors,
}: {
  prefix: string;
  legend: string;
  draft: Record<string, string>;
  typeLabel: string;
  requestorFirst: string;
  requestorLast: string;
  errors: Record<string, string>;
}) {
  const type = addressTypeOf(typeLabel);
  const note = ADDRESS_SECTION_NOTES[prefix];
  const get = (key: string) => draft[`${prefix}${key}`] ?? "";
  return (
    <fieldset className="address-fields">
      <legend>{legend}</legend>
      {note ? (
        <p className="address-note">
          <strong>{note.title}</strong> {note.body}
        </p>
      ) : null}
      <div className="application-grid">
        <label className="application-field wide">
          {legend} Type <span>*</span>
          <select
            name={`${prefix}Type`}
            required
            defaultValue={draft[`${prefix}Type`] ?? ADDRESS_TYPE_OPTIONS[0].label}
          >
            {ADDRESS_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="application-field">
          <span>First Name</span>
          <p className="readonly-name">{requestorFirst.trim() || "—"}</p>
        </div>
        <div className="application-field">
          <span>Last Name</span>
          <p className="readonly-name">{requestorLast.trim() || "—"}</p>
        </div>
        <label className="application-field wide">
          Address Line 1 <span>*</span>
          <input name={`${prefix}Line1`} required defaultValue={get("Line1")} />
          {errors[`addresses.${prefix}.line1`] ? (
            <small className="application-error" role="alert">
              {errors[`addresses.${prefix}.line1`]}
            </small>
          ) : null}
        </label>
        <label className="application-field wide">
          Address Line 2 (optional)
          <input name={`${prefix}Line2`} defaultValue={get("Line2")} />
        </label>
        <label className="application-field">
          City <span>*</span>
          <input name={`${prefix}City`} required defaultValue={get("City")} />
          {errors[`addresses.${prefix}.city`] ? (
            <small className="application-error" role="alert">
              {errors[`addresses.${prefix}.city`]}
            </small>
          ) : null}
        </label>
        {type === "domestic" ? (
          <label className="application-field">
            State <span>*</span>
            <select name={`${prefix}State`} required defaultValue={get("State")}>
              <option value="">Select state…</option>
              {STATES.map((state) => (
                <option key={state.abbreviation} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>
        ) : type === "military" ? (
          <label className="application-field">
            APO/FPO <span>*</span>
            <select name={`${prefix}State`} required defaultValue={get("State")}>
              <option value="">Select</option>
              {APO_FPO_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="application-field">
            International State/Province <span>*</span>
            <input name={`${prefix}State`} required defaultValue={get("State")} />
          </label>
        )}
        <label className="application-field">
          Zip/Postal Code <span>*</span>
          <input name={`${prefix}Zip`} required defaultValue={get("Zip")} />
          {errors[`addresses.${prefix}.postalCode`] ? (
            <small className="application-error" role="alert">
              {errors[`addresses.${prefix}.postalCode`]}
            </small>
          ) : null}
        </label>
        {type === "international" ? (
          <label className="application-field">
            Country <span>*</span>
            <select name={`${prefix}Country`} required defaultValue={get("Country")}>
              <option value="">Select</option>
              {INTERNATIONAL_COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
    </fieldset>
  );
}

function ReviewBlock({
  title,
  target,
  children,
}: {
  title: string;
  target: number;
  children: React.ReactNode;
}) {
  return (
    <section className="review-block">
      <div>
        <h3>{title}</h3>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById(`application-section-${target}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          Edit
        </button>
      </div>
      <dl>{children}</dl>
    </section>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatAddress(parts: {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}) {
  return (
    [
      parts.line1,
      parts.line2,
      `${parts.city}, ${parts.state} ${parts.postalCode}`.trim(),
      parts.country,
    ]
      .filter((part) => part && part.trim() && part.trim() !== ",")
      .join(" · ") || "—"
  );
}

const show = (value: string | undefined) => (value && value.trim() ? value : "—");
const CONSENT_KEYS = [
  "accurate",
  "govtId",
  "terms",
  "privacy",
  "refund",
  "independent",
  "processingPayment",
] as const;

export function OrderForm({ stateCode, certificate }: { stateCode: string; certificate: string }) {
  const stateSlug = stateCode.toLowerCase();
  const certSlug = certificate as CertificateSlug;
  const config = useMemo(() => resolveFormConfig(stateSlug, certSlug), [stateSlug, certSlug]);
  const abbr = stateCodes[stateSlug] ?? stateSlug.slice(0, 2).toUpperCase();
  const stateName = readable(stateSlug);
  const short = certificate.replace("-certificate", "");
  const certificateName = `${stateName} ${short.replace(/^./, (letter) => letter.toUpperCase())} Certificate`;
  const draftKey = `usvc.orderDraft.v1:${stateSlug}:${certSlug}`;

  const [draft] = useState<Record<string, string>>(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  });
  const [values, setValues] = useState<Record<string, string>>(() => draft);
  // E.164 phone value. Old drafts may hold raw national digits; normalize those
  // to +1 once so untouched restores still submit valid E.164.
  const [phoneValue, setPhoneValue] = useState<string>(() => {
    const saved = draft.phone ?? "";
    if (!saved || saved.startsWith("+")) return saved;
    const digits = saved.replace(/\D/g, "");
    const ten = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
    return ten.length === 10 ? `+1${ten}` : saved;
  });
  function handlePhoneChange(value: string) {
    setPhoneValue(value);
    setValues((current) => ({ ...current, phone: value }));
  }
  const [consents, setConsents] = useState<Record<(typeof CONSENT_KEYS)[number], boolean>>({
    accurate: false,
    govtId: false,
    terms: false,
    privacy: false,
    refund: false,
    independent: false,
    processingPayment: false,
  });
  const allConsents = CONSENT_KEYS.every((key) => consents[key]);
  const [geo, setGeo] = useState<StateGeography>({ state: abbr, counties: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  /** Temporarily blocked county, derived from the live selection (selectable,
   *  but blocks payment). Null when the selection is usable. */
  const blockedCounty = (() => {
    const county = values.county ?? draft.county ?? "";
    return county && isCountyTemporarilyUnavailable(abbr, county) ? county : null;
  })();

  /** Scroll to and focus the input for an error key, falling back to its section. */
  function scrollToErrorKey(key: string) {
    const form = formRef.current;
    for (const name of inputNamesForError(key)) {
      const target = form?.querySelector(`[name="${CSS.escape(name)}"]`) as HTMLElement | null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        (target as HTMLInputElement).focus?.({ preventScroll: true });
        return;
      }
    }
    document
      .getElementById(`application-section-${sectionForError(key)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToFirstError(errors: Record<string, string>) {
    const first = Object.keys(errors).sort((a, b) => errorRank(a) - errorRank(b))[0];
    if (first) scrollToErrorKey(first);
  }

  /** Toggle invalid styling on inputs whose backend error key is active. */
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const invalid = new Set<string>();
    for (const key of Object.keys(fieldErrors))
      for (const name of inputNamesForError(key)) invalid.add(name);
    if (blockedCounty) invalid.add("county");
    form.querySelectorAll("[name]").forEach((element) => {
      const name = element.getAttribute("name") ?? "";
      if (invalid.has(name)) {
        element.setAttribute("data-invalid", "true");
        element.setAttribute("aria-invalid", "true");
      } else {
        element.removeAttribute("data-invalid");
        element.removeAttribute("aria-invalid");
      }
    });
    // The phone picker renders its own inner input; mirror the phone state there.
    const phoneInput = form.querySelector(".usvc-phone-input input");
    if (phoneInput) {
      if (invalid.has("phone")) {
        phoneInput.setAttribute("data-invalid", "true");
        phoneInput.setAttribute("aria-invalid", "true");
      } else {
        phoneInput.removeAttribute("data-invalid");
        phoneInput.removeAttribute("aria-invalid");
      }
    }
  }, [fieldErrors, blockedCounty]);
  const noun = jurisdictionNoun(geo.counties.length ? geo : undefined);

  useEffect(() => {
    loadStateGeography(abbr)
      .then(setGeo)
      .catch(() => undefined);
  }, [abbr]);

  useEffect(() => {
    trackAnalytics("select_certificate", {
      certificate: certificateMap[certificate],
      state_code: abbr,
    });
  }, [certificate]);

  const counties = geo.counties;
  const cities = useMemo(
    () => counties.find((c) => c.name === values.county)?.cities ?? [],
    [counties, values.county],
  );
  const selectedCounty = counties.find((c) => c.name === (values.county ?? draft.county));

  const copies = Math.min(20, Math.max(1, Number(values.copies ?? draft.copies ?? 1) || 1));
  const rush = (values.processing ?? draft.processing ?? "standard") === "rush";
  const shippingIntl =
    addressTypeOf(values.shippingType ?? draft.shippingType ?? ADDRESS_TYPE_OPTIONS[0].label) ===
    "international";
  // Two-fee model: only the Online Processing Fee (+ rush) is charged now.
  const total = copies * 149 + (rush ? 45 : 0);
  const serviceCents = 149 * copies;

  const requestorFirst = values.applicantFirstName ?? draft.applicantFirstName ?? "";
  const requestorLast = values.applicantLastName ?? draft.applicantLastName ?? "";
  const relationship = values.relationship ?? draft.relationship ?? "";
  const reason = values.reason ?? draft.reason ?? "";

  function syncForm(event?: { target?: EventTarget | null }) {
    const changed = (event?.target as HTMLElement | null)?.getAttribute("name");
    if (changed) {
      const keys = errorKeysForInput(changed);
      if (keys.length)
        setFieldErrors((current) => {
          if (!keys.some((key) => key in current)) return current;
          const next = { ...current };
          for (const key of keys) delete next[key];
          return next;
        });
    }
    const form = formRef.current;
    if (!form) return;
    applyAddressCopies(form);
    const data = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, String(v)]),
    );
    if (isCountyTemporarilyUnavailable(abbr, data.county ?? "")) {
      data.county = "";
      data.city = "";
    }
    // Browser autofill and password managers often fill fields without firing
    // React change events, so merge instead of replacing: never blank a value
    // the user already entered just because one sync missed it.
    setValues((prev) => {
      const merged = { ...data };
      for (const [k, v] of Object.entries(prev)) {
        if ((merged[k] === undefined || merged[k] === "") && v !== "") merged[k] = v;
      }
      return merged;
    });
    try {
      const saveable = Object.fromEntries(
        Object.entries(data).filter(([k]) => !DRAFT_EXCLUDED.has(k)),
      );
      sessionStorage.setItem(draftKey, JSON.stringify(saveable));
    } catch {
      /* storage unavailable */
    }
  }

  function copyAddress(from: string, to: string) {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    for (const key of ["Line1", "Line2", "City", "State", "Zip", "Type", "Country"]) {
      const target = form.elements.namedItem(`${to}${key}`) as
        HTMLInputElement | HTMLSelectElement | null;
      if (target) target.value = String(data.get(`${from}${key}`) ?? "");
    }
  }

  /** Keeps copied addresses in sync on every change so required billing/shipping
   *  fields are never empty while a "same as" option is selected. */
  function applyAddressCopies(form: HTMLFormElement) {
    const checkedValue = (name: string) =>
      (form.querySelector(`input[name="${name}"]:checked`) as HTMLInputElement | null)?.value ?? "";
    if (checkedValue("sameShipping") === "yes") copyAddress("home", "shipping");
    const billingSource = checkedValue("billingSource");
    if (billingSource === "home") copyAddress("home", "billing");
    else if (billingSource === "shipping") copyAddress("shipping", "billing");
  }

  function toggleAll(checked: boolean) {
    setConsents({
      accurate: checked,
      govtId: checked,
      terms: checked,
      privacy: checked,
      refund: checked,
      independent: checked,
      processingPayment: checked,
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    applyAddressCopies(form);
    const formData = new FormData(form);
    const get = (key: string) => String(formData.get(key) ?? "").trim();
    if (blockedCounty) {
      setError(
        `Certificate issuance is currently unavailable through ${blockedCounty} ${noun} authority. Please select a different ${noun}.`,
      );
      document
        .getElementById("application-section-1")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (get("email") !== get("confirmEmail")) {
      setError("Email addresses do not match.");
      setFieldErrors({ "applicant.email": "Email addresses do not match." });
      document
        .getElementById("application-section-5")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      (formRef.current?.querySelector('[name="email"]') as HTMLInputElement | null)?.focus?.({
        preventScroll: true,
      });
      return;
    }
    if (!allConsents || !get("signature")) {
      setError("Please sign and accept the required certification statements before continuing.");
      document
        .getElementById("application-section-10")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    trackAnalytics("order_started", { certificate: certificateMap[certificate], state_code: abbr });
    setError("");
    setFieldErrors({});
    try {
      const subject: Record<string, string> = {};
      for (const field of config.person) subject[field.key] = get(field.key);
      const family: Record<string, string> = {};
      for (const field of [...config.family, ...(config.familySecond ?? [])])
        family[field.key] = get(field.key);
      if (config.familySecondStatus)
        family[config.familySecondStatus.key] = get(config.familySecondStatus.key);
      const address = (prefix: string) => {
        const typeLabel = get(`${prefix}Type`) || ADDRESS_TYPE_OPTIONS[0].label;
        const type = addressTypeOf(typeLabel);
        return {
          firstName: get("applicantFirstName"),
          middleName: get("applicantMiddleName"),
          lastName: get("applicantLastName"),
          line1: get(`${prefix}Line1`),
          line2: get(`${prefix}Line2`),
          city: get(`${prefix}City`),
          state: get(`${prefix}State`),
          postalCode: get(`${prefix}Zip`),
          country: type === "international" ? get(`${prefix}Country`) : "United States",
          addressType: type,
        };
      };
      const acceptedAt = new Date().toISOString();
      const payload = {
        stateSlug,
        stateCode: abbr,
        stateName,
        certificate: certificateMap[certificate],
        county: get("county"),
        city: get("city"),
        reason: get("reason"),
        reasonOther: get("reasonOther"),
        applicant: {
          relationship: get("relationship"),
          relationshipOther: get("relationshipOther"),
          firstName: get("applicantFirstName"),
          lastName: get("applicantLastName"),
          dateOfBirth: get("applicantDob"),
          phone: get("phone"),
          email: get("email"),
        },
        requestorSsn: get("requestorSsn"),
        subject,
        family,
        addresses: {
          home: address("home"),
          shipping: address("shipping"),
          billing: address("billing"),
        },
        destinationType: shippingIntl ? ("international" as const) : ("domestic" as const),
        copies,
        rush,
        deliveryMethod: get("delivery"),
        consents: { ...consents },
        processingAuthorization: {
          accepted: true as const,
          text: PROCESSING_PAYMENT_AUTHORIZATION_TEXT,
          acceptedAt,
        },
        signature: get("signature"),
        paymentCard: {
          number: get("cardNumber"),
          expiry: get("cardExpiry"),
          securityCode: get("cardSecurityCode"),
        },
        analytics: getAnalyticsAttribution(),
        totalCents: Math.round(total * 100),
      };
      await verifyOrderBeforePayment(payload);
      const order = await createOrder(payload);
      try {
        sessionStorage.removeItem(draftKey);
      } catch {
        /* ignore */
      }
      window.location.assign(`/checkout/${order.id}`);
    } catch (caught) {
      const withErrors = caught as Error & { errors?: Record<string, string> };
      if (withErrors.errors) {
        setFieldErrors(withErrors.errors);
        scrollToFirstError(withErrors.errors);
      }
      setError(caught instanceof Error ? caught.message : "Unable to continue to secure payment.");
    } finally {
      setBusy(false);
    }
  }

  const fatherStatus = values[config.familySecondStatus?.key ?? ""] ?? "";
  const fatherRequired = config.familySecondStatus?.requiredWhen.includes(fatherStatus) ?? false;
  const reasonDisplay = reason === "Other" ? values.reasonOther?.trim() || "Other" : reason || "—";
  const relationshipDisplay =
    relationship === "Other" ? values.relationshipOther?.trim() || "Other" : relationship || "—";
  const cardProvided = Boolean((values.cardNumber ?? "").replace(/[\s-]/g, ""));
  const ssnDigits = digitsOnly(values.requestorSsn ?? "").length;
  const ssnLiveError =
    ssnDigits === 0
      ? ""
      : ssnDigits < 9
        ? `Enter all 9 digits (${ssnDigits}/9).`
        : isPlausibleSsn(values.requestorSsn ?? "")
          ? ""
          : "This Social Security Number doesn't look valid.";
  const cardDigits = digitsOnly(values.cardNumber ?? "").length;
  const cardBrand = cardBrandOf(values.cardNumber ?? "");
  const expiryMonthOk = isPlausibleExpiryMonth(values.cardExpiry ?? "");

  const addressValues = (prefix: string) => ({
    line1: values[`${prefix}Line1`] ?? "",
    line2: values[`${prefix}Line2`] ?? "",
    city: values[`${prefix}City`] ?? "",
    state: values[`${prefix}State`] ?? "",
    postalCode: values[`${prefix}Zip`] ?? "",
    country:
      values[`${prefix}Country`] ??
      (addressTypeOf(values[`${prefix}Type`] ?? "") === "international" ? "" : "United States"),
  });

  return (
    <form
      ref={formRef}
      className="application-form"
      onSubmit={submit}
      onChange={syncForm}
      onInput={syncForm}
      onBlur={syncForm}
    >
      <div className="form-head-notices">
        <p>
          <strong>ID Requirements must be met before certificate is issued.</strong> You will
          receive an email with instructions on how to send your ID within one week of submitting
          this application.
        </p>
        <p>
          Items with an <span>*</span> asterisk are required fields.
        </p>
        <p className="hint">
          <strong className="important-note">Important:</strong>{" "}
          <em>
            The online Vital Certificate Processing Fee is payable upon ordering and the relevant
            Vital Statistics Agency Fee and any other shipping fees are payable upon review and
            acceptance by the State Agency and will appear on your credit card statement separately.
          </em>
        </p>
        <p className="hint">
          <em>Please note: All state certificate fees are subject to change without notice.</em>
        </p>
      </div>

      <FormSection number={1} title="Information About the Certificate">
        <div className="application-grid">
          <label className="application-field">
            Certificate Type <span>*</span>
            <input
              name="certificate"
              defaultValue={certificateName.replace(`${stateName} `, "")}
              disabled
            />
          </label>
          <label className="application-field">
            State / Territory <span>*</span>
            <input name="state" defaultValue={stateName} disabled />
          </label>
          <label className="application-field">
            {`${noun.charAt(0).toUpperCase()}${noun.slice(1)} where the ${config.eventLocationLabel} occurred`}{" "}
            <span>*</span>
            <select
              name="county"
              required
              value={values.county ?? draft.county ?? ""}
              onChange={(event) => {
                const county = event.target.value;
                setFieldErrors((current) => {
                  const { county: _county, ...remaining } = current;
                  return remaining;
                });
                setValues((v) => ({ ...v, county, city: "" }));
              }}
            >
              <option value="">
                Select {stateName} {noun}
              </option>
              {counties.map((c) => (
                <option key={c.id} value={c.name}>
                  {jurisdictionLabel(c)}
                </option>
              ))}
            </select>
            {blockedCounty ? (
              <div className="county-blocked-alert" role="alert">
                <strong>Certificate issuance is currently unavailable</strong> through{" "}
                {blockedCounty} {noun} authority. Please select a different {noun}.
              </div>
            ) : null}
            {fieldErrors.county ? (
              <small className="application-error" role="alert">
                {fieldErrors.county}
              </small>
            ) : null}
          </label>
          <label className="application-field">
            {`City / town where the ${config.eventLocationLabel} occurred`} <span>*</span>
            <select
              name="city"
              required
              value={values.city ?? draft.city ?? ""}
              onChange={(event) => setValues((v) => ({ ...v, city: event.target.value }))}
              disabled={!values.county && !draft.county}
            >
              <option value="">
                {(values.county ?? draft.county) ? "Select city or town" : `Select ${noun} first`}
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <small>{config.eventLocationHelp}</small>
          </label>
          <label className="application-field wide">
            Reason for requesting this certificate <span>*</span>
            <select name="reason" required defaultValue={draft.reason ?? ""}>
              <option value="">Please select…</option>
              {config.reasons.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          {reason === "Other" ? (
            <label className="application-field wide">
              Please describe your reason <span>*</span>
              <input name="reasonOther" required defaultValue={draft.reasonOther ?? ""} />
              {fieldErrors.reasonOther ? (
                <small className="application-error" role="alert">
                  {fieldErrors.reasonOther}
                </small>
              ) : null}
            </label>
          ) : null}
        </div>
      </FormSection>

      <fieldset className="county-blocked-fields">
        <FormSection number={2} title="Information About the Requestor">
          <div className="application-grid">
            <label className="application-field wide">
              Your relationship to the person named on the certificate <span>*</span>
              <select name="relationship" required defaultValue={draft.relationship ?? ""}>
                <option value="">Please select…</option>
                {config.relationships.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            {relationship === "Other" ? (
              <label className="application-field wide">
                Please describe your relationship <span>*</span>
                <input
                  name="relationshipOther"
                  required
                  defaultValue={draft.relationshipOther ?? ""}
                />
                {fieldErrors["applicant.relationshipOther"] ? (
                  <small className="application-error">
                    {fieldErrors["applicant.relationshipOther"]}
                  </small>
                ) : null}
              </label>
            ) : null}
            <label className="application-field">
              Your first name <span>*</span>
              <input
                name="applicantFirstName"
                required
                defaultValue={draft.applicantFirstName ?? ""}
              />
            </label>
            <label className="application-field">
              Your middle name
              <input name="applicantMiddleName" defaultValue={draft.applicantMiddleName ?? ""} />
            </label>
            <label className="application-field">
              Your last name <span>*</span>
              <input
                name="applicantLastName"
                required
                defaultValue={draft.applicantLastName ?? ""}
              />
            </label>
          </div>
          {config.requestor.note ? (
            <div className="group-note">
              <strong>{config.requestor.note.title}</strong>
              <em>{config.requestor.note.body}</em>
            </div>
          ) : null}
          <div className="application-grid">
            {config.requestor.showDateOfBirth ? (
              <label className="application-field">
                Your date of birth {config.requestor.dateOfBirthRequired ? <span>*</span> : null}
                <input
                  name="applicantDob"
                  type="date"
                  required={config.requestor.dateOfBirthRequired}
                  defaultValue={draft.applicantDob ?? ""}
                />
                {fieldErrors["applicant.dateOfBirth"] ? (
                  <small className="application-error">
                    {fieldErrors["applicant.dateOfBirth"]}
                  </small>
                ) : null}
              </label>
            ) : null}
            {config.requestor.showSsn ? (
              <label className="application-field">
                Your Social Security Number {config.requestor.ssnRequired ? <span>*</span> : null}
                <input
                  name="requestorSsn"
                  type="text"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="XXX-XX-XXXX"
                  required={config.requestor.ssnRequired}
                  onChange={(event) => applyMask(event, formatSsnInput)}
                />
                <small>Shown only while you type. Never stored on this device.</small>
                {ssnLiveError ? (
                  <small className="application-error" role="alert">
                    {ssnLiveError}
                  </small>
                ) : null}
                {fieldErrors.requestorSsn ? (
                  <small className="application-error">{fieldErrors.requestorSsn}</small>
                ) : null}
              </label>
            ) : null}
          </div>
        </FormSection>

        <FormSection number={3} title="Information About the Subject">
          {certSlug === "birth-certificate" ? (
            <p className="adoption-note">
              <strong>ADOPTED?</strong> If the person named on the record was adopted, the record on
              file may show the adoptive details or may be sealed. Please review our{" "}
              <Link href="/faq">FAQ section</Link> for important information before completing this
              section.
            </p>
          ) : null}
          <p>
            {config.personLegend}. {config.personNote ? <em>{config.personNote.body}</em> : null}
          </p>
          <div className="application-grid">
            {config.person.map((field) => {
              const requiredWhenFemale =
                field.key === "subjectMaidenLastName" &&
                (values.sex ?? draft.sex ?? "") === "Female";
              return (
                <Field
                  key={field.key}
                  def={requiredWhenFemale ? { ...field, required: true } : field}
                  defaultValue={draft[field.key]}
                  error={fieldErrors[`subject.${field.key}`]}
                />
              );
            })}
          </div>
        </FormSection>

        <FormSection number={4} title="Parent / Family Information">
          <fieldset>
            <legend>{config.familyLegend}</legend>
            {config.familyNote ? (
              <p>
                <strong>{config.familyNote.title}</strong>
              </p>
            ) : null}
            {config.familyNote ? <em>{config.familyNote.body}</em> : null}
            <div className="application-grid">
              {config.family.map((field) => (
                <Field
                  key={field.key}
                  def={field}
                  defaultValue={draft[field.key]}
                  error={fieldErrors[`family.${field.key}`]}
                />
              ))}
            </div>
          </fieldset>
          {config.familySecondLegend ? (
            <fieldset>
              <legend>{config.familySecondLegend}</legend>
              {config.familySecondNote ? (
                <p>
                  <strong>{config.familySecondNote.title}</strong>
                </p>
              ) : null}
              {config.familySecondNote ? <em>{config.familySecondNote.body}</em> : null}
              {config.familySecondStatus ? (
                <div className="application-grid">
                  <label className="application-field">
                    {config.familySecondStatus.label}{" "}
                    {config.familySecondStatus.required ? <span>*</span> : null}
                    <select
                      name={config.familySecondStatus.key}
                      required={config.familySecondStatus.required}
                      defaultValue={draft[config.familySecondStatus.key] ?? ""}
                    >
                      <option value="">Please select…</option>
                      {config.familySecondStatus.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                    {fieldErrors[`family.${config.familySecondStatus.key}`] ? (
                      <small className="application-error" role="alert">
                        {fieldErrors[`family.${config.familySecondStatus.key}`]}
                      </small>
                    ) : null}
                  </label>
                </div>
              ) : null}
              {fatherRequired || !config.familySecondStatus ? (
                <div className="application-grid">
                  {(config.familySecond ?? []).map((field) => (
                    <Field
                      key={field.key}
                      def={field}
                      defaultValue={draft[field.key]}
                      error={fieldErrors[`family.${field.key}`]}
                    />
                  ))}
                </div>
              ) : null}
            </fieldset>
          ) : null}
        </FormSection>

        <FormSection number={5} title="Shipping & Contact Information">
          <p className="hint">
            <strong className="important-note">Requirements:</strong>{" "}
            <em>The Shipping Address Name must match the Requestor Name.</em>
          </p>
          <AddressFields
            prefix="home"
            legend="Home Address"
            draft={draft}
            typeLabel={values.homeType ?? draft.homeType ?? ""}
            requestorFirst={requestorFirst}
            requestorLast={requestorLast}
            errors={fieldErrors}
          />
          <div className="same-address">
            <strong>Is your Shipping Address the same as your Home Address?</strong>
            <label>
              <input
                type="radio"
                name="sameShipping"
                value="yes"
                onChange={() => {
                  copyAddress("home", "shipping");
                  syncForm();
                }}
              />{" "}
              Yes
            </label>
            <label>
              <input type="radio" name="sameShipping" value="no" defaultChecked /> No
            </label>
            <small>
              Your Home Address will be copied below when you choose Yes. You can still edit it.
            </small>
          </div>
          <AddressFields
            prefix="shipping"
            legend="Shipping Address"
            draft={draft}
            typeLabel={values.shippingType ?? draft.shippingType ?? ""}
            requestorFirst={requestorFirst}
            requestorLast={requestorLast}
            errors={fieldErrors}
          />
          <fieldset>
            <legend>Contact information</legend>
            <div className="application-grid">
              <label className="application-field">
                Phone number <span>*</span>
                <PhoneInput
                  defaultCountry="us"
                  preferredCountries={["us"]}
                  disableCountryGuess
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  className="usvc-phone-input"
                  inputProps={{
                    name: "phoneVisible",
                    required: true,
                    autoComplete: "tel",
                    placeholder: "Daytime Phone Number",
                  }}
                />
                <input type="hidden" name="phone" value={phoneValue} />
                {fieldErrors["applicant.phone"] ? (
                  <small className="application-error" role="alert">
                    {fieldErrors["applicant.phone"]}
                  </small>
                ) : null}
              </label>
              <div />
              <label className="application-field">
                Email address <span>*</span>
                <input name="email" type="email" required defaultValue={draft.email ?? ""} />
                <small>Order confirmation, tracking, and updates are sent to this address.</small>
                {fieldErrors["applicant.email"] ? (
                  <small className="application-error" role="alert">
                    {fieldErrors["applicant.email"]}
                  </small>
                ) : null}
              </label>
              <label className="application-field">
                Confirm email address <span>*</span>
                <input
                  name="confirmEmail"
                  type="email"
                  required
                  autoComplete="off"
                  onPaste={(event) => event.preventDefault()}
                  onDrop={(event) => event.preventDefault()}
                />
                {values.email &&
                values.confirmEmail &&
                values.email.trim() !== values.confirmEmail.trim() ? (
                  <small className="application-error" role="alert">
                    Email addresses do not match. Please type it again.
                  </small>
                ) : null}
              </label>
            </div>
          </fieldset>
        </FormSection>

        <FormSection number={6} title="Copies & Processing">
          <label className="application-field wide">
            Number of Copies <span>*</span>
            <select
              name="copies"
              value={String(copies)}
              onChange={(event) => setValues((v) => ({ ...v, copies: event.target.value }))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "copy" : "copies"}
                </option>
              ))}
            </select>
            <small>Each copy includes the $149.00 USVC Processing Fee.</small>
          </label>
          <label className="application-field wide">
            Delivery Method <span>*</span>
            <select name="delivery" required defaultValue={draft.delivery ?? "Regular"}>
              <option>Regular</option>
              <option>UPS Air</option>
              <option>UPS Worldwide Expedited, Up to 5 Business Days</option>
            </select>
          </label>
          <p className="hint">
            <strong className="important-note">Important:</strong>{" "}
            <em>
              The online Vital Certificate Processing Fee is payable upon ordering and the relevant
              Vital Statistics Agency Fee and any other shipping fees are payable upon review and
              acceptance by the State Agency and will appear on your credit card statement
              separately.
            </em>
          </p>
          <p className="hint">
            <em>
              Regular mail delivery is available, however, we recommend you choose a more secure
              shipping method that provides faster delivery and tracking of your order.
            </em>
          </p>
          <fieldset className="processing-options">
            <legend>Processing speed</legend>
            <label className={rush ? "" : "selected"}>
              <input
                type="radio"
                name="processing"
                value="standard"
                checked={!rush}
                onChange={() => setValues((v) => ({ ...v, processing: "standard" }))}
              />
              <span>
                <strong>Standard Processing</strong>
                <small>
                  Your application is prepared and processed using our standard service workflow.
                  Processing typically takes 5–7 business days.
                </small>
              </span>
              <b>Included</b>
            </label>
            <label className={rush ? "selected" : ""}>
              <input
                type="radio"
                name="processing"
                value="rush"
                checked={rush}
                onChange={() => setValues((v) => ({ ...v, processing: "rush" }))}
              />
              <span>
                <strong>Rush Processing</strong>
                <small>Your application will be processed the next day.</small>
              </span>
              <b>+$45.00 per order</b>
            </label>
          </fieldset>
          <p className="hint">{PROCESSING_CLARIFICATION_NOTE}</p>
        </FormSection>

        <FormSection number={7} title="Billing Details">
          <p className="hint">
            <strong className="important-note">Requirements:</strong>{" "}
            <em>The Billing Address Name must match the Requestor Name.</em>
          </p>
          <p>
            Your billing address is used to verify your payment. Card details are collected in the
            Credit Card Details section below.
          </p>
          <div className="same-address billing-choice">
            <strong>Is your Billing Address the same as another address?</strong>
            <label>
              <input
                type="radio"
                name="billingSource"
                value="home"
                onChange={() => {
                  copyAddress("home", "billing");
                  syncForm();
                }}
              />{" "}
              Same as Home Address
            </label>
            <label>
              <input
                type="radio"
                name="billingSource"
                value="shipping"
                defaultChecked
                onChange={() => {
                  copyAddress("shipping", "billing");
                  syncForm();
                }}
              />{" "}
              Same as Shipping Address
            </label>
            <label>
              <input type="radio" name="billingSource" value="none" /> Neither — Enter Billing
              Address
            </label>
            <small>The selected address has been copied below. You can still edit it.</small>
          </div>
          <AddressFields
            prefix="billing"
            legend="Billing Address"
            draft={draft}
            typeLabel={values.billingType ?? draft.billingType ?? ""}
            requestorFirst={requestorFirst}
            requestorLast={requestorLast}
            errors={fieldErrors}
          />
        </FormSection>

        <FormSection number={8} title="Credit Card Details">
          <p className="hint">
            <strong className="important-note">Important:</strong>{" "}
            <em>
              We currently accept Visa and Mastercard only. Other forms of payment, including
              American Express, Discover and digital wallets, are not supported at this time.
            </em>
          </p>
          <div className="application-grid">
            <label className="application-field wide">
              Credit Card Number <span>*</span>
              <div className="card-number-field">
                <input
                  name="cardNumber"
                  required
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={19}
                  placeholder="4111 1111 1111 1111"
                  defaultValue=""
                  onChange={(event) => applyMask(event, formatCardInput)}
                />
                {cardBrand ? (
                  <img
                    src={cardBrand === "visa" ? "/assets/visa.svg" : "/assets/mastercard.svg"}
                    alt={cardBrand === "visa" ? "Visa" : "Mastercard"}
                    width={36}
                    height={22}
                  />
                ) : null}
              </div>
              {cardDigits > 0 && cardDigits < 16 ? (
                <small className="application-error" role="alert">
                  Enter all 16 digits ({cardDigits}/16).
                </small>
              ) : null}
              {fieldErrors["paymentCard.number"] ? (
                <small className="application-error" role="alert">
                  {fieldErrors["paymentCard.number"]}
                </small>
              ) : null}
            </label>
            <label className="application-field wide">
              Credit Card Expiry Date (MM/YY) <span>*</span>
              <input
                name="cardExpiry"
                required
                inputMode="numeric"
                autoComplete="cc-exp"
                maxLength={5}
                placeholder="MM/YY"
                defaultValue=""
                onChange={(event) => applyMask(event, formatExpiryInput)}
              />
              {!expiryMonthOk ? (
                <small className="application-error" role="alert">
                  Use MM/YY with a month from 01 to 12.
                </small>
              ) : null}
              {fieldErrors["paymentCard.expiry"] ? (
                <small className="application-error" role="alert">
                  {fieldErrors["paymentCard.expiry"]}
                </small>
              ) : null}
            </label>
            <label className="application-field wide">
              CVV <span>*</span>
              <input
                name="cardSecurityCode"
                required
                inputMode="numeric"
                autoComplete="cc-csc"
                maxLength={3}
                placeholder="CVV"
                defaultValue=""
                onChange={(event) => applyMask(event, (value) => digitsOnly(value).slice(0, 3))}
              />
              {fieldErrors["paymentCard.securityCode"] ? (
                <small className="application-error" role="alert">
                  {fieldErrors["paymentCard.securityCode"]}
                </small>
              ) : null}
            </label>
          </div>
          <p className="hint">
            <strong className="important-note">Important:</strong>{" "}
            <em>This is a 3-digit code on the back for Visa and Mastercard.</em>
          </p>
          <div className="card-marks" aria-label="Accepted cards: Visa and Mastercard">
            <img src="/assets/visa.svg" alt="Visa" width={48} height={30} />
            <img src="/assets/mastercard.svg" alt="Mastercard" width={48} height={30} />
          </div>
        </FormSection>

        <FormSection number={9} title="Order Summary">
          <div className="order-summary">
            <h3>{certificateName}</h3>
            <p>
              Number of copies: {copies} certified {copies === 1 ? "copy" : "copies"}
            </p>
            <hr />
            <div>
              <span>
                Online Processing Fee<small>$149.00 per copy × {copies}</small>
              </span>
              <b>${(149 * copies).toFixed(2)}</b>
            </div>
            {rush ? (
              <div>
                <span>
                  Rush Processing<small>Per order</small>
                </span>
                <b>$45.00</b>
              </div>
            ) : null}
            <div className="total">
              <strong>TOTAL</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <p>
              This total includes the USVC Processing Fee and Rush Processing when selected. The
              relevant Vital Statistics Agency Fee and any other shipping fees are payable upon
              review and acceptance by the State Agency and will appear on your credit card
              statement separately.
            </p>
          </div>
        </FormSection>

        <FormSection number={10} title="Review To Submit">
          <ReviewBlock title="Certificate" target={1}>
            <ReviewRow label="Certificate" value={certificateName} />
            <ReviewRow
              label={noun.charAt(0).toUpperCase() + noun.slice(1)}
              value={selectedCounty ? jurisdictionLabel(selectedCounty) : show(values.county)}
            />
            <ReviewRow label="City / town" value={show(values.city)} />
            <ReviewRow label="Reason" value={reasonDisplay} />
          </ReviewBlock>
          <ReviewBlock title="Subject of the certificate" target={3}>
            {config.person.map((field) => (
              <ReviewRow key={field.key} label={field.label} value={show(values[field.key])} />
            ))}
          </ReviewBlock>
          <ReviewBlock title="Parent / Family Information" target={4}>
            {config.family.map((field) => (
              <ReviewRow key={field.key} label={field.label} value={show(values[field.key])} />
            ))}
            {config.familySecondStatus ? (
              <ReviewRow
                label={config.familySecondStatus.label}
                value={show(values[config.familySecondStatus.key])}
              />
            ) : null}
            {(fatherRequired || !config.familySecondStatus ? (config.familySecond ?? []) : []).map(
              (field) => (
                <ReviewRow key={field.key} label={field.label} value={show(values[field.key])} />
              ),
            )}
          </ReviewBlock>
          <ReviewBlock title="Requestor & contact" target={2}>
            <ReviewRow label="Name" value={`${requestorFirst} ${requestorLast}`.trim() || "—"} />
            <ReviewRow label="Relationship" value={relationshipDisplay} />
            {config.requestor.showDateOfBirth ? (
              <ReviewRow label="Date of birth" value={show(values.applicantDob)} />
            ) : null}
            <ReviewRow label="Phone" value={show(values.phone)} />
            <ReviewRow label="Email" value={show(values.email)} />
            <ReviewRow label="Home" value={formatAddress(addressValues("home"))} />
            <ReviewRow label="Ship to" value={formatAddress(addressValues("shipping"))} />
            <ReviewRow label="Bill to" value={formatAddress(addressValues("billing"))} />
          </ReviewBlock>
          <ReviewBlock title="Copies, processing & fees" target={6}>
            <ReviewRow label="Number of copies" value={String(copies)} />
            <ReviewRow
              label="Processing speed"
              value={rush ? "Rush Processing" : "Standard Processing"}
            />
            <ReviewRow label="Online Processing Fee" value={`$${serviceCents.toFixed(2)}`} />
            <ReviewRow label="Rush processing" value={rush ? "$45.00" : "Not selected"} />
            <ReviewRow
              label="Payment card"
              value={cardProvided ? "Card provided (kept private)" : "—"}
            />
            <ReviewRow label="Total" value={`$${total.toFixed(2)}`} />
          </ReviewBlock>

          <label className="application-field wide">
            Electronic Signature <span>*</span>
            <input name="signature" required defaultValue={draft.signature ?? ""} />
            <small>Typing your name serves as your electronic signature for this order.</small>
            {fieldErrors.signature ? (
              <small className="application-error" role="alert">
                {fieldErrors.signature}
              </small>
            ) : null}
          </label>
          <div className="agreements">
            <label className="all-agreement">
              <input
                type="checkbox"
                name="agreement"
                checked={allConsents}
                onChange={(event) => toggleAll(event.target.checked)}
              />
              <span>
                <strong>I agree to all of the statements below.</strong> Selecting this checks every
                item; you may also review and select them individually.
              </span>
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeAccurate"
                required={!allConsents}
                checked={consents.accurate}
                onChange={(event) => setConsents((c) => ({ ...c, accurate: event.target.checked }))}
              />{" "}
              I certify that the information provided is accurate to the best of my knowledge and
              that I am authorized to request this record.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeGovtId"
                required={!allConsents}
                checked={consents.govtId}
                onChange={(event) => setConsents((c) => ({ ...c, govtId: event.target.checked }))}
              />{" "}
              I understand I will receive an email from the relevant government agency with
              instructions on how to send a copy of my government issued picture ID for
              verification.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeTerms"
                required={!allConsents}
                checked={consents.terms}
                onChange={(event) => setConsents((c) => ({ ...c, terms: event.target.checked }))}
              />{" "}
              I agree to the <Link href="/terms-of-service">Terms of Service</Link>.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreePrivacy"
                required={!allConsents}
                checked={consents.privacy}
                onChange={(event) => setConsents((c) => ({ ...c, privacy: event.target.checked }))}
              />{" "}
              I have read the <Link href="/privacy-policy">Privacy Policy</Link>.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeRefund"
                required={!allConsents}
                checked={consents.refund}
                onChange={(event) => setConsents((c) => ({ ...c, refund: event.target.checked }))}
              />{" "}
              I accept the <Link href="/terms-of-service">Refund &amp; Cancellation terms</Link>.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeIndependent"
                required={!allConsents}
                checked={consents.independent}
                onChange={(event) =>
                  setConsents((c) => ({ ...c, independent: event.target.checked }))
                }
              />{" "}
              I understand USVC is an independent service, not a government agency, and that the
              Vital Statistics Agency Fee and any other shipping fees are payable upon review and
              acceptance by the State Agency and will appear on my credit card statement separately.
            </label>
            <label>
              <input
                type="checkbox"
                name="agreeProcessingPayment"
                required={!allConsents}
                checked={consents.processingPayment}
                onChange={(event) =>
                  setConsents((c) => ({ ...c, processingPayment: event.target.checked }))
                }
              />{" "}
              <span>
                <strong>Authorization for the complete order payment.</strong>{" "}
                {PROCESSING_PAYMENT_AUTHORIZATION_TEXT}
              </span>
            </label>
          </div>
          {fieldErrors.consents ? (
            <small className="application-error" role="alert">
              {fieldErrors.consents}
            </small>
          ) : null}
          {Object.keys(fieldErrors).length ? (
            <div role="alert">
              {Object.entries(fieldErrors)
                .filter(([key]) => key !== "county")
                .map(([key, message]) => (
                  <p key={key}>
                    <button
                      type="button"
                      className="application-error error-link"
                      onClick={() => scrollToErrorKey(key)}
                    >
                      {message}
                    </button>
                  </p>
                ))}
            </div>
          ) : null}
        </FormSection>

        <FormSection number={11} title="Payment">
          <p>
            Continue to the secure payment step to complete your order. Your card details are
            encrypted before storage and are visible only to authorized staff for government-agency
            processing.
          </p>
          {error ? (
            <p className="application-error" role="alert">
              {error}
            </p>
          ) : null}
          <div className="payment-action">
            <button className="button button-primary" disabled={busy || Boolean(blockedCounty)}>
              {busy ? "Saving your application…" : "Continue to Secure Payment"}
            </button>
            <strong>Total ${total.toFixed(2)} — one all-inclusive payment</strong>
          </div>
        </FormSection>
      </fieldset>
    </form>
  );
}

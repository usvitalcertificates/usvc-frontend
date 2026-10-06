"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { createOrder, verifyOrderBeforePayment, type Certificate } from "@/lib/api";
import { SearchableSelect } from "./searchable-select";
import { getAnalyticsAttribution, getOpenAIAttribution, trackAnalytics } from "@/app/analytics";
import { trackOpenAICheckoutStarted } from "@/app/openai-analytics";
import { isCountyTemporarilyUnavailable } from "@/lib/county-availability";
import {
  BIRTH_MIN_YEAR,
  DEATH_MIN_YEAR,
  DIVORCE_MIN_YEAR,
  MARRIAGE_MIN_YEAR,
  PROCESSING_CLARIFICATION_NOTE,
  resolveFormConfig,
  SUFFIX_OPTIONS,
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

/** Idempotency key per form fill: retries update the same order instead of
 *  creating a duplicate. Persisted separately from the draft (which rebuilds
 *  from FormData), cleared together with the draft on success. */
function submissionKeyFor(draftKey: string): string {
  const storageKey = `usvc:submission-key:${draftKey}`;
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    sessionStorage.setItem(storageKey, fresh);
  } catch {
    /* ignore */
  }
  return fresh;
}

function clearSubmissionKey(draftKey: string): void {
  try {
    sessionStorage.removeItem(`usvc:submission-key:${draftKey}`);
  } catch {
    /* ignore */
  }
}

/** Mint a single-use Stripe token (tok_...) in the browser so the backend can
 *  charge without raw-PAN Stripe APIs. Posts the card to Stripe's
 *  publishable-key token endpoint — the same endpoint Stripe.js itself uses.
 *  Requires the publishable-key tokenization surface enabled in the Stripe
 *  dashboard (Settings → Integration); without it this returns undefined and
 *  the order proceeds — the backend falls back to the stored card details
 *  (which needs test-mode raw API access instead). Invisible to the user. */
let cachedPublishableKey: string | null | undefined;
async function mintCardToken(card: {
  number: string;
  expiry: string;
  securityCode: string;
}): Promise<string | undefined> {
  try {
    if (cachedPublishableKey === undefined) {
      const res = await fetch("/api/backend/orders/checkout-config");
      cachedPublishableKey = res.ok
        ? (((await res.json()) as { publishableKey?: string }).publishableKey ?? null)
        : null;
    }
    if (!cachedPublishableKey) return undefined;
    const exp = /^(\d{2})\/(\d{2})$/.exec(card.expiry.trim());
    const digits = card.number.replace(/[\s-]/g, "");
    const cvc = card.securityCode.trim();
    if (!exp || !/^\d{16}$/.test(digits) || !/^\d{3}$/.test(cvc)) return undefined;
    const body = new URLSearchParams({
      "card[number]": digits,
      "card[exp_month]": String(Number(exp[1])),
      "card[exp_year]": String(2000 + Number(exp[2])),
      "card[cvc]": cvc,
    });
    const res = await fetch("https://api.stripe.com/v1/tokens", {
      method: "POST",
      headers: { Authorization: `Bearer ${cachedPublishableKey}` },
      body,
    });
    if (!res.ok) return undefined;
    const token = ((await res.json()) as { id?: string }).id;
    return token?.startsWith("tok_") ? token : undefined;
  } catch {
    return undefined;
  }
}

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

/** Stable section keys used for scroll anchors (independent of numbering). */
type SectionKey =
  | "certificate"
  | "requestor"
  | "subject"
  | "family"
  | "shipping"
  | "copies"
  | "billing"
  | "card"
  | "summary"
  | "submit";

/** Backend error key -> owning section key (scroll fallback). When the family
 *  section is merged into the subject section (marriage "Spouse 2"),
 *  family errors scroll to the subject section instead. */
function sectionForError(key: string, familyVisible: boolean): SectionKey {
  if (key === "county" || key === "reasonOther" || key === "state") return "certificate";
  if (key === "requestorSsn" || key.startsWith("applicant.")) return "requestor";
  if (key.startsWith("subject.")) return "subject";
  if (key.startsWith("family.")) return familyVisible ? "family" : "subject";
  if (key.startsWith("addresses.home.") || key.startsWith("addresses.shipping.")) return "shipping";
  if (key === "totalCents") return "copies";
  if (key.startsWith("addresses.billing.")) return "billing";
  if (key.startsWith("paymentCard.")) return "card";
  if (key === "consents" || key === "signature") return "submit";
  return "submit";
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
        <SearchableSelect
          name={def.key}
          inputId={id}
          options={(def.options ?? []).map((option) => ({ value: option, label: option }))}
          defaultValue={defaultValue ?? ""}
          required={def.required}
          placeholder="Please select…"
        />
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
  sectionKey,
  number,
  title,
  children,
}: {
  sectionKey: SectionKey;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="application-section" id={`application-section-${sectionKey}`}>
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
  values,
  setValues,
  typeLabel,
  requestorFirst,
  requestorLast,
  errors,
}: {
  prefix: string;
  legend: string;
  draft: Record<string, string>;
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
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
          <SearchableSelect
            name={`${prefix}Type`}
            required
            value={values[`${prefix}Type`] ?? draft[`${prefix}Type`] ?? ""}
            options={ADDRESS_TYPE_OPTIONS.map((option) => ({
              value: option.label,
              label: option.label,
            }))}
            placeholder="Select…"
            onSelect={(value) => setValues((v) => ({ ...v, [`${prefix}Type`]: value }))}
          />
        </label>
        <div className="application-field">
          <span>First Name</span>
          <p className="readonly-name">{requestorFirst.trim() || "Not provided"}</p>
        </div>
        <div className="application-field">
          <span>Last Name</span>
          <p className="readonly-name">{requestorLast.trim() || "Not provided"}</p>
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
            <SearchableSelect
              name={`${prefix}State`}
              required
              value={values[`${prefix}State`] ?? draft[`${prefix}State`] ?? ""}
              options={STATES.map((state) => ({ value: state.name, label: state.name }))}
              placeholder="Select state…"
              onSelect={(value) => setValues((v) => ({ ...v, [`${prefix}State`]: value }))}
            />
          </label>
        ) : type === "military" ? (
          <label className="application-field">
            APO/FPO <span>*</span>
            <SearchableSelect
              name={`${prefix}State`}
              required
              value={values[`${prefix}State`] ?? draft[`${prefix}State`] ?? ""}
              options={APO_FPO_OPTIONS.map((option) => ({ value: option, label: option }))}
              placeholder="Select"
              onSelect={(value) => setValues((v) => ({ ...v, [`${prefix}State`]: value }))}
            />
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
            <SearchableSelect
              name={`${prefix}Country`}
              required
              value={values[`${prefix}Country`] ?? draft[`${prefix}Country`] ?? ""}
              options={INTERNATIONAL_COUNTRIES.map((country) => ({
                value: country,
                label: country,
              }))}
              placeholder="Select"
              onSelect={(value) => setValues((v) => ({ ...v, [`${prefix}Country`]: value }))}
            />
          </label>
        ) : null}
      </div>
    </fieldset>
  );
}

const CONSENT_KEYS = [
  "accurate",
  "govtId",
  "terms",
  "privacy",
  "refund",
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
  const consents: Record<(typeof CONSENT_KEYS)[number], boolean> = {
    accurate: true,
    govtId: true,
    terms: true,
    privacy: true,
    refund: true,
    processingPayment: true,
  };
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

  /** Scroll to and focus the input for an error key, falling back to its section.
   *  Searchable dropdowns render a visible search box paired with their hidden
   *  value input — focus the visible box, never the hidden one. */
  function scrollToErrorKey(key: string) {
    const form = formRef.current;
    for (const name of inputNamesForError(key)) {
      const searchBox = form?.querySelector(
        `[data-combobox-search="${CSS.escape(name)}"]`,
      ) as HTMLElement | null;
      if (searchBox) {
        searchBox.scrollIntoView({ behavior: "smooth", block: "center" });
        (searchBox as HTMLInputElement).focus?.({ preventScroll: true });
        return;
      }
      const target = form?.querySelector(`[name="${CSS.escape(name)}"]`) as HTMLElement | null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        (target as HTMLInputElement).focus?.({ preventScroll: true });
        return;
      }
    }
    document
      .getElementById(`application-section-${sectionForError(key, hasFamilySection)}`)
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
    // Mirror invalid styling onto searchable-dropdown search boxes: the
    // hidden value inputs match [name] above (invisible), so copy their flags
    // to the paired visible box.
    form.querySelectorAll("input[data-combobox]").forEach((hidden) => {
      const pair = form.querySelector(
        `[data-combobox-search="${CSS.escape(hidden.getAttribute("data-combobox") ?? "")}"]`,
      );
      if (!pair) return;
      if (hidden.getAttribute("data-invalid") === "true") {
        pair.setAttribute("data-invalid", "true");
        pair.setAttribute("aria-invalid", "true");
      } else {
        pair.removeAttribute("data-invalid");
        pair.removeAttribute("aria-invalid");
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
  const delivery = values.delivery ?? draft.delivery ?? "Regular";
  const shippingIntl =
    addressTypeOf(values.shippingType ?? draft.shippingType ?? ADDRESS_TYPE_OPTIONS[0].label) ===
    "international";
  // Two-fee model: only the Online Processing Fee (+ rush) is charged now.
  const total = copies * 149 + (rush ? 45 : 0);

  const requestorFirst = values.applicantFirstName ?? draft.applicantFirstName ?? "";
  const requestorLast = values.applicantLastName ?? draft.applicantLastName ?? "";
  const relationship = values.relationship ?? draft.relationship ?? "";
  const reason = values.reason ?? draft.reason ?? "";
  const isBirth = certSlug === "birth-certificate";
  const isDeath = certSlug === "death-certificate";
  const isMarriage = certSlug === "marriage-certificate";
  const isDivorce = certSlug === "divorce-certificate";
  const spousesTogether = isMarriage || isDivorce;
  const hasFamilySection =
    !config.familyInSubjectSection &&
    (config.family.length > 0 || Boolean(config.familySecondLegend));
  /** Display numbers follow the visible sections only, so a hidden family
   *  section never leaves a numbering gap (death flows 1,2,3,4… instead of
   *  1,2,3,5…). Certificates with a family section keep 1–10 as before. */
  const sectionNumber = (key: SectionKey): number => {
    const order: SectionKey[] = [
      "certificate",
      "requestor",
      "subject",
      ...(hasFamilySection ? (["family"] as SectionKey[]) : []),
      "shipping",
      "copies",
      "billing",
      "card",
      "summary",
      "submit",
    ];
    return order.indexOf(key) + 1;
  };
  const sexValue = values.sex ?? draft.sex ?? "";
  const valueOf = (key: string) => values[key] ?? draft[key] ?? "";

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
        .getElementById("application-section-certificate")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (get("email") !== get("confirmEmail")) {
      setError("Email addresses do not match.");
      setFieldErrors({ "applicant.email": "Email addresses do not match." });
      document
        .getElementById("application-section-shipping")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      (formRef.current?.querySelector('[name="email"]') as HTMLInputElement | null)?.focus?.({
        preventScroll: true,
      });
      return;
    }
    if (!get("signature")) {
      setError("Please type your full name as your signature before continuing.");
      document
        .getElementById("application-section-submit")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    trackAnalytics("order_started", { certificate: certificateMap[certificate], state_code: abbr });
    const chargeCents = Math.round(total * 100);
    const certLabel = `${readable(certificate.replace("-certificate", ""))} Certificate`;
    trackAnalytics("begin_checkout", {
      currency: "USD",
      value: chargeCents / 100,
      state_code: abbr,
      certificate: certificateMap[certificate],
      items: [
        {
          item_id: `usvc-${certificate}`,
          item_name: certLabel,
          quantity: copies,
          price: chargeCents / copies / 100,
        },
      ],
    });
    trackOpenAICheckoutStarted({
      amountCents: chargeCents,
      certificate: certificateMap[certificate],
      copies,
    });
    setError("");
    setFieldErrors({});
    try {
      const subject: Record<string, string> = {};
      for (const field of config.person) subject[field.key] = get(field.key);
      // The maiden field is hidden for a Male subject — never submit a stale value.
      if (certSlug === "birth-certificate" && get("sex") === "Male")
        subject["subjectMaidenLastName"] = "";
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
          middleName: get("applicantMiddleName"),
          lastName: get("applicantLastName"),
          suffix: get("applicantSuffix"),
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
        analytics: { ...getAnalyticsAttribution(), ...getOpenAIAttribution() },
        totalCents: Math.round(total * 100),
        submissionKey: submissionKeyFor(draftKey),
      };
      await verifyOrderBeforePayment(
        (() => {
          // Card travels exactly once (in createOrder below) — never in verify.
          const { paymentCard: _stripped, ...rest } = payload;
          return rest;
        })(),
      );
      const stripeCardToken = await mintCardToken(payload.paymentCard);
      const order = await createOrder(stripeCardToken ? { ...payload, stripeCardToken } : payload);
      if (order.paid === true) {
        // Synchronous service-fee charge succeeded: straight to thank-you.
        try {
          if (order.openAiEventId)
            sessionStorage.setItem(`usvc:oaiq:event-id:${order.id}`, order.openAiEventId);
        } catch {
          /* ignore */
        }
        try {
          sessionStorage.removeItem(draftKey);
          clearSubmissionKey(draftKey);
        } catch {
          /* ignore */
        }
        trackAnalytics("add_payment_info", {
          currency: "USD",
          value: order.amountCents / 100,
          payment_type: "card",
          state_code: abbr,
          certificate: certificateMap[certificate],
        });
        window.location.assign(`/order/confirmation/${order.id}`);
        return;
      } else {
        // Anything that is not a confirmed paid order (declined, failed, or
        // unexpected response): stay on the form; card must be re-entered.
        failCardPayment(
          order.paymentFailureMessage ??
            "Your card was declined. Check the details or try another card (Visa or Mastercard).",
        );
      }
    } catch (caught) {
      const withErrors = caught as Error & {
        errors?: Record<string, string>;
        status?: number;
        orderId?: string;
      };
      // Retry of an already-paid order (or a create-race winner): resolve on
      // the existing confirmation instead of duplicating. Draft/key are kept
      // so an unpaid race can still be retried from the form.
      if (withErrors.status === 409 && withErrors.orderId) {
        window.location.assign(`/order/confirmation/${withErrors.orderId}`);
        return;
      }
      const cardKeys = Object.keys(withErrors.errors ?? {}).filter((key) =>
        key.startsWith("paymentCard."),
      );
      if (withErrors.status === 402 || cardKeys.length > 0) {
        failCardPayment(
          withErrors.errors?.["paymentCard.number"] ??
            (caught instanceof Error ? caught.message : "") ??
            "Your card was declined. Check the details or try another card (Visa or Mastercard).",
        );
      } else {
        if (withErrors.errors) {
          setFieldErrors(withErrors.errors);
          scrollToFirstError(withErrors.errors);
        }
        setError(caught instanceof Error ? caught.message : "Unable to submit your order.");
      }
    } finally {
      setBusy(false);
    }
  }

  /** Charge failure: never retain PAN — clear card inputs + state (draft already
   *  excludes card fields), pin the error to the card section for re-entry.
   *  Uses fieldErrors only (not the generic error box) so the message shows
   *  once, in the error summary with a link that scrolls to the card. */
  function failCardPayment(message: string) {
    const form = formRef.current;
    for (const name of ["cardNumber", "cardExpiry", "cardSecurityCode"]) {
      const input = form?.querySelector(`[name="${name}"]`) as HTMLInputElement | null;
      if (input) input.value = "";
    }
    setValues((prev) => {
      const next = { ...prev };
      delete next.cardNumber;
      delete next.cardExpiry;
      delete next.cardSecurityCode;
      return next;
    });
    setFieldErrors({ "paymentCard.number": message });
    scrollToErrorKey("paymentCard.number");
  }

  const fatherStatus = values[config.familySecondStatus?.key ?? ""] ?? "";
  const fatherRequired = config.familySecondStatus?.requiredWhen.includes(fatherStatus) ?? false;
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

  /** USVR-style soft cross-checks (birth only): warnings, never blockers. */
  const maidenWarnings: string[] = [];
  if (isBirth) {
    const same = (a: string, b: string) => {
      const x = a.trim().toLowerCase();
      const y = b.trim().toLowerCase();
      return x !== "" && y !== "" && x === y;
    };
    const different = (a: string, b: string) => {
      const x = a.trim().toLowerCase();
      const y = b.trim().toLowerCase();
      return x !== "" && y !== "" && x !== y;
    };
    const motherMaiden = valueOf("motherLastName");
    const motherCurrent = valueOf("motherCurrentLastName");
    const fatherLast = valueOf("fatherLastName");
    const subjectLast = valueOf("lastName");
    const subjectMaiden = sexValue === "Male" ? "" : valueOf("subjectMaidenLastName");
    if (same(motherMaiden, fatherLast))
      maidenWarnings.push("Mother maiden name is the same as father's last name.");
    if (different(subjectMaiden, subjectLast))
      maidenWarnings.push("The Subject's maiden name is different than their last name.");
    if (
      different(subjectMaiden, motherCurrent) &&
      different(subjectMaiden, motherMaiden) &&
      different(subjectMaiden, fatherLast)
    )
      maidenWarnings.push("The Subject's maiden name is different than either parent's last name.");
    if (same(motherMaiden, motherCurrent))
      maidenWarnings.push("Mother maiden name is the same as last name.");
  }

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
          <strong>
            ID requirements set by the issuing agency must be met before it can issue a certificate.
          </strong>{" "}
          We usually email instructions on how to send your ID within one week of submitting this
          application.
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

      <FormSection
        sectionKey="certificate"
        number={sectionNumber("certificate")}
        title="Information About the Certificate"
      >
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
            <SearchableSelect
              name="county"
              required
              value={values.county ?? draft.county ?? ""}
              options={counties.map((c) => ({ value: c.name, label: jurisdictionLabel(c) }))}
              placeholder={`Select ${stateName} ${noun}`}
              onSelect={(county) => {
                setFieldErrors((current) => {
                  const { county: _county, ...remaining } = current;
                  return remaining;
                });
                setValues((v) => ({ ...v, county, city: "" }));
              }}
            />
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
            <SearchableSelect
              name="city"
              required
              value={values.city ?? draft.city ?? ""}
              options={cities.map((city) => ({ value: city, label: city }))}
              placeholder={
                (values.county ?? draft.county) ? "Select city or town" : `Select ${noun} first`
              }
              disabled={!values.county && !draft.county}
              onSelect={(city) => setValues((v) => ({ ...v, city }))}
            />
          </label>
          {isBirth ? (
            <p className="restriction-note">
              <strong>City/County of Birth:</strong>{" "}
              <em>
                Please select the exact city and county of birth for the subject of the certificate.{" "}
                {config.eventLocationHelp}
              </em>
            </p>
          ) : null}
          {isDeath ? (
            <p className="restriction-note">
              <strong>City/County of Death:</strong>{" "}
              <em>
                Please select the exact city and county of death for the subject of the certificate.{" "}
                {config.eventLocationHelp}
              </em>
            </p>
          ) : null}
          {isMarriage ? (
            <p className="restriction-note">
              <strong>City/County of Marriage:</strong>{" "}
              <em>
                Please select the exact city and county the marriage license was purchased and
                registered. {config.eventLocationHelp}
              </em>
            </p>
          ) : null}
          {isDivorce ? (
            <p className="restriction-note">
              <strong>City/County of Divorce:</strong>{" "}
              <em>
                Please select the exact city and county of divorce for the subjects of the
                certificate. {config.eventLocationHelp}
              </em>
            </p>
          ) : null}
          <label className="application-field wide">
            {isBirth || isDeath ? "Reason for Request" : "Reason for requesting this certificate"}{" "}
            <span>*</span>
            <SearchableSelect
              name="reason"
              required
              defaultValue={draft.reason ?? ""}
              options={config.reasons.map((item) => ({ value: item, label: item }))}
              placeholder="Please select…"
            />
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
          {isBirth ? (
            <p className="restriction-note">
              <strong>Year of Birth Restriction:</strong>{" "}
              <em>
                For the selected county we can only accept orders for births that occurred in the
                year {BIRTH_MIN_YEAR} or later.
              </em>
            </p>
          ) : null}
          {isDeath ? (
            <p className="restriction-note">
              <strong>Year of Death Restriction:</strong>{" "}
              <em>
                For the selected county we can only accept orders for deaths that occurred from{" "}
                {DEATH_MIN_YEAR} to today.
              </em>
            </p>
          ) : null}
          {isMarriage ? (
            <p className="restriction-note">
              <strong>Year of Marriage Restriction:</strong>{" "}
              <em>
                For the selected county we can only accept orders for marriages that occurred from{" "}
                {MARRIAGE_MIN_YEAR} to today.
              </em>
            </p>
          ) : null}
          {isDivorce ? (
            <p className="restriction-note">
              <strong>Year of Divorce Restriction:</strong>{" "}
              <em>
                For the selected county we can only accept orders for divorces that occurred from{" "}
                {DIVORCE_MIN_YEAR} to today.
              </em>
            </p>
          ) : null}
        </div>
      </FormSection>

      <fieldset className="county-blocked-fields">
        <FormSection
          sectionKey="requestor"
          number={sectionNumber("requestor")}
          title="Information About the Requestor"
        >
          {isBirth || isMarriage || isDivorce ? (
            <p className="hint">
              <strong className="important-note">Important:</strong>{" "}
              <em>
                The requestor is the person ordering the certificate, not the person named on the
                certificate. If you are ordering your own certificate, you are both the requestor
                and the subject. The name of the credit card holder must be the same as the
                requestor.
              </em>
            </p>
          ) : null}
          {isDeath ? (
            <p className="hint">
              <strong className="important-note">Important:</strong>{" "}
              <em>
                The requestor is the person ordering the certificate. The name of the credit card
                holder must be the same as the requestor.
              </em>
            </p>
          ) : null}
          <div className="application-grid">
            <label className="application-field wide">
              Your relationship to the person named on the certificate <span>*</span>
              <SearchableSelect
                name="relationship"
                required
                defaultValue={draft.relationship ?? ""}
                options={config.relationships.map((item) => ({ value: item, label: item }))}
                placeholder="Please select…"
              />
              <small>
                <em>
                  If you are not named on the record you may be required to provide proof of
                  Relationship, Entitlement, and/or Court Documents.
                </em>
              </small>
            </label>
            <p className="hint application-field wide">
              <strong className="important-note">Important:</strong>{" "}
              <em>
                The relationship selected must match your relationship to the subject exactly.
              </em>
            </p>
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
              First Name of Requestor <span>*</span>
              <input
                name="applicantFirstName"
                required
                defaultValue={draft.applicantFirstName ?? ""}
              />
            </label>
            <label className="application-field">
              Middle Name of Requestor
              <input name="applicantMiddleName" defaultValue={draft.applicantMiddleName ?? ""} />
            </label>
            <label className="application-field">
              Current Last Name of Requestor <span>*</span>
              <input
                name="applicantLastName"
                required
                defaultValue={draft.applicantLastName ?? ""}
              />
            </label>
            <label className="application-field">
              Suffix
              <SearchableSelect
                name="applicantSuffix"
                defaultValue={draft.applicantSuffix ?? ""}
                options={SUFFIX_OPTIONS.map((option) => ({ value: option, label: option }))}
                placeholder="Please select…"
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
                <small>
                  <em>Valid SSN only, no ITINs or temporary SSNs permitted.</em>
                </small>
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

        <FormSection
          sectionKey="subject"
          number={sectionNumber("subject")}
          title="Information About the Subject"
        >
          {certSlug === "birth-certificate" ? (
            <p className="adoption-note">
              <strong>ADOPTED?</strong> If the person named on the record was adopted, the record on
              file may show the adoptive details or may be sealed. Please review our{" "}
              <Link href="/faq">FAQ section</Link> for important information before completing this
              section.
            </p>
          ) : null}
          {spousesTogether ? (
            config.personNote ? (
              <p className="restriction-note">
                <em>{config.personNote.body}</em>
              </p>
            ) : null
          ) : (
            <p className="restriction-note">
              <strong>{config.personLegend}.</strong>{" "}
              {config.personNote ? <em>{config.personNote.body}</em> : null}
            </p>
          )}
          {spousesTogether ? <h3 className="spouse-heading">Spouse 1</h3> : null}
          <div className="application-grid">
            {config.person.map((field) => {
              // Birth: maiden name only applies to a Female subject — hidden
              // for Male, compulsory for Female.
              if (isBirth && field.key === "subjectMaidenLastName" && sexValue === "Male")
                return null;
              const requiredWhenFemale =
                isBirth && field.key === "subjectMaidenLastName" && sexValue === "Female";
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
          {spousesTogether ? (
            <>
              <h3 className="spouse-heading">Spouse 2</h3>
              <div className="application-grid">
                {(config.family ?? []).map((field) => (
                  <Field
                    key={field.key}
                    def={field}
                    defaultValue={draft[field.key]}
                    error={fieldErrors[`family.${field.key}`]}
                  />
                ))}
              </div>
            </>
          ) : null}
        </FormSection>

        {!config.familyInSubjectSection &&
        (config.family.length > 0 || config.familySecondLegend) ? (
          <FormSection
            sectionKey="family"
            number={sectionNumber("family")}
            title="Parent / Family Information"
          >
            {config.family.length > 0 ? (
              <fieldset>
                <legend>{config.familyLegend}</legend>
                {config.familyNote ? (
                  <p className="restriction-note">
                    <strong>{config.familyNote.title}</strong> <em>{config.familyNote.body}</em>
                  </p>
                ) : null}
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
            ) : null}
            {config.familySecondLegend ? (
              <fieldset>
                <legend>{config.familySecondLegend}</legend>
                {config.familySecondNote ? (
                  <p className="restriction-note">
                    <strong>{config.familySecondNote.title}</strong>{" "}
                    <em>{config.familySecondNote.body}</em>
                  </p>
                ) : null}
                {config.familySecondStatus ? (
                  <div className="application-grid">
                    <label className="application-field">
                      {config.familySecondStatus.label}{" "}
                      {config.familySecondStatus.required ? <span>*</span> : null}
                      <SearchableSelect
                        name={config.familySecondStatus.key}
                        required={config.familySecondStatus.required}
                        defaultValue={draft[config.familySecondStatus.key] ?? ""}
                        options={config.familySecondStatus.options.map((option) => ({
                          value: option,
                          label: option,
                        }))}
                        placeholder="Please select…"
                      />
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
        ) : null}

        <FormSection
          sectionKey="shipping"
          number={sectionNumber("shipping")}
          title="Shipping & Contact Information"
        >
          <p className="hint">
            <strong className="important-note">Requirements:</strong>{" "}
            <em>The Shipping Address Name must match the Requestor Name.</em>
          </p>
          <AddressFields
            prefix="home"
            legend="Home Address"
            draft={draft}
            values={values}
            setValues={setValues}
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
            values={values}
            setValues={setValues}
            typeLabel={values.shippingType ?? draft.shippingType ?? ""}
            requestorFirst={requestorFirst}
            requestorLast={requestorLast}
            errors={fieldErrors}
          />
          <fieldset className="contact-block">
            <p className="contact-heading">Contact Information</p>
            <div className="application-grid">
              <label className="application-field wide">
                Phone Number <span>*</span>
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
                    placeholder: "Phone Number",
                  }}
                />
                <input type="hidden" name="phone" value={phoneValue} />
                {fieldErrors["applicant.phone"] ? (
                  <small className="application-error" role="alert">
                    {fieldErrors["applicant.phone"]}
                  </small>
                ) : null}
              </label>
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

        <FormSection
          sectionKey="copies"
          number={sectionNumber("copies")}
          title="Copies & Processing"
        >
          <label className="application-field wide">
            Number of Copies <span>*</span>
            <SearchableSelect
              name="copies"
              required
              value={String(copies)}
              options={Array.from({ length: 20 }, (_, i) => i + 1).map((n) => ({
                value: String(n),
                label: `${n} ${n === 1 ? "copy" : "copies"}`,
              }))}
              placeholder="Select…"
              onSelect={(value) => setValues((v) => ({ ...v, copies: value }))}
            />
            <small>Each copy includes the $149.00 USVC Processing Fee.</small>
          </label>
          <label className="application-field wide">
            Delivery Method <span>*</span>
            <SearchableSelect
              name="delivery"
              required
              defaultValue={draft.delivery ?? "Regular"}
              options={[
                { value: "Regular", label: "Regular" },
                { value: "UPS Air", label: "UPS Air" },
                {
                  value: "UPS Worldwide Expedited, Up to 5 Business Days",
                  label: "UPS Worldwide Expedited, Up to 5 Business Days",
                },
              ]}
              placeholder="Select…"
            />
          </label>
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
                  Processing typically takes 5-7 business days.
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
                <small>
                  We aim to submit your application by the next business day. Government office and
                  delivery time is extra.
                </small>
              </span>
              <b>+$45.00 per order</b>
            </label>
          </fieldset>
          <p className="hint">{PROCESSING_CLARIFICATION_NOTE}</p>
        </FormSection>

        <FormSection sectionKey="billing" number={sectionNumber("billing")} title="Billing Details">
          <p className="hint">
            <strong className="important-note">Requirements:</strong>{" "}
            <em>The Billing Address Name must match the Requestor Name.</em>
          </p>
          <p className="hint">
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
              <input type="radio" name="billingSource" value="none" /> Neither: enter a billing
              address below
            </label>
            <small>The selected address has been copied below. You can still edit it.</small>
          </div>
          <AddressFields
            prefix="billing"
            legend="Billing Address"
            draft={draft}
            values={values}
            setValues={setValues}
            typeLabel={values.billingType ?? draft.billingType ?? ""}
            requestorFirst={requestorFirst}
            requestorLast={requestorLast}
            errors={fieldErrors}
          />
        </FormSection>

        <FormSection sectionKey="card" number={sectionNumber("card")} title="Credit Card Details">
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

        <FormSection sectionKey="summary" number={sectionNumber("summary")} title="Order Summary">
          <div className="order-summary">
            <h3>{certificateName}</h3>
            <p>
              Number of copies: {copies} certified {copies === 1 ? "copy" : "copies"}
            </p>
            <p>Delivery method: {delivery}</p>
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
            ) : (
              <div>
                <span>
                  Standard Processing<small>5-7 business days</small>
                </span>
                <b>Included</b>
              </div>
            )}
            <div className="total">
              <strong>TOTAL</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </FormSection>

        <FormSection sectionKey="submit" number={sectionNumber("submit")} title="Submit Your Order">
          <div className="verify-panel">
            <h3>Verify Order</h3>
            <ol className="verify-list">
              <li>
                <span>
                  I certify that the information provided is accurate to the best of my knowledge
                  and that I am authorized to request this record.
                </span>
              </li>
              <li>
                <span>
                  I understand ID verification instructions will be emailed to me with steps on how
                  to send a copy of my government-issued picture ID for verification.
                </span>
              </li>
              <li>
                <span>
                  I accept the <Link href="/terms-of-service">Terms of Service</Link>, including the{" "}
                  <Link href="/terms-of-service">refund and cancellation policies</Link>.
                </span>
              </li>
              <li>
                <span>
                  <strong>Authorization for the complete order payment.</strong>{" "}
                  {PROCESSING_PAYMENT_AUTHORIZATION_TEXT}
                </span>
              </li>
            </ol>
            <p>
              Type your full name in the field below. Typing your full name constitutes a signature
              and an agreement that you have read and agreed to all the provisions above. It
              additionally affirms that all information provided on this order form is complete and
              accurate and that you are an authorized individual to obtain the requested vital
              certificate.
            </p>
            <p>
              <strong>Type your full name in the field below to submit your order.</strong>
            </p>
            {isBirth && maidenWarnings.length > 0 ? (
              <div className="possible-issues" role="status">
                <h4>Possible Issues Detected</h4>
                <p>
                  <em>
                    Hi there! Our system detected one or more potential issues with your submission.
                    Please review each issue below. Once you are satisfied with your submission, you
                    may continue by submitting the form again.
                  </em>
                </p>
                <ul>
                  {maidenWarnings.map((warning) => (
                    <li key={warning}>
                      {warning} If this is correct, then please ignore this warning.
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <input
              className="verify-signature"
              name="signature"
              placeholder="Signature"
              aria-label="Signature: type your full name"
              required
              defaultValue={draft.signature ?? ""}
            />
            {fieldErrors.signature ? (
              <small className="application-error" role="alert">
                {fieldErrors.signature}
              </small>
            ) : null}
            <p className="verify-warning">
              <em>
                Before submitting your order, please take a moment to review your information.
                Incorrect information provided will lead to delays and could possibly cancel your
                order.
              </em>
            </p>
            <div className="verify-payment">
              {error ? (
                <p className="application-error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="payment-action">
                <button className="button button-success" disabled={busy || Boolean(blockedCounty)}>
                  {busy ? "Submitting…" : "Submit"}
                </button>
              </div>
            </div>
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
      </fieldset>
    </form>
  );
}

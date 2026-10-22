/** Configuration-driven order-form schema, ported from the reference project.
 *  Every certificate type declares its own fields, reasons, and relationships;
 *  the form renders only what is configured here. */

export type CertificateSlug =
  "birth-certificate" | "death-certificate" | "marriage-certificate" | "divorce-certificate";
export type FieldType = "text" | "date" | "select";

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
  help?: string;
  required?: boolean;
  options?: string[];
  wide?: boolean;
}

export interface GroupNote {
  title: string;
  body: string;
}

export interface RequestorConfig {
  showDateOfBirth: boolean;
  dateOfBirthRequired: boolean;
  showSsn: boolean;
  ssnRequired: boolean;
  note?: GroupNote;
}

export interface GroupStatusConfig {
  key: string;
  label: string;
  options: string[];
  requiredWhen: string[];
  required?: boolean;
}

export interface CertificateFormConfig {
  requestor: RequestorConfig;
  /** Section-3 heading. Birth/death describe the subject; marriage/divorce
   *  describe the event, matching the county form wording. */
  subjectSectionTitle: string;
  personLegend: string;
  personNote?: GroupNote;
  person: FieldDef[];
  familyLegend: string;
  familyNote?: GroupNote;
  family: FieldDef[];
  familySecondLegend?: string;
  familySecondNote?: GroupNote;
  familySecond?: FieldDef[];
  familySecondStatus?: GroupStatusConfig;
  /** When true, the family fields render inside section 3 under their own
   *  sub-heading (e.g. marriage "Spouse 2") and section 4 is hidden. */
  familyInSubjectSection?: boolean;
  relationships: string[];
  reasons: string[];
  eventLocationLabel: string;
  eventLocationHelp: string;
}

const COMMON_REASONS = [
  "Personal records",
  "Passport / travel",
  "Identification",
  "Driver's license / REAL ID",
  "Employment",
  "School / education",
  "Benefits",
  "Insurance",
  "Estate / legal matter",
  "Marriage / family matter",
  "Immigration / citizenship",
  "Other",
];

const SEX_OPTIONS = ["Prefer not to say", "Female", "Male", "Other / unknown"];
const BIRTH_SEX_OPTIONS = ["Male", "Female"];
export const SUFFIX_OPTIONS = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];
const YES_NO = ["Yes", "No"];

export const REQUESTOR_SECURITY_NOTE: GroupNote = {
  title: "Date of Birth & Social Security Number of the Requestor:",
  body: "This is an additional safeguard to protect your identity and the security of the requested certificate.",
};

const MOTHER_NOTE: GroupNote = {
  title: "Name of Mother:",
  body: "Please enter both the current last name and the maiden last name of the mother.",
};

const FATHER_NOTE: GroupNote = {
  title: "Name of Father:",
  body: 'Select "unknown" if the father is unknown or was not listed on the birth certificate.',
};

const BASE_REQUESTOR: RequestorConfig = {
  showDateOfBirth: true,
  dateOfBirthRequired: false,
  showSsn: true,
  ssnRequired: true,
  note: REQUESTOR_SECURITY_NOTE,
};

/** Earliest birth year accepted on birth orders (USVR parity).
 *  Keep in sync with BIRTH_MIN_DATE in backend src/lib/order-validation.ts. */
export const BIRTH_MIN_YEAR = 1906;

/** Earliest death year shown on death orders (USVR parity, notice only —
 *  unlike birth, the backend does not reject out-of-window death dates). */
export const DEATH_MIN_YEAR = 2010;

/** USVR Alabama Death Certificate — exact race list (optional on our form). */
const DEATH_RACE_OPTIONS = [
  "American Indian/Alaskan Native",
  "Asian/Pacific Islander",
  "Black (African-American)",
  "Caucasian (White)",
  "Hispanic",
  "Mixed",
  "Other",
];

/** Earliest marriage year shown on marriage orders (USVR parity, notice only —
 *  unlike birth, the backend does not reject out-of-window marriage dates). */
export const MARRIAGE_MIN_YEAR = 2010;

/** Earliest divorce year shown on divorce orders (USVR parity, notice only —
 *  unlike birth, the backend does not reject out-of-window divorce dates). */
export const DIVORCE_MIN_YEAR = 2010;

/** USVR Alabama Death Certificate — exact reason list. */
const DEATH_REASONS = [
  "Genealogy/Family History",
  "Government Assistance/Benefits",
  "Inheritance/Estate Settlement",
  "Insurance/Pension/Retirement",
  "Legal Purposes",
  "Personal Records/Use",
  "Social Security Card/Benefits",
];

/** USVR Alabama Death Certificate — exact relationship list. */
const DEATH_RELATIONSHIPS = [
  "Brother",
  "Daughter",
  "Father",
  "Husband",
  "Lawyer",
  "Mother",
  "Sister",
  "Son",
  "Wife",
];

/** USVR Alabama Birth Certificate — exact reason list. */
const BIRTH_REASONS = [
  "Adoption (International)",
  "Adoption (US Only)",
  "Driver's License/Identification",
  "Dual Citizenship/Immigration",
  "Employment",
  "Genealogy/Family History",
  "Government Assistance/Benefits",
  "Housing",
  "Income Tax",
  "Inheritance/Estate Settlement",
  "Insurance/Pension/Retirement",
  "Legal Purposes",
  "Marriage (International)",
  "Marriage (US Only)",
  "Passport/Travel",
  "Personal Records/Use",
  "School/Sports",
  "Social Security Card/Benefits",
];

export const CERTIFICATE_FORM_CONFIG: Record<CertificateSlug, CertificateFormConfig> = {
  "birth-certificate": {
    requestor: {
      ...BASE_REQUESTOR,
      dateOfBirthRequired: true,
      showSsn: true,
      ssnRequired: true,
      note: REQUESTOR_SECURITY_NOTE,
    },
    personLegend: "Name of Subject",
    personNote: {
      title: "Information About the Subject of the Certificate",
      body: "Enter the name exactly as it appears on the certificate.",
    },
    subjectSectionTitle: "Information About the Subject",
    person: [
      { key: "firstName", label: "First Name of Subject", required: true },
      { key: "middleName", label: "Middle Name of Subject" },
      { key: "lastName", label: "Current Last Name of Subject", required: true },
      { key: "suffix", label: "Suffix", type: "select", options: SUFFIX_OPTIONS },
      {
        key: "eventDate",
        label: "Subject's Date of Birth",
        type: "date",
        required: true,
        help: "The exact date of birth of the person listed on the certificate.",
      },
      { key: "sex", label: "Gender", type: "select", required: true, options: BIRTH_SEX_OPTIONS },
      {
        key: "subjectMaidenLastName",
        label: "Maiden Last Name of Subject",
        help: "Required when the recorded gender is Female. Hidden when Male.",
      },
      {
        key: "stillLiving",
        label: "Is subject still living?",
        type: "select",
        required: true,
        options: YES_NO,
      },
    ],
    familyLegend: "Mother / parent listed on the record",
    familyNote: MOTHER_NOTE,
    family: [
      { key: "motherFirstName", label: "First Name of Mother", required: true },
      { key: "motherMiddleName", label: "Middle Name of Mother" },
      { key: "motherCurrentLastName", label: "Current Last Name of Mother", required: true },
      { key: "motherLastName", label: "Maiden Last Name of Mother", required: true },
    ],
    familySecondLegend: "Father / second parent",
    familySecondNote: FATHER_NOTE,
    familySecondStatus: {
      key: "fatherStatus",
      label: "Father's Status",
      options: ["Known", "Unknown"],
      requiredWhen: ["Known"],
      required: true,
    },
    familySecond: [
      { key: "fatherFirstName", label: "First Name of Father", required: true },
      { key: "fatherMiddleName", label: "Middle Name of Father" },
      { key: "fatherLastName", label: "Last Name of Father", required: true },
      { key: "fatherSuffix", label: "Suffix", type: "select", options: SUFFIX_OPTIONS },
    ],
    relationships: [
      "Self",
      "Parent",
      "Legal guardian",
      "Spouse",
      "Child",
      "Sibling",
      "Grandparent",
      "Authorized representative",
      "Other",
    ],
    reasons: BIRTH_REASONS,
    eventLocationLabel: "birth",
    eventLocationHelp:
      "Enter the city or town where the birth occurred. If you are unsure, use the city where the hospital or birth facility was located. Birth records are not available until 90 days after the date of birth.",
  },
  "death-certificate": {
    subjectSectionTitle: "Information About the Subject",
    requestor: {
      ...BASE_REQUESTOR,
      dateOfBirthRequired: true,
    },
    personLegend: "Name of Subject",
    personNote: {
      title: "Information About the Subject of the Certificate",
      body: "Enter the name exactly as it appears on the certificate.",
    },
    person: [
      { key: "firstName", label: "First Name of Subject", required: true },
      { key: "middleName", label: "Middle Name of Subject" },
      { key: "lastName", label: "Current Last Name of Subject", required: true },
      { key: "suffix", label: "Suffix", type: "select", options: SUFFIX_OPTIONS },
      {
        key: "eventDate",
        label: "Date of Death",
        type: "date",
        required: true,
        help: "The exact date of death of the person listed on the record.",
      },
      { key: "dateOfBirth", label: "Date of birth, if known", type: "date" },
      { key: "ageAtDeath", label: "Age at death, if known" },
      { key: "sex", label: "Gender", type: "select", required: true, options: BIRTH_SEX_OPTIONS },
      { key: "race", label: "Race", type: "select", options: DEATH_RACE_OPTIONS },
      {
        key: "facility",
        label: "Facility or place of death, if known",
        help: "Hospital, care facility, residence, or other location.",
        wide: true,
      },
    ],
    familyLegend: "Place of death",
    family: [],
    relationships: DEATH_RELATIONSHIPS,
    reasons: DEATH_REASONS,
    eventLocationLabel: "death",
    eventLocationHelp: "Enter the city or town where the death occurred.",
  },
  "marriage-certificate": {
    subjectSectionTitle: "Marriage Details",
    requestor: {
      ...BASE_REQUESTOR,
      dateOfBirthRequired: true,
    },
    personLegend: "Spouse 1",
    personNote: {
      title: "Information about the Subjects on the Certificate",
      body: "Enter the names exactly as they appear on the certificate.",
    },
    person: [
      { key: "sex", label: "Gender", type: "select", required: true, options: BIRTH_SEX_OPTIONS },
      { key: "firstName", label: "First Name of Subject", required: true },
      { key: "middleName", label: "Middle Name of Subject" },
      { key: "lastName", label: "Current Last Name of Subject", required: true },
      { key: "maidenLastName", label: "Maiden Last Name of Subject", required: true },
      {
        key: "eventDate",
        label: "Date of Marriage",
        type: "date",
        required: true,
        help: "The exact date of marriage listed on the certificate.",
      },
    ],
    familyLegend: "Spouse 2",
    familyInSubjectSection: true,
    family: [
      {
        key: "spouseSex",
        label: "Gender",
        type: "select",
        required: true,
        options: BIRTH_SEX_OPTIONS,
      },
      { key: "spouseFirstName", label: "First Name of Subject", required: true },
      { key: "spouseMiddleName", label: "Middle Name of Subject" },
      { key: "spouseLastName", label: "Current Last Name of Subject", required: true },
      { key: "spouseMaidenLastName", label: "Maiden Last Name of Subject", required: true },
      { key: "spouseCurrentLastName", label: "Current last name, if different" },
    ],
    relationships: [
      "Self",
      "Spouse",
      "Parent",
      "Child",
      "Legal representative",
      "Authorized representative",
      "Other",
    ],
    reasons: [
      "Name change",
      "Identification",
      "Passport / travel",
      "Immigration / citizenship",
      "Spousal benefits",
      "Insurance",
      "Estate / legal matter",
      "Personal records",
      "Other",
    ],
    eventLocationLabel: "marriage",
    eventLocationHelp:
      "Enter the city or town where the marriage license was purchased and registered.",
  },
  "divorce-certificate": {
    subjectSectionTitle: "Divorce Details",
    requestor: {
      ...BASE_REQUESTOR,
      dateOfBirthRequired: true,
    },
    personLegend: "Spouse 1",
    personNote: {
      title: "Information about the Subjects on the Certificate",
      body: "Enter the names exactly as they appear on the certificate.",
    },
    person: [
      { key: "sex", label: "Gender", type: "select", required: true, options: BIRTH_SEX_OPTIONS },
      { key: "firstName", label: "First Name of Subject", required: true },
      { key: "middleName", label: "Middle Name of Subject" },
      { key: "lastName", label: "Current Last Name of Subject", required: true },
      { key: "maidenLastName", label: "Maiden Last Name of Subject", required: true },
      {
        key: "eventDate",
        label: "Date of Divorce",
        type: "date",
        required: true,
        help: "The exact date of divorce listed on the certificate.",
      },
    ],
    familyLegend: "Spouse 2",
    familyInSubjectSection: true,
    family: [
      {
        key: "spouseSex",
        label: "Gender",
        type: "select",
        required: true,
        options: BIRTH_SEX_OPTIONS,
      },
      { key: "spouseFirstName", label: "First Name of Subject", required: true },
      { key: "spouseMiddleName", label: "Middle Name of Subject" },
      { key: "spouseLastName", label: "Current Last Name of Subject", required: true },
      { key: "spouseMaidenLastName", label: "Maiden Last Name of Subject", required: true },
      {
        key: "court",
        label: "Court or jurisdiction, if known",
        help: "The court that granted the divorce, where applicable.",
        wide: true,
      },
    ],
    relationships: [
      "Self",
      "Former spouse",
      "Parent",
      "Child",
      "Legal representative",
      "Authorized representative",
      "Other",
    ],
    reasons: [
      "Remarriage",
      "Name change",
      "Identification",
      "Immigration / citizenship",
      "Estate / legal matter",
      "Benefits",
      "Personal records",
      "Other",
    ],
    eventLocationLabel: "divorce",
    eventLocationHelp: "Enter the city or town where the divorce was granted or recorded.",
  },
};

export const PROCESSING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Processing",
    priceLabel: "Included",
    description:
      "Your application is prepared and processed using our standard service workflow. Processing typically takes 5-7 business days.",
  },
  {
    id: "rush",
    name: "Rush Processing",
    priceLabel: "$12.00",
    description: "Your application will be processed the next day.",
  },
] as const;

export const PROCESSING_CLARIFICATION_NOTE =
  "Processing times refer to USVC's processing of your application. Government agency processing and certificate delivery times may vary.";

export interface StateFormOverride {
  requestor?: Partial<RequestorConfig>;
  fields?: Record<string, Partial<FieldDef>>;
  hideFields?: string[];
}

export const STATE_FORM_OVERRIDES: Record<string, StateFormOverride> = {
  "california:birth-certificate": {
    requestor: { showSsn: true, ssnRequired: true, dateOfBirthRequired: true },
  },
};

function patchFields(fields: FieldDef[], override: StateFormOverride): FieldDef[] {
  return fields
    .filter((field) => !override.hideFields?.includes(field.key))
    .map((field) => ({ ...field, ...(override.fields?.[field.key] ?? {}) }));
}

export function resolveFormConfig(
  stateSlug: string,
  certificateSlug: CertificateSlug,
): CertificateFormConfig {
  const base = CERTIFICATE_FORM_CONFIG[certificateSlug];
  const override = STATE_FORM_OVERRIDES[`${stateSlug}:${certificateSlug}`];
  if (!override) return base;
  return {
    ...base,
    requestor: { ...base.requestor, ...override.requestor },
    person: patchFields(base.person, override),
    family: patchFields(base.family, override),
    ...(base.familySecond ? { familySecond: patchFields(base.familySecond, override) } : {}),
  };
}

/** Shared public/Flow wording. Values and correction paths remain separate. */
export const APPLICATION_TITLES = {
  certificate: "Information About the Certificate",
  requestor: "Information About the Requestor",
  family: "Parent / Family Information",
  shipping: "Shipping & Contact Information",
  copies: "Copies & Processing",
  billing: "Billing Details",
  card: "Credit Card Details",
  summary: "Order Summary",
  submit: "Submit Your Order",
} as const;
export type ApplicationSectionKey = keyof typeof APPLICATION_TITLES | "subject";
export const APPLICATION_LABELS = {
  certificate: "Certificate Type",
  state: "State / Territory",
  reason: "Reason for Request",
  reasonOther: "Please describe your reason",
  relationship: "Your relationship to the person named on the certificate",
  relationshipOther: "Please describe your relationship",
  firstName: "First Name of Requestor",
  middleName: "Middle Name of Requestor",
  lastName: "Current Last Name of Requestor",
  suffix: "Suffix",
  dateOfBirth: "Your date of birth",
  ssn: "Your Social Security Number",
  phone: "Phone Number",
  email: "Email address",
  copies: "Number of Certified Copies",
  delivery: "Delivery Method",
  processing: "Processing speed",
  cardNumber: "Credit Card Number",
  cardExpiry: "Credit Card Expiry Date (MM/YY)",
  cardCvc: "CVV",
} as const;
export const APPLICATION_ADDRESS_TYPES = [
  { value: "domestic", label: "Domestic (US and Puerto Rico)" },
  { value: "military", label: "US Military (APO/FPO)" },
  { value: "international", label: "International (including Canada and Mexico)" },
] as const;
export const ADDRESS_LABELS = {
  firstName: "First Name",
  lastName: "Last Name",
  line1: "Address Line 1",
  line2: "Address Line 2 (optional)",
  city: "City",
  state: "State",
  postalCode: "Zip/Postal Code",
  country: "Country",
} as const;
export function applicationSectionKeys(config: CertificateFormConfig): ApplicationSectionKey[] {
  return [
    "certificate",
    "requestor",
    "subject",
    ...(!config.familyInSubjectSection && (config.family.length || config.familySecondLegend)
      ? ["family" as const]
      : []),
    "shipping",
    "copies",
    "billing",
    "card",
    "summary",
    "submit",
  ];
}
export function applicationReasonLabel(certificate: string): string {
  return ["BIRTH", "DEATH", "birth-certificate", "death-certificate"].includes(certificate)
    ? APPLICATION_LABELS.reason
    : "Reason for requesting this certificate";
}
export function eventLocationLabels(config: CertificateFormConfig, noun: string) {
  return {
    county: `${noun.charAt(0).toUpperCase()}${noun.slice(1)} where the ${config.eventLocationLabel} occurred`,
    city: `City / town where the ${config.eventLocationLabel} occurred`,
  };
}
export function visiblePersonFields(config: CertificateFormConfig, birth: boolean, sex: string) {
  return config.person
    .filter((field) => !(birth && field.key === "subjectMaidenLastName" && sex === "Male"))
    .map((field) =>
      birth && field.key === "subjectMaidenLastName" && sex === "Female"
        ? { ...field, required: true }
        : field,
    );
}

export interface ApplicationData {
  certificate: string;
  stateName: string;
  stateCode: string;
  stateSlug?: string;
  geo?: { county?: string; city?: string };
  reason?: string;
  reasonOther?: string;
  applicant?: Record<string, string>;
  subject?: Record<string, string>;
  family?: Record<string, string>;
  addresses?: Record<string, Record<string, string>>;
  copies: number;
  rush: boolean;
  deliveryMethod: string;
  destinationType?: string;
}
export interface ApplicationField extends FieldDef {
  path: string;
  value: string;
  locked?: boolean;
  sensitive?: "ssn" | "card";
}
export interface ApplicationGroup {
  title?: string;
  fields: ApplicationField[];
}
export interface ApplicationSection {
  key: ApplicationSectionKey;
  title: string;
  number: number;
  groups: ApplicationGroup[];
}
export function applicationFieldText(field: ApplicationField): string {
  return field.type === "date"
    ? field.value.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2/$3/$1")
    : field.value;
}
export function applicationCopyText(fields: ApplicationField[]): string {
  return fields
    .filter((field) => !field.sensitive && field.value.trim() !== "")
    .map((field) => `${field.label}: ${applicationFieldText(field)}`)
    .join("\n");
}
export function applicationSections(data: ApplicationData, noun = "county"): ApplicationSection[] {
  const slug = `${data.certificate.toLowerCase()}-certificate` as CertificateSlug;
  if (!Object.hasOwn(CERTIFICATE_FORM_CONFIG, slug)) return [];
  const config = resolveFormConfig(
    data.stateSlug ?? data.stateName.toLowerCase().replaceAll(" ", "-"),
    slug,
  );
  const keys = applicationSectionKeys(config);
  const field = (
    path: string,
    label: string,
    value: unknown,
    extra: Partial<ApplicationField> = {},
  ): ApplicationField => ({
    key: path,
    path,
    label,
    value: value == null ? "" : String(value),
    ...extra,
  });
  const mapped = (group: "subject" | "family", fields: FieldDef[]) =>
    fields.map((def) => field(`${group}.${def.key}`, def.label, data[group]?.[def.key], def));
  const locations = eventLocationLabels(config, noun);
  const sections: ApplicationSection[] = [];
  const add = (key: ApplicationSectionKey, groups: ApplicationGroup[]) =>
    sections.push({
      key,
      title: key === "subject" ? config.subjectSectionTitle : APPLICATION_TITLES[key],
      number: keys.indexOf(key) + 1,
      groups,
    });
  const labels = APPLICATION_LABELS;
  add("certificate", [
    {
      fields: [
        field(
          "certificate",
          labels.certificate,
          `${data.certificate.charAt(0)}${data.certificate.slice(1).toLowerCase()} Certificate`,
          { locked: true },
        ),
        field("stateName", labels.state, data.stateName, { locked: true }),
        field("geo.county", locations.county, data.geo?.county, { required: true }),
        field("geo.city", locations.city, data.geo?.city, { required: true }),
        field("reason", applicationReasonLabel(data.certificate), data.reason, {
          required: true,
          type: "select",
          options: config.reasons,
        }),
        ...(data.reason === "Other"
          ? [field("reasonOther", labels.reasonOther, data.reasonOther, { required: true })]
          : []),
      ],
    },
  ]);
  const applicant = data.applicant ?? {};
  const requestor = [
    field("applicant.relationship", labels.relationship, applicant.relationship, {
      required: true,
      type: "select",
      options: config.relationships,
    }),
  ];
  if (applicant.relationship === "Other")
    requestor.push(
      field("applicant.relationshipOther", labels.relationshipOther, applicant.relationshipOther, {
        required: true,
      }),
    );
  for (const key of ["firstName", "middleName", "lastName", "suffix"] as const)
    requestor.push(
      field(`applicant.${key}`, labels[key], applicant[key], {
        required: key === "firstName" || key === "lastName",
        ...(key === "suffix" ? { type: "select" as const, options: SUFFIX_OPTIONS } : {}),
      }),
    );
  if (config.requestor.showDateOfBirth)
    requestor.push(
      field("applicant.dateOfBirth", labels.dateOfBirth, applicant.dateOfBirth, {
        type: "date",
        required: config.requestor.dateOfBirthRequired,
      }),
    );
  if (config.requestor.showSsn)
    requestor.push(field("requestorSsn", labels.ssn, "", { sensitive: "ssn" }));
  add("requestor", [{ fields: requestor }]);
  const person = mapped(
    "subject",
    visiblePersonFields(config, slug === "birth-certificate", data.subject?.sex ?? ""),
  );
  add("subject", [
    { title: config.personLegend, fields: person },
    ...(config.familyInSubjectSection
      ? [{ title: config.familyLegend, fields: mapped("family", config.family) }]
      : []),
  ]);
  if (keys.includes("family")) {
    const groups: ApplicationGroup[] = config.family.length
      ? [{ title: config.familyLegend, fields: mapped("family", config.family) }]
      : [];
    if (config.familySecondLegend) {
      const status = config.familySecondStatus;
      const fields = status
        ? [
            field(`family.${status.key}`, status.label, data.family?.[status.key], {
              type: "select",
              options: status.options,
              required: status.required,
            }),
          ]
        : [];
      if (!status || status.requiredWhen.includes(data.family?.[status.key] ?? ""))
        fields.push(...mapped("family", config.familySecond ?? []));
      groups.push({ title: config.familySecondLegend, fields });
    }
    add("family", groups);
  }
  const address = (kind: "home" | "shipping" | "billing"): ApplicationGroup => {
    const addr = data.addresses?.[kind] ?? {};
    const title = `${kind.charAt(0).toUpperCase()}${kind.slice(1)} Address`;
    const type =
      (kind === "shipping" && data.destinationType
        ? data.destinationType === "international"
          ? "international"
          : addr.addressType === "military"
            ? "military"
            : "domestic"
        : addr.addressType) ||
      (addr.country && addr.country !== "United States" ? "international" : "domestic");
    const typeLabel =
      APPLICATION_ADDRESS_TYPES.find((option) => option.value === type)?.label ??
      APPLICATION_ADDRESS_TYPES[0].label;
    return {
      title,
      fields: [
        field(`addresses.${kind}.addressType`, `${title} Type`, typeLabel, {
          locked: kind !== "shipping",
          type: "select",
          options: APPLICATION_ADDRESS_TYPES.filter(
            (option) => option.value !== "military" || type === "military",
          ).map((option) => option.label),
        }),
        ...Object.entries(ADDRESS_LABELS)
          .filter(([key]) => key !== "country" || type === "international")
          .map(([key, label]) =>
            field(
              `addresses.${kind}.${key}`,
              key === "state" && type !== "domestic"
                ? type === "military"
                  ? "APO/FPO"
                  : "International State/Province"
                : label,
              addr[key],
              { required: !["firstName", "lastName", "line2"].includes(key) },
            ),
          ),
      ],
    };
  };
  add("shipping", [
    address("home"),
    address("shipping"),
    {
      title: "Contact Information",
      fields: [
        field("applicant.phone", labels.phone, applicant.phone, { required: true }),
        field("applicant.email", labels.email, applicant.email, { required: true }),
      ],
    },
  ]);
  add("copies", [
    {
      fields: [
        field("copies", labels.copies, data.copies, { locked: true }),
        field("deliveryMethod", labels.delivery, data.deliveryMethod),
        field("rush", labels.processing, data.rush ? "Rush Processing" : "Standard Processing", {
          locked: true,
        }),
      ],
    },
  ]);
  add("billing", [address("billing")]);
  add("card", [{ fields: [field("paymentCard", labels.cardNumber, "", { sensitive: "card" })] }]);
  return sections;
}

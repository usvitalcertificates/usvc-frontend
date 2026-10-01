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
    person: [
      { key: "firstName", label: "First Name of Subject", required: true },
      { key: "middleName", label: "Middle Name of Subject", required: true },
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
    requestor: BASE_REQUESTOR,
    personLegend: "Person named on the death record",
    person: [
      { key: "firstName", label: "Deceased first name", required: true },
      { key: "middleName", label: "Middle name" },
      { key: "lastName", label: "Deceased last name", required: true },
      { key: "eventDate", label: "Date of death", type: "date", required: true },
      { key: "dateOfBirth", label: "Date of birth, if known", type: "date" },
      { key: "ageAtDeath", label: "Age at death, if known" },
      { key: "sex", label: "Sex / gender as recorded", type: "select", options: SEX_OPTIONS },
    ],
    familyLegend: "Place of death",
    family: [
      {
        key: "facility",
        label: "Facility or place of death, if known",
        help: "Hospital, care facility, residence, or other location.",
        wide: true,
      },
    ],
    relationships: [
      "Spouse",
      "Parent",
      "Child",
      "Sibling",
      "Grandchild",
      "Legal representative",
      "Funeral director",
      "Authorized representative",
      "Other",
    ],
    reasons: [
      "Estate / legal matter",
      "Insurance claim",
      "Benefits",
      "Pension / retirement account",
      "Closing accounts",
      "Personal records",
      "Genealogy / family history",
      "Other",
    ],
    eventLocationLabel: "death",
    eventLocationHelp: "Enter the city or town where the death occurred.",
  },
  "marriage-certificate": {
    requestor: BASE_REQUESTOR,
    personLegend: "Spouse / party 1",
    person: [
      { key: "firstName", label: "First name", required: true },
      { key: "middleName", label: "Middle name" },
      { key: "lastName", label: "Last name at the time of marriage", required: true },
      { key: "eventDate", label: "Date of marriage", type: "date", required: true },
    ],
    familyLegend: "Spouse / party 2",
    family: [
      { key: "spouseFirstName", label: "First name", required: true },
      { key: "spouseMiddleName", label: "Middle name" },
      { key: "spouseLastName", label: "Last name at the time of marriage", required: true },
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
    eventLocationHelp: "Enter the city or town where the marriage license was issued or recorded.",
  },
  "divorce-certificate": {
    requestor: BASE_REQUESTOR,
    personLegend: "Party 1",
    person: [
      { key: "firstName", label: "First name", required: true },
      { key: "middleName", label: "Middle name" },
      { key: "lastName", label: "Last name at the time of divorce", required: true },
      { key: "eventDate", label: "Date of divorce, or approximate date", type: "date" },
    ],
    familyLegend: "Party 2",
    family: [
      { key: "spouseFirstName", label: "First name", required: true },
      { key: "spouseLastName", label: "Last name at the time of divorce", required: true },
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
      "Your application is prepared and processed using our standard service workflow. Processing typically takes 5–7 business days.",
  },
  {
    id: "rush",
    name: "Rush Processing",
    priceLabel: "+$45.00",
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

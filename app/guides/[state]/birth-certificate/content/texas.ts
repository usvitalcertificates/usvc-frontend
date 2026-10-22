import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const TEXAS_BIRTH_URL = "https://www.dshs.texas.gov/vital-statistics/birth-records";
const TEXAS_RECORD_TYPES_URL = "https://www.dshs.texas.gov/vital-statistics/record-types";
const TEXAS_QUALIFIED_URL =
  "https://www.dshs.texas.gov/vital-statistics/persons-qualified-to-request-or-change-records";
const TEXAS_ID_URL = "https://www.dshs.texas.gov/vital-statistics/acceptable-identification-id";
const TEXAS_LOCAL_URL = "https://www.dshs.texas.gov/vital-statistics/order-records-locally";
const TEXAS_CORRECTIONS_URL =
  "https://www.dshs.texas.gov/vital-statistics/requirements-requesting-changing-vital-records/requirements-changing-vital-records";
const TEXAS_APOSTILLE_URL =
  "https://www.dshs.texas.gov/vital-statistics/birth-records/records-foreign-governments-apostille";
const TEXAS_FEES_URL = "https://www.dshs.texas.gov/vital-statistics/costs-fees";

export const TEXAS_GUIDE: BirthGuideContent = {
  stateName: "Texas",
  metaTitle: "Texas Birth Certificate Guide: Forms, ID, and Steps",
  metaDescription:
    "How Texas birth certificate requests work: long and short forms, who may order, acceptable ID, state or local filing, corrections, and USVC help.",
  subtitle:
    "Choose the right Texas record type, confirm who may order it, prepare acceptable identification, and use the official DSHS resources.",
  intro: [
    "Texas birth records are held by the Department of State Health Services, and certified copies are available through the state or through local vital record offices. The record type you choose matters: a long form and a short form contain different information and are accepted for different purposes.",
    "This guide explains the main decision points, the identification the state asks for, and how USVC can help you prepare a complete request. The official Texas DSHS pages remain the source of truth for current requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Texas Department of State Health Services – Vital Statistics",
    },
    {
      label: "Record location",
      value: "Statewide records; the birth county identifies local offices",
    },
    {
      label: "Copy types",
      value: "Long form, short form, heirloom, and birth verification",
    },
    {
      label: "Where to request",
      value: "Online through Texas.gov, by mail, or in person",
    },
    {
      label: "Best first step",
      value: "Confirm the record type and acceptable ID on the DSHS pages",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Texas resource",
      paragraphs: [
        "Texas DSHS controls the application, identification, and record-type rules. Its official pages explain current request channels, document requirements, and the forms the agency accepts. Those details can change without notice on the agency page, which this guide doesn't control.",
        "Confirm the record type and identification requirements before you apply. A certificate that is valid for one purpose may not be accepted for another.",
      ],
      links: [{ label: "Open the official Texas birth-records page", href: TEXAS_BIRTH_URL }],
    },
    {
      id: "record-types",
      heading: "Choose the right Texas birth record",
      paragraphs: [
        "A long form birth certificate is the most comprehensive certified copy. It is a copy of the original birth certificate and shows the history of corrections made to the record. Texas says the long form is required for a U.S. passport, a driver's license in most states, and dual citizenship.",
        "A short form is a certified abstract. It shows current information for the person's name, date of birth, place of birth, sex, and parent names, but not the correction history. Texas lists school and sports registration, employment, and insurance as common uses.",
      ],
      bullets: [
        "Long form: use when the receiving organization needs the original-record detail or correction history.",
        "Short form: a certified abstract for many school, sports, employment, and insurance requests.",
        "Heirloom certificate: an abstract intended primarily for framing and display.",
        "Birth verification: a letter with limited details, not a legal substitute for a certified certificate.",
      ],
      note: "Ask the receiving organization which form it accepts before you order. The state does not control that organization's rules.",
      links: [{ label: "Compare Texas birth record types", href: TEXAS_RECORD_TYPES_URL }],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Texas birth certificate",
      paragraphs: [
        "The person named on the record, an immediate family member, a guardian, or a legal agent or representative may request a certified copy. Texas defines an immediate family member as a child, parent or guardian, brother or sister, grandparent, or spouse.",
        "Other applicants must provide legal documentation showing a direct, tangible interest in the record. If you are ordering for someone else, confirm the relationship and documentation requirements on the official page first.",
      ],
      links: [{ label: "Read who may request a Texas vital record", href: TEXAS_QUALIFIED_URL }],
    },
    {
      id: "identification",
      heading: "Prepare acceptable identification",
      paragraphs: [
        "Texas uses a tiered identification list. An applicant can provide one document from Group A, such as a U.S. state driver's license, federal or state ID card, military ID, or U.S. passport.",
        "If no Group A document is available, the applicant can use combinations of Group B and Group C documents. The exact combinations and document types are listed on the DSHS identification page, so check that page before submitting.",
      ],
      links: [{ label: "Review Texas acceptable identification", href: TEXAS_ID_URL }],
    },
    {
      id: "state-or-local",
      heading: "State office or local vital record office?",
      paragraphs: [
        "Texas DSHS offers online ordering through Texas.gov, mail service, and in-person service at its Austin headquarters. Local vital record offices can also issue birth records and may be more convenient depending on where you live.",
        "The birth county is the key detail when you look for a local office. If the birth occurred outside Texas, request the record from the state or country where the birth happened.",
      ],
      links: [
        { label: "Find a local Texas vital record office", href: TEXAS_LOCAL_URL },
        { label: "Check state request options", href: TEXAS_BIRTH_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Gather the record details and identification before opening the application. Using the name and date exactly as they appear on the record reduces the chance of a mismatch or a correction later.",
      ],
      bullets: [
        "The subject's full name at birth, including any suffix.",
        "Date of birth and the city and county of birth.",
        "Parents' names as shown on the birth record.",
        "Your relationship to the person named on the certificate.",
        "Your contact details and a deliverable mailing address.",
        "Acceptable identification from the DSHS list.",
        "Any court order, guardianship papers, or other documents that support your request.",
      ],
    },
    {
      id: "process",
      heading: "How a Texas request usually works",
      bullets: [
        "Decide whether you need a long form, short form, heirloom certificate, or verification.",
        "Confirm that you are qualified to request the record.",
        "Prepare acceptable identification and any supporting documents.",
        "Choose online, mail, or in-person service.",
        "Complete the current application and pay the agency through the channel it supports.",
        "Keep your confirmation and track the request until the record arrives.",
        "Check the certificate for accuracy and contact the agency if a correction is needed.",
      ],
      note: "Corrections are a separate process from ordering a copy. If the record itself needs to change, review the correction requirements before you order the certificate you need.",
    },
    {
      id: "special-situations",
      heading: "Common Texas situations",
      paragraphs: [
        "Some records need a different application or an extra step. Review the official guidance for your situation before filing.",
      ],
      bullets: [
        "Name or date corrections: Texas directs birth-record changes and corrections through a separate mail process.",
        "Adoption: a new birth certificate based on adoption follows a different application path.",
        "Adult adoptee records: Texas publishes separate instructions for requesting an original birth certificate.",
        "International use: request the certified record for an apostille, then submit it to the Texas Secretary of State; DSHS does not process the apostille fee.",
        "Delayed birth registration: a record that was not filed near the time of birth may need a delayed-registration process.",
      ],
      links: [
        { label: "Read Texas birth-record correction requirements", href: TEXAS_CORRECTIONS_URL },
        {
          label: "Review Texas apostille instructions",
          href: TEXAS_APOSTILLE_URL,
        },
      ],
    },
    {
      id: "usvc-help",
      heading: "How USVC can help",
      paragraphs: USVC_HELP_COPY,
      bullets: [
        "We check your submitted information for missing details and inconsistencies before filing.",
        "We file the request with the issuing agency and give you an online way to track it.",
        "We do not control agency eligibility, fees, processing times, or the final decision to issue a record.",
        "You can always request the record directly from the official agency, potentially at a lower cost.",
      ],
    },
  ],
  faqs: [
    {
      question: "Where do I find the official Texas birth certificate requirements?",
      answer: `Use the [official Texas birth-records page](${TEXAS_BIRTH_URL}). It is the source of truth for current request options, forms, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Should I order a long form or a short form?",
      answer: `A long form is a copy of the original certificate and includes correction history; Texas says it is required for a U.S. passport, a driver's license in most states, and dual citizenship. A short form is a certified abstract used for many school, sports, employment, and insurance requests. Confirm which form the receiving organization accepts. See [Texas record types](${TEXAS_RECORD_TYPES_URL}).`,
    },
    {
      question: "Who can request a Texas birth certificate?",
      answer: `The person named on the record, an immediate family member (child, parent or guardian, brother or sister, grandparent, or spouse), a guardian, or a legal agent or representative. Other applicants need legal documentation of a direct, tangible interest. Review [who may request](${TEXAS_QUALIFIED_URL}).`,
    },
    {
      question: "What identification does Texas accept?",
      answer: `Texas accepts one Group A document, such as a U.S. state driver's license, federal or state ID, military ID, or U.S. passport, or a specified combination of Group B and Group C documents. Check the [acceptable identification page](${TEXAS_ID_URL}) for the exact combinations.`,
    },
    {
      question: "Can I order from a local office instead of the state?",
      answer: `Yes. Texas DSHS offers online, mail, and Austin in-person service, and local vital record offices can also issue birth records. Use the [local office directory](${TEXAS_LOCAL_URL}) and contact the office for its current service options.`,
    },
    {
      question: "What if the birth happened outside Texas?",
      answer:
        "Texas can only issue records for births that occurred in Texas. Request the certificate from the state or country where the birth happened.",
    },
    {
      question: "What if the name or date on the record is wrong?",
      answer: `A correction is a separate process from ordering a copy. Review [Texas birth-record correction requirements](${TEXAS_CORRECTIONS_URL}) before ordering the corrected certificate.`,
    },
    {
      question: "What if I need the certificate for use in another country?",
      answer: `Request the certified record for an apostille, then send it to the Texas Secretary of State for authentication. Texas DSHS explains the two-step process on its [apostille page](${TEXAS_APOSTILLE_URL}) and does not process the apostille fee.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
    {
      question: "How long does the USVC part take?",
      answer:
        "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary, so confirm current times on the official agency page before you plan around a deadline.",
    },
  ],
  sources: [
    { label: "Texas DSHS – Birth records", href: TEXAS_BIRTH_URL },
    { label: "Texas DSHS – Birth record types", href: TEXAS_RECORD_TYPES_URL },
    { label: "Texas DSHS – Persons qualified to request records", href: TEXAS_QUALIFIED_URL },
    { label: "Texas DSHS – Acceptable identification", href: TEXAS_ID_URL },
    { label: "Texas DSHS – Local vital record offices", href: TEXAS_LOCAL_URL },
    { label: "Texas DSHS – Requirements for changing records", href: TEXAS_CORRECTIONS_URL },
    {
      label: "Texas DSHS – Records for foreign governments (apostille)",
      href: TEXAS_APOSTILLE_URL,
    },
    { label: "Texas DSHS – Costs and fees", href: TEXAS_FEES_URL },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Texas Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

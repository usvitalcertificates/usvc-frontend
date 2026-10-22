import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const WA_VITAL_URL = "https://doh.wa.gov/licenses-permits-and-certificates/vital-records";
const WA_BIRTH_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record/birth-record";
const WA_ORDER_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record";
const WA_CORRECT_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/how-correct-record/changing-birth-certificates";
const WA_ADOPTION_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/adoptions";
const WA_ORIGINAL_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/adoptions/original-birth-certificate-adopted-person";
const WA_APOSTILLE_URL =
  "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/apostilles";
const WA_SOS_URL =
  "https://www.sos.wa.gov/corporations-charities/apostilles-services-information-resource-page";

export const WASHINGTON_GUIDE: BirthGuideContent = {
  stateName: "Washington",
  metaTitle: "Washington Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How Washington birth certificate requests work: who may order, relationship proof, ID, online, mail, county, corrections, USVC help.",
  subtitle:
    "Confirm who may receive a Washington birth record, prepare identity and relationship documents, and choose the state or local filing path.",
  intro: [
    "Washington issues birth records from July 1, 1907 to the present. Certified certificates and Heirloom certificates are limited to applicants with a qualifying relationship to the person named on the record, and the state requires both identity and relationship documentation.",
    "This guide explains the three birth-record products, the qualified-applicant list, identification and relationship proof, state and local filing, corrections, adoption records, and apostilles. The official Washington Department of Health pages control the current application requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Washington State Department of Health, Center for Health Statistics",
    },
    {
      label: "Record location",
      value: "State records from July 1, 1907 to the present",
    },
    {
      label: "Copy type",
      value:
        "Certified birth certificate, Heirloom certificate, or noncertified informational copy",
    },
    {
      label: "Where to request",
      value: "Online or phone through VitalChek, by mail, or at a local health department",
    },
    {
      label: "Eligibility",
      value:
        "Qualified relatives and legal guardians; informational copies are available to anyone",
    },
    {
      label: "Identification",
      value: "Valid government ID or approved alternate ID plus proof of qualifying relationship",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Washington resource",
      paragraphs: [
        "The Center for Health Statistics controls the application, eligibility, identification, and payment rules. Its birth-record page explains the three products, the qualified-applicant list, the required documentation, and the current ordering channels.",
        "Use the official pages to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official Washington vital-records page", href: WA_VITAL_URL },
        { label: "Review Washington birth-record ordering", href: WA_BIRTH_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Washington birth certificate",
      paragraphs: [
        "Washington offers three birth-record products. A certified birth certificate is printed on security paper and is used for legal purposes. A Heirloom birth certificate is a certified certificate with a commemorative design. A noncertified informational copy carries a watermark stating that it cannot be used for legal purposes.",
        "A certified certificate or Heirloom certificate is limited to applicants with a qualifying relationship to the subject. The state's list includes a spouse or domestic partner, parent, stepparent, child, stepchild, sibling, grandparent, great-grandparent, grandchild, great-grandchild, and legal guardian.",
        "A person may order their own birth certificate. Anyone may request a noncertified informational copy; that product does not require identity or relationship proof, but it is not valid for legal purposes.",
      ],
      bullets: [
        "The person named on the record may order their own certificate.",
        "A spouse or domestic partner, parent, stepparent, child, stepchild, or sibling may qualify.",
        "A grandparent, great-grandparent, grandchild, or great-grandchild may qualify.",
        "A legal guardian must provide the required relationship documentation.",
        "A certified certificate or Heirloom certificate requires identity and relationship proof.",
        "An informational copy is available to anyone, but it cannot be used for legal purposes.",
      ],
      links: [{ label: "Review Washington qualified applicants", href: WA_BIRTH_URL }],
    },
    {
      id: "identification",
      heading: "Prepare identity and relationship documentation",
      paragraphs: [
        "Washington requires valid government identification or an approved alternate form of identification for a certified certificate or Heirloom certificate. The applicant must also provide documentation that proves the qualifying relationship to the person named on the record.",
        "The acceptable proof depends on the relationship category. Common evidence includes a birth record that links a parent and child or a marriage record for a spouse. A legal guardian must provide the court documentation that establishes the guardianship. Check the state's current relationship-document list before filing.",
        "A noncertified informational copy does not require identity or relationship proof. That is the main practical difference between an informational copy and a certified certificate.",
      ],
      bullets: [
        "Use the name and address shown on the application and the identification consistently.",
        "If your name changed, include the marriage or court record that connects the names.",
        "Provide relationship documentation for the specific category you are using.",
        "A legal guardian should include the certified court document that establishes guardianship.",
        "Do not request an informational copy if the receiving office requires a certified certificate.",
      ],
      links: [
        { label: "Review Washington identity and relationship requirements", href: WA_BIRTH_URL },
      ],
    },
    {
      id: "where-to-file",
      heading: "Online, by phone, by mail, or at a local office",
      paragraphs: [
        "Washington contracts with VitalChek for online and telephone orders. The Department of Health also accepts mail orders, and it partners with local health departments for in-person service on many birth and death certificate purchases.",
        "The Heirloom birth certificate is requested by mail with the required information, identification, relationship documentation, and payment.",
        "Local health departments and county vital-records offices may not offer every product or service. Check with the local office before you go, and use the state ordering page to compare the available channels.",
      ],
      bullets: [
        "Online or phone: use VitalChek through the official Department of Health page.",
        "Mail: send the current birth-record order form and supporting documents to the Department.",
        "In person: check with a local health department or county vital-records office for its services and hours.",
        "Heirloom certificate: submit the mail application with the required documentation.",
        "A record problem or missing documentation can delay an order, so review the application before submitting it.",
      ],
      links: [
        { label: "Review Washington ordering channels", href: WA_ORDER_URL },
        { label: "Review Washington birth-record details", href: WA_BIRTH_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Use the details exactly as they appear on the birth record. A misspelled name, an incorrect county, or a parent's married name used instead of the name on the certificate can delay the search.",
      ],
      bullets: [
        "The person's full name at birth, including any suffix.",
        "Date of birth and the city or county of birth in Washington.",
        "The mother's name as shown on the record, including her maiden name.",
        "The father's or other parent's name as shown on the record, if listed.",
        "Your relationship to the person named on the certificate.",
        "Valid government identification or approved alternate identification.",
        "Documentation that proves your qualifying relationship.",
        "A deliverable mailing address and the payment method the channel accepts.",
      ],
    },
    {
      id: "process",
      heading: "How a Washington request usually works",
      bullets: [
        "Confirm that the birth occurred in Washington and that the record is from July 1, 1907 or later.",
        "Decide whether you need a certified certificate, a Heirloom certificate, or an informational copy.",
        "Confirm that you qualify for the certificate type you want.",
        "Gather identification and the documentation that proves your relationship.",
        "Choose online or phone through VitalChek, mail, or a local office.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Keep the confirmation and any order reference so you can follow up.",
      ],
      note: "A correction is separate from ordering a copy. Confirm which process applies before you file.",
    },
    {
      id: "corrections",
      heading: "Corrections and changes",
      paragraphs: [
        "Washington uses an Affidavit for Correction for most changes to a birth certificate. A parent listed on the certificate or a legal guardian with a certified court document can request a change for a person under 18. An emancipated minor with certified court documents is treated as an adult.",
        "The proof required depends on the field being changed. Some name changes require a court order, and corrections to sex designation follow a separate process. Adoption, parentage, court-ordered legal name changes, and surrogacy also follow separate paths rather than the standard correction form.",
        "The Department can amend a Washington birth record from 1907 to the present. Follow the instructions for the specific change so the application is complete.",
      ],
      bullets: [
        "Use the Affidavit for Correction form for most corrections.",
        "A parent or legal guardian can request a change for a minor with the required documentation.",
        "Some name changes require a certified court order.",
        "Sex-designation changes follow the state's separate process.",
        "Adoption, parentage, court-ordered name changes, and surrogacy are handled separately.",
        "Do not use a standard certificate order when the record itself needs to be changed.",
      ],
      links: [
        { label: "Review Washington birth-certificate correction rules", href: WA_CORRECT_URL },
      ],
    },
    {
      id: "adoption",
      heading: "Adoption records and original birth certificates",
      paragraphs: [
        "When a Washington adoption is finalized, the original birth certificate is sealed and a new certificate is issued in the adoptive name. The original record is held in a sealed file, and a standard certified-copy order is not the right path for an adoptee seeking it.",
        "An adoptee who is 18 or older may request a noncertified copy of the original birth certificate unless a birth parent has filed a contact preference form or affidavit of nondisclosure indicating that the original should not be released. The request uses the adoptee's form, requires a current photo ID, and must be mailed because the applicant must sign the certification statement.",
        "The sealed files are not stored at the Department of Health, so the Department may need time to retrieve a record. An adopted person over 21, or a birth parent or birth family member, may also petition the superior court in the county of adoption for a confidential intermediary.",
      ],
      bullets: [
        "The amended certificate is the current record in the adoptive name.",
        "An adoptee 18 or older may request a noncertified copy of the original record.",
        "A birth parent's contact preference or affidavit of nondisclosure can prevent release.",
        "The request must be mailed with a signed statement and a current photo ID.",
        "The original record is not available through the online or phone ordering system.",
        "A confidential intermediary requires a court petition in the county of adoption.",
      ],
      links: [
        { label: "Review Washington adoption records", href: WA_ADOPTION_URL },
        {
          label: "Review the adult adoptee original-record process",
          href: WA_ORIGINAL_URL,
        },
      ],
    },
    {
      id: "apostille",
      heading: "Using a Washington certificate outside the United States",
      paragraphs: [
        "An apostille is issued by the Washington Secretary of State to verify to a foreign government that a Washington document is authentic. The Department of Health can coordinate an apostille when you order the birth certificate, or you can take an existing certificate directly to the Secretary of State.",
        "Only a certified copy can receive an apostille. A noncertified informational copy is not eligible. If you request the apostille with the birth record order, include the destination country and the number of apostilles on the order form.",
        "The Department forwards the certified record and apostille request to the Secretary of State after processing the order. The Secretary of State then issues the apostille and returns the document.",
      ],
      bullets: [
        "Order a certified Washington birth certificate, not an informational copy.",
        "If you already have the certificate, go directly to the Secretary of State.",
        "If you order both together, use the Department's mail form or the VitalChek phone line.",
        "Include the country requiring the document and the number of apostilles.",
        "An apostille is for international use, not for use inside the United States.",
      ],
      links: [
        { label: "Review Washington apostille coordination", href: WA_APOSTILLE_URL },
        {
          label: "Review the Washington Secretary of State apostille program",
          href: WA_SOS_URL,
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
      question: "Where do I find the official Washington birth certificate requirements?",
      answer: `Use the [Washington Vital Records page](${WA_VITAL_URL}) and the [birth-record ordering page](${WA_BIRTH_URL}). They are the source of truth for current products, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question:
        "What is the difference between a certified certificate and an informational copy in Washington?",
      answer:
        "A certified birth certificate is printed on security paper and can be used for legal purposes. It requires identity and relationship documentation. A noncertified informational copy carries a watermark stating that it cannot be used for legal purposes, and anyone may request one without identity or relationship proof.",
    },
    {
      question: "Who can request a Washington birth certificate?",
      answer: `Qualified applicants include a spouse or domestic partner, parent, stepparent, child, stepchild, sibling, grandparent, great-grandparent, grandchild, great-grandchild, and legal guardian. A person may order their own certificate. Review [Washington's qualified-applicant list](${WA_BIRTH_URL}).`,
    },
    {
      question: "What identification does Washington require?",
      answer: `A certified certificate or Heirloom certificate requires valid government identification or approved alternate identification, plus documentation that proves your qualifying relationship. Review the [birth-record page](${WA_BIRTH_URL}) for the current requirements.`,
    },
    {
      question: "Can I order a Washington birth certificate online?",
      answer: `Yes, through VitalChek, the Department of Health's contracted vendor. Start from the [official ordering page](${WA_ORDER_URL}) or the [birth-record page](${WA_BIRTH_URL}) so you use the approved service.`,
    },
    {
      question: "Can I use a local health department instead of the state office?",
      answer: `The Department partners with local health departments for in-person service on many birth and death certificate purchases. Availability varies by location, so check with the local office before you go. The [ordering page](${WA_ORDER_URL}) explains the current channels.`,
    },
    {
      question: "What if the birth occurred before July 1, 1907?",
      answer:
        "The Department of Health holds birth records from July 1, 1907 to the present. For an earlier event, contact the local or county records office that may hold the record, or a historical or genealogical resource for Washington.",
    },
    {
      question: "How do I correct a Washington birth certificate?",
      answer: `Use the Affidavit for Correction for most changes. A parent or legal guardian can request a change for a minor with the required documentation, and some name changes require a certified court order. Adoption, parentage, sex designation, court-ordered name changes, and surrogacy follow separate processes. Review [Washington correction rules](${WA_CORRECT_URL}).`,
    },
    {
      question: "How does an adult adoptee get an original Washington birth certificate?",
      answer: `An adoptee 18 or older may request a noncertified copy of the original birth certificate unless a birth parent has filed a contact preference form or affidavit of nondisclosure indicating that it should not be released. The request must be mailed with a signed statement and current photo ID. Review the [original-record process](${WA_ORIGINAL_URL}).`,
    },
    {
      question: "How do I get an apostille for a Washington birth certificate?",
      answer: `Only a certified Washington birth certificate can receive an apostille. You can ask the Department of Health to coordinate the apostille when you order the certificate, or take an existing certificate directly to the Secretary of State. Review the [Department's apostille guidance](${WA_APOSTILLE_URL}) and the [Secretary of State program](${WA_SOS_URL}).`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Washington Department of Health – Vital Records", href: WA_VITAL_URL },
    { label: "Washington Department of Health – Ordering a birth record", href: WA_BIRTH_URL },
    { label: "Washington Department of Health – Ordering a vital record", href: WA_ORDER_URL },
    {
      label: "Washington Department of Health – Changing a birth certificate",
      href: WA_CORRECT_URL,
    },
    { label: "Washington Department of Health – Adoptions", href: WA_ADOPTION_URL },
    {
      label: "Washington Department of Health – Original birth certificate for an adopted person",
      href: WA_ORIGINAL_URL,
    },
    { label: "Washington Department of Health – Apostilles", href: WA_APOSTILLE_URL },
    {
      label: "Washington Secretary of State – Apostilles program",
      href: WA_SOS_URL,
    },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your Washington Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

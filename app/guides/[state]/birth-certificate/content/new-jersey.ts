import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const NJ_VITAL_URL = "https://www.nj.gov/health/vital/";
const NJ_NON_GENEALOGICAL_URL =
  "https://www.nj.gov/health/vital/order-vital/non-genealogical-records";
const NJ_ONLINE_URL = "https://www.nj.gov/health/vital/order-vital/online-requests";
const NJ_ID_URL = "https://www.nj.gov/health/vital/contact-us/acceptable-identification";
const NJ_CORRECT_URL = "https://www.nj.gov/health/vital/correcting-vital";
const NJ_ADOPTION_URL = "https://www.nj.gov/health/vital/adoption";
const NJ_ADOPTION_FAQ_URL =
  "https://www.nj.gov/health/vital/adoption/vital-record-law-changes-faqs";
const NJ_APOSTILLE_URL = "https://www.nj.gov/treasury/revenue/apostilles.shtml";

export const NEW_JERSEY_GUIDE: BirthGuideContent = {
  stateName: "New Jersey",
  metaTitle: "New Jersey Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How New Jersey birth certificate requests work: who may order, relationship proof, photo ID, state and local filing, corrections, USVC help.",
  subtitle:
    "Confirm the relationship and identification rules for a New Jersey birth record, then choose the state, local, or online filing path that fits.",
  intro: [
    "New Jersey treats a birth that occurred within the last 80 years as a non-genealogical record. The Department of Health issues certified copies only to the person named on the record and to applicants who can document a qualifying relationship.",
    "This guide explains the relationship rules, acceptable identification, certified versus informational copies, state and local filing, corrections, adoption records, and apostilles. The official New Jersey pages control the current application requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "New Jersey Department of Health, Office of Vital Statistics and Registry",
    },
    {
      label: "Record location",
      value:
        "State office from January 1, 1923; earlier births are at the New Jersey State Archives",
    },
    {
      label: "Copy type",
      value: "Certified copy for legal use; certification is an uncertified informational copy",
    },
    {
      label: "Where to request",
      value: "State office, local vital records office, or the state's online ordering service",
    },
    {
      label: "Eligibility",
      value:
        "Subject, parent, guardian, legal representative, spouse or partner, adult child, adult grandchild, or adult sibling",
    },
    {
      label: "Record access",
      value:
        "Births within the last 80 years are non-genealogical; older records follow genealogical rules",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official New Jersey resource",
      paragraphs: [
        "The Office of Vital Statistics and Registry controls the application, eligibility, identification, and payment rules. Its non-genealogical-records page explains the current state, local, mail, and online options and links to the forms the agency accepts.",
        "Use the official pages to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official New Jersey vital-records page", href: NJ_VITAL_URL },
        {
          label: "Review New Jersey non-genealogical record rules",
          href: NJ_NON_GENEALOGICAL_URL,
        },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a New Jersey birth certificate",
      paragraphs: [
        "A certified copy of a birth record is limited to the person named on the certificate and applicants who prove a qualifying relationship. The eligible list includes the subject's parent, legal guardian, or legal representative; the subject's spouse or civil union partner; and an adult child, adult grandchild, or adult sibling.",
        "Proof of relationship is required for a certified copy and is the most common reason an application is rejected. An informational certification does not require relationship proof, but the requester must still prove their identity.",
        "If you do not qualify and are not the legal representative of someone who does, the state may require a court order directing the State Registrar to issue the record. A subpoena is not enough.",
      ],
      bullets: [
        "The person named on the record may request their own certificate.",
        "A parent, legal guardian, or legal representative must provide the required authorization and relationship evidence.",
        "A spouse or civil union partner must document the marriage or civil union.",
        "An adult child, adult grandchild, or adult sibling must connect their identification to the subject through birth or marriage records.",
        "A person whose name changed by marriage or civil union should include the record that links the current name to the birth record.",
        "A certification is available without relationship proof, but it is not valid for legal purposes.",
      ],
      links: [
        {
          label: "Review New Jersey non-genealogical eligibility and relationship proof",
          href: NJ_NON_GENEALOGICAL_URL,
        },
      ],
    },
    {
      id: "identification",
      heading: "Provide acceptable New Jersey identification",
      paragraphs: [
        "New Jersey requires acceptable identification for every vital-record request. The simplest route is a valid photo driver's license or photo non-driver's license showing your current address.",
        "If you do not have a photo license, the state allows a driver's license without a photo plus an alternate form of identification that shows your current address. Another option is two alternate forms of identification, one of which must show the current address.",
        "The alternate list includes a U.S. or foreign passport, a permanent resident card, a federal or state identification card, a county identification card, and a school identification card. Send copies unless the application specifically asks for an original.",
      ],
      bullets: [
        "Use the name and address shown on the application and the identification consistently.",
        "If your name changed, include the marriage, civil union, or court record that connects the names.",
        "A copy of the identification is normally required; do not send your only original document.",
        "A legal representative should include the identification and authorization documents required for that role.",
        "The state may contact you if the identification or relationship evidence is incomplete.",
      ],
      links: [{ label: "Review New Jersey acceptable identification", href: NJ_ID_URL }],
    },
    {
      id: "where-to-file",
      heading: "State office, local registrar, or online service",
      paragraphs: [
        "The Office of Vital Statistics and Registry in Trenton handles records from January 1, 1923 to the present. Local vital records offices can also issue birth records for events in their municipalities, although local services and procedures vary.",
        "The state offers online ordering through its contracted service, VitalChek. You can also file by mail or in person using the current application. Start from the official state page so you use the approved online path.",
        "For a birth before January 1, 1923, contact the New Jersey State Archives. The state office's current-record system does not cover those earlier births.",
      ],
      bullets: [
        "State office: use the current application and the state's mail or in-person instructions.",
        "Local office: confirm that the registrar can issue the record and whether it accepts the filing method you want.",
        "Online: use the ordering link published by the New Jersey Department of Health.",
        "Older births: contact the New Jersey State Archives for records before 1923.",
        "A certified copy is mailed to the address on the identification; follow the state instructions if you need a different delivery arrangement.",
      ],
      links: [
        { label: "Review New Jersey online ordering", href: NJ_ONLINE_URL },
        {
          label: "Review New Jersey non-genealogical filing options",
          href: NJ_NON_GENEALOGICAL_URL,
        },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Use the details exactly as they appear on the birth record. A misspelled name, an incorrect municipality, or a parent's married name used instead of the name on the certificate can delay the search.",
      ],
      bullets: [
        "The person's full name at birth, including any suffix.",
        "Date of birth and the municipality or county of birth in New Jersey.",
        "The mother's name as shown on the record, including her maiden name.",
        "The father's or other parent's name as shown on the record, if listed.",
        "Your relationship to the person named on the certificate.",
        "Acceptable identification and the documents that prove your relationship.",
        "A deliverable mailing address and the payment method the filing channel accepts.",
      ],
    },
    {
      id: "process",
      heading: "How a New Jersey request usually works",
      bullets: [
        "Confirm that the birth occurred in New Jersey and that the record is non-genealogical.",
        "Confirm that you qualify for a certified copy or that you want an informational certification.",
        "Choose the state office, a local registrar, or the approved online service.",
        "Gather acceptable identification and the proof required for your relationship.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit the application, identification, supporting documents, and payment through the channel you selected.",
        "Keep the confirmation and any order reference so you can follow up.",
      ],
      note: "A correction is separate from ordering a copy. Confirm which process applies before you file.",
    },
    {
      id: "corrections",
      heading: "Corrections and amendments",
      paragraphs: [
        "New Jersey handles corrections with the REG-15 Application to Amend a Vital Record. You may file with the Office of Vital Statistics and Registry or with the local registrar in the municipality where the birth occurred.",
        "The evidence required depends on the correction. A legal name change requires the original judgment of name change. Other corrections may require birth, marriage, divorce, parentage, or court records that support the requested change.",
        "The state will not replace copies that were issued before an amendment is completed. If you need an updated certificate, order a new copy after the amendment is recorded.",
      ],
      bullets: [
        "Use the REG-15 form for the correction you need.",
        "Include verifiable documentary proof; an unsupported request will not be processed.",
        "A legal name change requires the original court judgment.",
        "Parentage and surname corrections have their own evidence requirements.",
        "Sex-designation changes follow a separate state process.",
        "Order a new certified copy after the amendment is recorded if you need the updated record.",
      ],
      links: [{ label: "Review New Jersey correction requirements", href: NJ_CORRECT_URL }],
    },
    {
      id: "adoption",
      heading: "Adoption records and original birth certificates",
      paragraphs: [
        "When a New Jersey adoption is finalized, the original birth certificate is sealed and a new certificate is issued in the adoptive name. A standard certified-copy order is not the right path for an adoptee seeking the pre-adoption record.",
        "Since May 27, 2014, an adult adopted person and certain other eligible requesters may obtain a non-certified copy of the original birth certificate, subject to the state's privacy restrictions. The record is for informational purposes and cannot be used as legal proof of identity or citizenship.",
        "Eligible requesters include the adult adoptee, a direct descendant, sibling, or spouse of the adopted person, an adoptive parent, legal guardian, or other legal representative, and a state or federal agency for official purposes. Birth parents may file a contact preference, and identifying information may be redacted under the state's rules.",
      ],
      bullets: [
        "Use the adoption process for a new certificate in the adoptive name.",
        "Use the original-record process for a non-certified pre-adoption copy.",
        "The original birth certificate is not open for public access.",
        "The applicant must provide identity and relationship documentation with the application.",
        "A contact preference or redaction on file can affect what is released.",
        "A non-certified original record cannot be used for legal identity or citizenship purposes.",
      ],
      links: [
        { label: "Review New Jersey adoption records", href: NJ_ADOPTION_URL },
        {
          label: "Read New Jersey adoptee and birth-parent FAQs",
          href: NJ_ADOPTION_FAQ_URL,
        },
      ],
    },
    {
      id: "apostille",
      heading: "Using a New Jersey certificate outside the United States",
      paragraphs: [
        "The New Jersey Department of the Treasury, Division of Revenue and Enterprise Services, issues apostilles and certifications for documents that will be used internationally. An apostille is used for countries that participate in the Hague Convention; a certification is used for other countries.",
        "Obtain a certified New Jersey vital record first. The Division authenticates the signature of the public official who certified the document, so a photocopy or an uncertified informational copy is not the right starting point.",
        "The Division cannot authenticate a vital record issued by another state. Those records must be authenticated in the state or country of origin.",
      ],
      bullets: [
        "Order a certified copy of the New Jersey birth certificate before requesting international authentication.",
        "Use an apostille for a Hague Convention destination.",
        "Use a certification for a country outside the Hague Convention.",
        "The Division authenticates New Jersey records only.",
        "Follow the Treasury's current submission instructions for the document and payment.",
      ],
      links: [
        {
          label: "Review New Jersey apostille and certification instructions",
          href: NJ_APOSTILLE_URL,
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
      question: "Where do I find the official New Jersey birth certificate requirements?",
      answer: `Use the [New Jersey vital-records page](${NJ_VITAL_URL}) and the [non-genealogical records page](${NJ_NON_GENEALOGICAL_URL}). They are the source of truth for current application options, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Are New Jersey birth certificates open to anyone?",
      answer:
        "No. A birth within the last 80 years is a non-genealogical record, and a certified copy is limited to the subject and applicants who prove a qualifying relationship. An informational certification does not require relationship proof, but it is not valid for legal purposes.",
    },
    {
      question: "Who can request a certified New Jersey birth certificate?",
      answer: `The person named on the record, a parent, legal guardian, or legal representative, a spouse or civil union partner, and an adult child, adult grandchild, or adult sibling. Review [New Jersey relationship requirements](${NJ_NON_GENEALOGICAL_URL}) before filing.`,
    },
    {
      question: "What identification does New Jersey require?",
      answer: `Use a valid photo driver's license or photo non-driver's license with your current address, or the alternate combination shown on the [state ID page](${NJ_ID_URL}). A license without a photo, a passport, a permanent resident card, a county ID, or a school ID may be used in the allowed combinations.`,
    },
    {
      question:
        "What is the difference between a certified copy and a certification in New Jersey?",
      answer:
        "A certified copy is valid for legal purposes and requires proof of your relationship to the person named on the record. A certification is an uncertified informational copy. It requires identification but not relationship proof, and it cannot be used to establish identity or legal status.",
    },
    {
      question: "Can I order a New Jersey birth certificate online?",
      answer: `Yes, through the state's contracted online service, VitalChek. Start from the [official online-request page](${NJ_ONLINE_URL}) or the [non-genealogical records page](${NJ_NON_GENEALOGICAL_URL}) so you use the approved provider.`,
    },
    {
      question: "Can I use a local registrar instead of the state office?",
      answer:
        "Yes. A local vital records office can issue a birth record for an event in its municipality, but local services and procedures vary. The state office handles records from 1923 forward and provides the statewide application.",
    },
    {
      question: "What if the birth occurred before 1923?",
      answer:
        "Contact the New Jersey State Archives. The Office of Vital Statistics and Registry's current-record system covers births from January 1, 1923 forward, and the Treasury's apostille guidance also directs earlier records to the Archives.",
    },
    {
      question: "How do I correct a New Jersey birth certificate?",
      answer: `File the REG-15 Application to Amend a Vital Record with the state office or the local registrar where the birth occurred. Include the documentary proof required for the specific change, and order a new certified copy after the amendment is recorded. Review [New Jersey correction instructions](${NJ_CORRECT_URL}).`,
    },
    {
      question: "How does an adult adoptee get a New Jersey original birth certificate?",
      answer: `Since May 27, 2014, an adult adoptee and certain other eligible requesters may obtain a non-certified copy of the original birth certificate, subject to privacy restrictions. The record is informational only. Review the [adoption page](${NJ_ADOPTION_URL}) and the [adoptee FAQ](${NJ_ADOPTION_FAQ_URL}).`,
    },
    {
      question: "How do I get an apostille for a New Jersey birth certificate?",
      answer: `First obtain a certified New Jersey birth certificate, then submit it to the New Jersey Department of the Treasury, Division of Revenue and Enterprise Services. The Division issues an apostille for Hague Convention countries and a certification for other countries. Review the [Treasury instructions](${NJ_APOSTILLE_URL}).`,
    },
  ],
  sources: [
    { label: "New Jersey Department of Health – Vital Statistics", href: NJ_VITAL_URL },
    {
      label: "New Jersey Department of Health – Non-genealogical records",
      href: NJ_NON_GENEALOGICAL_URL,
    },
    { label: "New Jersey Department of Health – Online requests", href: NJ_ONLINE_URL },
    { label: "New Jersey Department of Health – Acceptable identification", href: NJ_ID_URL },
    { label: "New Jersey Department of Health – Correcting a vital record", href: NJ_CORRECT_URL },
    { label: "New Jersey Department of Health – Adoption records", href: NJ_ADOPTION_URL },
    {
      label: "New Jersey Department of Health – Adoptee and birth-parent FAQs",
      href: NJ_ADOPTION_FAQ_URL,
    },
    {
      label: "New Jersey Department of the Treasury – Apostilles and certifications",
      href: NJ_APOSTILLE_URL,
    },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your New Jersey Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const VA_VITAL_URL = "https://www.vdh.virginia.gov/vital-records/";
const VA_APPLY_URL = "https://www.vdh.virginia.gov/vital-records/applications-for-a-vital-record/";
const VA_ID_URL = "https://www.vdh.virginia.gov/vital-records/id-requirements/";
const VA_WALK_IN_URL = "https://www.vdh.virginia.gov/vital-records/vital-record-walk-in-locations/";
const VA_FAQ_URL = "https://www.vdh.virginia.gov/vital-records/frequently-asked-questions/";
const VA_AMEND_URL =
  "https://www.vdh.virginia.gov/vital-records/how-to-request-an-amendment-to-a-birth-certificate/";
const VA_FOREIGN_URL = "https://www.vdh.virginia.gov/vital-records/foreign-authentication/";
const VA_AUTH_URL = "https://www.commonwealth.virginia.gov/official-documents/authentications/";

export const VIRGINIA_GUIDE: BirthGuideContent = {
  stateName: "Virginia",
  metaTitle: "Virginia Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How Virginia birth certificate requests work: immediate-family eligibility, photo ID, online, mail, walk-in, amendments, adoption records, USVC help.",
  subtitle:
    "Confirm who may receive a Virginia birth record, prepare the right identification, and choose an online, mail, or walk-in filing path.",
  intro: [
    "Virginia birth records become public 100 years after the event. Before that point, the Department of Health limits certified copies to the immediate family and to a legal representative acting under a power of attorney.",
    "This guide explains the eligibility rules, the primary and secondary identification requirements, state and local filing, amendments, the state's 2026 adult-adoptee law, and authentication for international use. The official Virginia Department of Health pages control the current application requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Virginia Department of Health, Office of Vital Records",
    },
    {
      label: "Record location",
      value: "Statewide birth records held by the Office of Vital Records",
    },
    {
      label: "Copy type",
      value: "Certified birth certificate; adoption records may be sealed",
    },
    {
      label: "Where to request",
      value:
        "Online, by mail, or in person at the Richmond office, DMV, or a local health department",
    },
    {
      label: "Eligibility",
      value: "Subject, mother, father, current spouse, adult child, adult sibling, or grandparent",
    },
    {
      label: "Record access",
      value: "Public 100 years after the event; restricted to immediate family before then",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Virginia resource",
      paragraphs: [
        "The Office of Vital Records controls the application, eligibility, identification, and payment rules. Its application page explains the current online, mail, and walk-in options and links to the forms the agency accepts.",
        "Use the official pages to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official Virginia vital-records page", href: VA_VITAL_URL },
        { label: "Review Virginia application options", href: VA_APPLY_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Virginia birth certificate",
      paragraphs: [
        "A birth record becomes public information 100 years after the date of the event. Before that point, a certified copy is available only to the immediate family: the mother, father, current spouse, adult child, adult sibling, or grandparent of the person named on the record. The person named on the record may also request their own certificate.",
        "Aunts, uncles, cousins, and in-laws cannot obtain a certified Virginia birth record. A legal representative may request for the registrant with a properly executed power of attorney and their own identification.",
        "If you do not qualify as an immediate family member and are not the registrant's legal representative, the state's rules do not provide a standard certified-copy path.",
      ],
      bullets: [
        "The person named on the record may request their own certificate.",
        "A parent, current spouse, adult child, adult sibling, or grandparent may request with valid identification.",
        "A legal representative must provide a properly executed power of attorney and identification.",
        "Aunts, uncles, cousins, and in-laws are not eligible for a certified copy.",
        "The relationship must be documented; a name difference may require a marriage or court record.",
        "Records 100 years or older are public and are not limited by the immediate-family rule.",
      ],
      links: [{ label: "Review Virginia eligibility and ID requirements", href: VA_ID_URL }],
    },
    {
      id: "identification",
      heading: "Prepare identification under Virginia's rules",
      paragraphs: [
        "Anyone requesting a Virginia vital record must submit a photocopy of their identification. You can use one primary document or two secondary documents from the state's list.",
        "Primary documents include a photo identification card issued by a U.S. state, territory, or jurisdiction that is unexpired or expired for no more than one year; a learner's or instruction permit with the same limits; a current school or employment photo ID with an identification number; an unexpired U.S. military card; an unexpired U.S. passport or passport card; and specified foreign passport or immigration documents.",
        "If you use secondary documents, submit two. The list includes military discharge papers, certified school records, a welfare or social services identification card with photo, a state driver's license or photo ID expired no more than five years, an expired U.S. passport or passport card, an unexpired military dependent ID, a foreign passport expired no more than five years, an unexpired weapons permit, and an unexpired pilot license.",
      ],
      bullets: [
        "Send a photocopy of the identification; do not send your only original document.",
        "Use the name consistently across the application and the identification.",
        "If your name changed, include the marriage or court record that connects the names.",
        "A legal representative should include the power of attorney and identification required for that role.",
        "Check the state list if a document is expired; the acceptable age limits differ by document type.",
      ],
      links: [{ label: "Review Virginia primary and secondary ID documents", href: VA_ID_URL }],
    },
    {
      id: "where-to-file",
      heading: "Online, by mail, or in person",
      paragraphs: [
        "Virginia accepts an online application through the Office of Vital Records. The online form assigns an application tracking ID and provides email and text updates on the status of the request.",
        "You can also mail a completed application and supporting documents to the Office of Vital Records, or use a walk-in location. The Richmond office accepts walk-ins without an appointment. Participating DMV locations and local health departments also issue records, but their services and hours vary, so confirm before you go.",
        "Changes and amendments are handled only by the Office of Vital Records. A DMV or local health department location may accept a record request, but it cannot complete an amendment.",
      ],
      bullets: [
        "Online: use the application link published by the Virginia Department of Health.",
        "Mail: send the current application, identification, supporting documents, and payment to the address on the form.",
        "Richmond office: walk-in service is available without an appointment.",
        "DMV and local health departments: confirm that the location issues birth records and check its hours.",
        "Amendments: file with the Office of Vital Records, not a local issuance location.",
      ],
      links: [
        { label: "Start a Virginia vital-record application", href: VA_APPLY_URL },
        { label: "Find Virginia walk-in locations", href: VA_WALK_IN_URL },
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
        "Date of birth and the city or county of birth in Virginia.",
        "The mother's name as shown on the record, including her maiden name.",
        "The father's or other parent's name as shown on the record, if listed.",
        "Your relationship to the person named on the certificate.",
        "A photocopy of your primary identification or two secondary documents.",
        "A deliverable mailing address and the payment method the filing channel accepts.",
      ],
    },
    {
      id: "process",
      heading: "How a Virginia request usually works",
      bullets: [
        "Confirm that the birth occurred in Virginia and that you are an eligible applicant.",
        "Choose the online application, mail, or a walk-in location.",
        "Prepare a photocopy of your primary ID or two secondary documents.",
        "Gather the marriage, birth, or court records that document your relationship if your name differs.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit the application, identification, supporting documents, and payment through the channel you selected.",
        "Keep the application tracking ID and any confirmation so you can follow up.",
      ],
      note: "A correction is separate from ordering a copy. The Office of Vital Records must review an amendment before an updated certificate can be issued.",
    },
    {
      id: "corrections",
      heading: "Corrections and amendments",
      paragraphs: [
        "Virginia uses the VS43 amendment request form for changes to a birth certificate. Submit the online form or the paper form with the information and documents you have. The Office of Vital Records reviews the request and tells you what additional evidence is necessary.",
        "The requirements depend on the change. A parentage, name, sex-designation, or court-ordered change may require a certified court order or other specific records. An amendment cannot be completed at a DMV or local health department location.",
        "If you need a copy of the amended certificate, request it with the amendment or order it after the change is recorded. Confirm the current fee and submission instructions on the state page.",
      ],
      bullets: [
        "Use the VS43 form or the online amendment request.",
        "Include the records that support the specific change; the state may request more after review.",
        "A court-ordered change requires the certified court order.",
        "Sex-designation changes follow the state's separate guidance.",
        "File amendments with the Office of Vital Records, not a local issuance location.",
        "Order a new certified copy after the amendment is recorded if you need the updated document.",
      ],
      links: [{ label: "Review Virginia birth-certificate amendments", href: VA_AMEND_URL }],
    },
    {
      id: "adoption",
      heading: "Adoption records and original birth certificates",
      paragraphs: [
        "When a Virginia adoption is finalized, a new birth certificate is created in the adoptive name and the original certificate and adoption order are placed in a sealed file. A standard certified-copy order is not the right path for an adoptee seeking the original record.",
        "Effective July 1, 2026, an adult adoptee whose original birth certificate was sealed and filed by the Virginia Department of Health may request a copy of the sealed original birth record from the State Registrar. The request uses the Application for Certification of a Birth Record and must include a legible copy of the applicant's photo ID and the required payment.",
        "A birth parent named on the original record may file an optional contact preference form indicating whether they want contact when the adopted person becomes an adult. A copy of the form is provided to an adult adoptee who requests the sealed original record. For other adoption records and disclosure questions, the Department of Social Services has an Adoption Disclosure Specialist.",
      ],
      bullets: [
        "The amended certificate is the current record in the adoptive name.",
        "The original certificate and adoption order are sealed by the court or the state.",
        "Since July 1, 2026, an adult adoptee may request a copy of a sealed original record held by the Department of Health.",
        "The request is made to the State Registrar by mail or in person at the Office of Vital Records.",
        "A birth parent may file a contact preference, which is shared with the adult adoptee who requests the original record.",
        "The Department of Social Services can assist with adoption records and disclosure questions.",
      ],
      links: [{ label: "Read Virginia adoption and original-record guidance", href: VA_FAQ_URL }],
    },
    {
      id: "apostille",
      heading: "Using a Virginia certificate outside the United States",
      paragraphs: [
        "The Virginia Office of Vital Records does not authenticate documents for foreign use. A certified Virginia vital record must be sent to the Secretary of the Commonwealth's Authentication Division.",
        "The Secretary issues an apostille for countries that participate in the Hague Convention and a Great Seal authentication for other destinations. The authentication verifies that the Virginia official who issued or certified the document is in good standing; it does not regulate what the receiving country requires.",
        "State-level authentication cannot be provided for a document that will be used within the United States or its territories. A document issued by another state must be authenticated in its state of origin.",
      ],
      bullets: [
        "Obtain a certified Virginia birth certificate before requesting authentication.",
        "Send the vital record to the Secretary of the Commonwealth, not the Office of Vital Records.",
        "Use an apostille for a Hague Convention destination.",
        "Use a Great Seal authentication for a non-Hague destination.",
        "State authentication is for international use, not for use within the United States.",
      ],
      links: [
        { label: "Review Virginia foreign-authentication guidance", href: VA_FOREIGN_URL },
        {
          label: "Review Secretary of the Commonwealth authentication instructions",
          href: VA_AUTH_URL,
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
      question: "Where do I find the official Virginia birth certificate requirements?",
      answer: `Use the [Virginia Vital Records page](${VA_VITAL_URL}) and the [application page](${VA_APPLY_URL}). They are the source of truth for current application options, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Are Virginia birth certificates public records?",
      answer:
        "A Virginia birth record becomes public information 100 years after the date of the event. Before that point, a certified copy is limited to the immediate family and a legal representative acting under a power of attorney.",
    },
    {
      question: "Who can request a Virginia birth certificate?",
      answer: `The person named on the record, the mother, father, current spouse, adult child, adult sibling, or grandparent, and a legal representative with a power of attorney. Aunts, uncles, cousins, and in-laws cannot obtain a certified copy. Review [Virginia eligibility and ID rules](${VA_ID_URL}).`,
    },
    {
      question: "What identification does Virginia require?",
      answer: `Submit a photocopy of one primary document or two secondary documents from the [state ID list](${VA_ID_URL}). A current state photo ID, passport, military ID, or school or employment photo ID is a common primary choice. Expiration limits differ by document type.`,
    },
    {
      question: "Can I apply for a Virginia birth certificate online?",
      answer: `Yes. Use the [official online application](${VA_APPLY_URL}) published by the Virginia Department of Health. The form assigns an application tracking ID and provides status updates.`,
    },
    {
      question: "Can I use a DMV or local health department office?",
      answer: `Participating DMV locations and local health departments can issue records, but services and hours vary. The [walk-in location page](${VA_WALK_IN_URL}) lists the Richmond office, DMV locations, and local health departments. Confirm the location before you go.`,
    },
    {
      question: "Do I need an appointment at the Richmond office?",
      answer:
        "No. The Office of Vital Records in Richmond accepts walk-ins without an appointment. If you are filing an amendment, the state recommends mailing it or dropping it off for processing rather than waiting in person.",
    },
    {
      question: "How do I correct a Virginia birth certificate?",
      answer: `Submit the VS43 amendment request or use the online form. The Office of Vital Records reviews the request and tells you what evidence is needed. A court-ordered change requires the certified order, and amendments cannot be completed at a DMV or local health department. Review [Virginia amendment instructions](${VA_AMEND_URL}).`,
    },
    {
      question: "How does an adult adoptee get an original Virginia birth certificate?",
      answer: `Effective July 1, 2026, an adult adoptee whose original birth certificate was sealed and filed by the Virginia Department of Health may request a copy from the State Registrar. Submit the Application for Certification of a Birth Record, a legible photo ID, and the required payment by mail or in person. Review the [state FAQ](${VA_FAQ_URL}).`,
    },
    {
      question: "How do I get an apostille for a Virginia birth certificate?",
      answer: `Obtain a certified Virginia birth certificate, then send it to the Secretary of the Commonwealth's Authentication Division. The Secretary issues an apostille for Hague Convention countries and a Great Seal authentication for other destinations. The Office of Vital Records does not authenticate documents. Review the [authentication instructions](${VA_AUTH_URL}).`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Virginia Department of Health – Vital Records", href: VA_VITAL_URL },
    {
      label: "Virginia Department of Health – Vital-record applications",
      href: VA_APPLY_URL,
    },
    { label: "Virginia Department of Health – Identification requirements", href: VA_ID_URL },
    { label: "Virginia Department of Health – Walk-in locations", href: VA_WALK_IN_URL },
    { label: "Virginia Department of Health – Vital-records FAQs", href: VA_FAQ_URL },
    {
      label: "Virginia Department of Health – Birth-certificate amendments",
      href: VA_AMEND_URL,
    },
    { label: "Virginia Department of Health – Foreign authentication", href: VA_FOREIGN_URL },
    {
      label: "Secretary of the Commonwealth – Authentications",
      href: VA_AUTH_URL,
    },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your Virginia Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

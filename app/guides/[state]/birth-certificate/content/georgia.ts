import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const GA_BIRTH_URL = "https://dph.georgia.gov/ways-request-vital-record/birth";
const GA_ORDER_URL = "https://georgia.gov/birth-and-death-certificates";
const GA_ID_URL = "https://georgia.gov/birth-certificate-information-and-eligibility";
const GA_OFFICES_URL = "https://dph.georgia.gov/locations/vital-records-office";
const GA_ADOPTION_URL = "https://dph.georgia.gov/document/document/sb-100-faqs-andees-law/download";
const GA_APOSTILLE_URL =
  "https://www.gsccca.org/notary-and-apostilles/apostilles/general-apostille-information";
const GA_ABOUT_URL = "https://dph.georgia.gov/VitalRecords/about-vital-records";
const GA_FAQ_URL = "https://georgia.gov/faqs-about-certificates";

export const GEORGIA_GUIDE: BirthGuideContent = {
  stateName: "Georgia",
  metaTitle: "Georgia Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How Georgia birth certificate requests work: who may order, physical photo ID, online, mail, county offices, corrections, USVC help.",
  subtitle:
    "Confirm who may receive a Georgia birth record, prepare the right relationship documents, and choose a state or county filing path.",
  intro: [
    "Georgia birth certificates are not public records. The Department of Public Health issues certified copies only to applicants with a direct and tangible interest in the person named on the record, and county vital records offices can issue records for Georgia births.",
    "This guide explains the relationship rules, the physical photo-ID requirement, state and county filing, approved online ordering, corrections, adoption records, and apostilles. The official Georgia pages control the current application and documentation rules.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Georgia Department of Public Health, State Office of Vital Records",
    },
    {
      label: "Record location",
      value: "State Office from January 1919; earlier births are county or archival records",
    },
    {
      label: "Copy type",
      value: "Certified birth certificate; a pre-adoption record is an uncertified copy",
    },
    {
      label: "Where to request",
      value: "State office, county vital records office, or an approved online vendor",
    },
    {
      label: "Eligibility",
      value: "Registrant, immediate family, guardian, or legal representative",
    },
    {
      label: "Identification",
      value: "Physical government-issued photo ID; digital or electronic ID is not accepted",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Georgia resource",
      paragraphs: [
        "The State Office of Vital Records controls the application, eligibility, identification, and payment rules. Its birth-record page explains the current state, county, mail, and online options and links to the forms the agency accepts.",
        "Use the official page to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official Georgia birth-record page", href: GA_BIRTH_URL },
        { label: "Review Georgia certificate ordering", href: GA_ORDER_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Georgia birth certificate",
      paragraphs: [
        "Georgia limits certified birth certificates to people with a direct and tangible interest in the registrant. The eligible list includes the person named on the certificate, a parent named on the record, a grandparent, an adult child, an adult sibling, and a legal spouse.",
        "A legal guardian, attorney, or other legal representative may also request when the required court order or authorization is supplied. Each relationship has its own proof requirement, so confirm the exact documents before filing.",
      ],
      bullets: [
        "The registrant can request with valid government-issued photo identification.",
        "A parent must be named on the birth certificate.",
        "A grandparent generally proves the relationship with the parent's birth certificate.",
        "An adult child or adult sibling generally provides their own birth certificate showing at least one shared parent.",
        "A spouse must provide the marriage record, a copy of the spouse's signature, and the permission letter the state requires.",
        "A legal guardian provides a certified copy of the court order establishing guardianship.",
        "An attorney or legal representative must document the representation and the reason for the request.",
      ],
      links: [
        {
          label: "Review Georgia birth-certificate eligibility and relationship documents",
          href: GA_ID_URL,
        },
      ],
    },
    {
      id: "identification",
      heading: "Use physical photo identification",
      paragraphs: [
        "Georgia requires a valid physical government-issued photo ID. The Department specifically says it does not accept electronic or digital forms of identification, so a photo on a phone is not a substitute for a copy or presentation of the physical credential.",
        "Common acceptable IDs include a Georgia driver's license or state ID, a Georgia weapons carry license with photo, a driver's license or state ID from another U.S. state or territory, a U.S. or foreign passport, a military or veteran ID, a consulate card, a TWIC card, or a current school ID with a number and signature. Some Georgia credentials remain acceptable for a limited period after expiration, so check the official ID list.",
      ],
      bullets: [
        "Use the name and address shown on the application and the identification consistently.",
        "If your name has changed, provide the marriage record, court order, or other official record that connects the names.",
        "A legal representative should include the identification and authorization documents required for that role.",
        "Do not rely on a digital ID, a screenshot, or a photocopy of a photocopy that is not legible.",
      ],
      links: [{ label: "Review Georgia acceptable identification", href: GA_ID_URL }],
    },
    {
      id: "where-to-file",
      heading: "State office, county office, or approved online vendor",
      paragraphs: [
        "The State Office of Vital Records handles birth records from January 1919 to the present. County vital records offices can also issue birth certificates for Georgia births, although individual offices may have their own service hours and local procedures.",
        "Requests can be made in person or by mail. The Department also lists approved online ordering options, including the state's ROVER portal. Start from the official Georgia page so you do not use an unapproved intermediary.",
        "For a birth before January 1919, contact the county where the birth occurred or the Georgia Archives. The State Office does not hold those older records.",
      ],
      bullets: [
        "State office: use the current state application and the Department's mailing or in-person instructions.",
        "County office: confirm that the county can issue the record and whether it accepts the filing method you want.",
        "Online: use only a vendor listed by the Georgia Department of Public Health.",
        "Older births: contact the county of birth or the Georgia Archives rather than the State Office.",
      ],
      links: [
        { label: "Find a Georgia Vital Records office", href: GA_OFFICES_URL },
        { label: "Review Georgia ordering instructions", href: GA_ORDER_URL },
        { label: "Learn how Georgia Vital Records is organized", href: GA_ABOUT_URL },
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
        "Date of birth and the city or county of birth in Georgia.",
        "The mother's name as shown on the record, including her maiden name.",
        "The father's or other parent's name as shown on the record, if listed.",
        "Your relationship to the person named on the certificate.",
        "Physical government-issued photo ID and any relationship documents.",
        "A deliverable mailing address and the payment method the filing channel accepts.",
      ],
    },
    {
      id: "process",
      heading: "How a Georgia request usually works",
      bullets: [
        "Confirm that the birth occurred in Georgia and that you are an eligible applicant.",
        "Choose the state office, a county office, or an approved online vendor.",
        "Gather physical photo ID and the proof required for your relationship.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit the application and supporting documents through the channel you selected.",
        "Keep the confirmation and any order reference so you can follow up.",
        "Check the certificate when it arrives and use the amendment process if the record needs a change.",
      ],
      note: "A correction is separate from ordering a copy. Do not file a standard order if the record itself needs to be amended first.",
    },
    {
      id: "corrections",
      heading: "Corrections, amendments, and legitimacy changes",
      paragraphs: [
        "Georgia separates current-year corrections from general amendments. The Department's birth-record page lists the current forms for correcting a record, adding a parent through legitimation, recording a paternity acknowledgment, adding a spouse, completing a delayed birth record, and filing an out-of-institution birth.",
        "The State Office processes these changes. A county office may help start an application, but the state office handles the amendment. Follow the instructions for the specific form rather than sending a general request.",
      ],
      bullets: [
        "Use the current-year correction process for changes that qualify within the first year.",
        "Use the general amendment form for later changes, including court-ordered name changes and other record updates.",
        "Use the legitimation or paternity process when the father's or parent's information is being added or changed.",
        "Use the adoption process when the record is changing because of an adoption.",
        "Include the supporting records the form requires; a request without the required evidence will not be processed.",
      ],
      links: [{ label: "Review Georgia correction and amendment forms", href: GA_BIRTH_URL }],
    },
    {
      id: "adoption",
      heading: "Adoption records and Andee's Law",
      paragraphs: [
        "When an adoption is finalized, the state issues a new birth certificate in the adoptive name. The original record is handled separately, and a standard certified-copy order is not the right path for an adoptee seeking the pre-adoption record.",
        "Under Andee's Law, a person 18 or older who was born in Georgia may request an uncertified copy of their original birth certificate through the state's ROVER system. County registrars do not have access to those original records. A deceased adoptee's parent, sibling, or direct-line descendant may also qualify with the required proof.",
      ],
      bullets: [
        "Use the adoption process for a new certificate in the adoptive name.",
        "Use the Andee's Law process for an uncertified pre-adoption record.",
        "The original-record request is filed online through ROVER, not at a county office.",
        "A request by a relative of a deceased adoptee needs death and lineage documentation.",
        "A pen-in-hand certified copy is a different product and is not available for the pre-adoption record.",
      ],
      links: [
        { label: "Read Georgia's pre-adoption birth-record guidance", href: GA_ADOPTION_URL },
      ],
    },
    {
      id: "apostille",
      heading: "Using a Georgia certificate outside the United States",
      paragraphs: [
        "The Georgia Superior Court Clerks' Cooperative Authority issues apostilles for Georgia documents used in Hague Convention countries. The Secretary of State's office handles Great Seal authentication for countries outside the Hague Convention; it does not issue apostilles.",
        "The birth certificate must be an official certified copy with the issuing official's signature and seal. If the destination requires a pen-in-hand certificate, request that format from Georgia Vital Records before submitting the document for an apostille.",
      ],
      links: [
        {
          label: "Review Georgia apostille instructions",
          href: GA_APOSTILLE_URL,
        },
        {
          label: "Review Georgia certificate FAQs",
          href: GA_FAQ_URL,
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
      question: "Where do I find the official Georgia birth certificate requirements?",
      answer: `Use the [Georgia Department of Public Health birth-record page](${GA_BIRTH_URL}). It is the source of truth for current application options, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Are Georgia birth certificates public records?",
      answer:
        "No. Georgia limits certified birth certificates to applicants with a direct and tangible interest in the person named on the record. The exact relationship documents are listed on the [state eligibility page](" +
        GA_ID_URL +
        ").",
    },
    {
      question: "Who can request a Georgia birth certificate?",
      answer: `The person named on the certificate, a parent named on the record, a grandparent, an adult child, an adult sibling, a legal spouse, a legal guardian, or a legal representative. Each relationship has specific documentation. Review [Georgia's eligibility rules](${GA_ID_URL}).`,
    },
    {
      question: "Does Georgia accept a digital or electronic photo ID?",
      answer:
        "No. Georgia requires a valid physical government-issued photo ID and does not accept electronic or digital forms of identification. Review the [acceptable ID list](" +
        GA_ID_URL +
        ") before filing.",
    },
    {
      question: "Can I order a Georgia birth certificate online?",
      answer: `Yes, through an approved online vendor listed by the Georgia Department of Public Health. Start from the [official ordering page](${GA_ORDER_URL}) or the [birth-record page](${GA_BIRTH_URL}) so you do not use an unapproved provider.`,
    },
    {
      question: "Can I use a county office instead of the state office?",
      answer: `Yes. County vital records offices can issue Georgia birth certificates. Use the [Vital Records office locator](${GA_OFFICES_URL}) to confirm the office and its services. For births before January 1919, contact the county of birth or the Georgia Archives.`,
    },
    {
      question: "What if I need a birth record from before 1919?",
      answer:
        "The State Office holds records from January 1919 forward. For an earlier birth, contact the county where the birth occurred or the Georgia Archives. A state application is not the right starting point for those older records.",
    },
    {
      question: "How do I correct a Georgia birth certificate?",
      answer: `Use the current-year correction form or the general amendment form that matches the change. Legitimation, paternity, adoption, delayed birth, and out-of-institution birth records use separate processes. Review the forms linked from the [birth-record page](${GA_BIRTH_URL}).`,
    },
    {
      question: "How does an adult adoptee get an original Georgia birth certificate?",
      answer: `Under Andee's Law, a person 18 or older who was born in Georgia may request an uncertified copy of the original pre-adoption birth certificate through ROVER. County offices cannot issue that record. See the [official FAQ](${GA_ADOPTION_URL}).`,
    },
    {
      question: "How do I get an apostille for a Georgia birth certificate?",
      answer: `First obtain an official certified Georgia birth certificate with the required signature and seal, then submit it to the Georgia Superior Court Clerks' Cooperative Authority. Review the [GSCCCA apostille instructions](${GA_APOSTILLE_URL}). The Secretary of State handles Great Seal authentication for non-Hague countries, not apostilles.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Georgia Department of Public Health – Birth records", href: GA_BIRTH_URL },
    { label: "Georgia.gov – Order a birth or death certificate", href: GA_ORDER_URL },
    {
      label: "Georgia.gov – Birth certificate information and eligibility",
      href: GA_ID_URL,
    },
    { label: "Georgia Department of Public Health – Office locations", href: GA_OFFICES_URL },
    {
      label: "Georgia Department of Public Health – Andee's Law FAQ",
      href: GA_ADOPTION_URL,
    },
    {
      label: "Georgia Superior Court Clerks' Cooperative Authority – Apostilles",
      href: GA_APOSTILLE_URL,
    },
    { label: "Georgia Department of Public Health – About Vital Records", href: GA_ABOUT_URL },
    { label: "Georgia.gov – FAQs about certificates", href: GA_FAQ_URL },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Georgia Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

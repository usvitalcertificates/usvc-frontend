import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const IL_BIRTH_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records/birth-records/obtain-birth-certificate.html";
const IL_BIRTH_RECORDS_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records/birth-records.html";
const IL_ID_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records/valid-government-issued-photo-id.html";
const IL_CORRECTIONS_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records/birth-records/correct-birth-certificate.html";
const IL_ADOPTION_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records/adoption.html";
const IL_ARCHIVES_URL = "https://www.ilsos.gov/departments/archives/gen-research.html";
const IL_APOSTILLE_URL = "https://www.ilsos.gov/departments/index/apostilles.html";
const IL_RECORDS_HOME_URL =
  "https://dph.illinois.gov/topics-services/birth-death-other-records.html";

export const ILLINOIS_GUIDE: BirthGuideContent = {
  stateName: "Illinois",
  metaTitle: "Illinois Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How Illinois birth certificate requests work: who may order, photo ID or alternatives, county clerks, state mail filing, corrections, and USVC help.",
  subtitle:
    "Confirm that you are entitled to an Illinois birth record, choose the right certified copy, and prepare identification for the state or county process.",
  intro: [
    "Illinois birth records are confidential, not open public records. The Division of Vital Records issues certified copies only to the person named on the record at age 18 or older, a parent shown on the record, or a legal guardian or legal representative with written evidence of that authority.",
    "The state receives requests by regular mail, and the county clerk where the birth occurred may also issue a copy. This guide explains the two certified copy formats, the photo-ID and alternate-document rules, and the separate processes for corrections, new records, adoptions, and apostilles.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Illinois Department of Public Health, Division of Vital Records",
    },
    {
      label: "Record location",
      value: "State records for births from 1916; many earlier births are with county clerks",
    },
    {
      label: "Copy types",
      value: "Two certified formats, both suitable for legal purposes",
    },
    {
      label: "Where to request",
      value:
        "State Division of Vital Records by mail, or the county clerk where the birth occurred",
    },
    {
      label: "Eligibility",
      value: "Person named at 18+, parent on the record, or documented legal representative",
    },
    {
      label: "Best first step",
      value: "Confirm entitlement and prepare acceptable photo ID",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Illinois resource",
      paragraphs: [
        "The Illinois Department of Public Health controls the application, eligibility, identification, and certified-copy rules. Its current pages list the forms, the two certified copy formats, the identification standards, and the county-clerk option.",
        "Use the official pages to confirm requirements before you file. IDPH can change forms and instructions without notice, so this guide should be read with the agency's current guidance.",
      ],
      links: [
        { label: "Open the official Illinois birth-certificate page", href: IL_BIRTH_URL },
        { label: "Review Illinois birth records", href: IL_BIRTH_RECORDS_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who is entitled to an Illinois birth certificate",
      paragraphs: [
        "The person named on the record may request a certified copy at age 18 or older. A parent whose name appears on the record may also request one. A legal guardian or legal representative of the person named on the record may request a copy with written evidence of the guardianship or representation.",
        "Illinois defines a legal representative to include an attorney acting for the person named on the record, an agent authorized by power of attorney, a court-appointed representative, or another agent with the written authorization required by the state. If you are not the person named on the record or a parent shown on it, confirm that your authorization meets the current standard.",
      ],
      bullets: [
        "The person named on the record must be at least 18 when requesting their own certificate.",
        "A parent must be listed on the birth record; raising a child does not by itself create entitlement.",
        "A legal guardian or representative must be able to show written evidence of the authority to act.",
        "The state may return a request unprocessed if the relationship or authorization is not adequately documented.",
      ],
      links: [
        { label: "Read Illinois birth-record entitlement rules", href: IL_BIRTH_RECORDS_URL },
      ],
    },
    {
      id: "copy-types",
      heading: "Choose the right Illinois certified copy",
      paragraphs: [
        "Illinois issues two certified formats, and both are suitable for legal purposes. The application labels the options as a long form and a short form. The long form contains the most available information and is accepted for passports and other government uses; the short form contains basic birth information and may not be accepted by every agency.",
        "The state's order page also describes a certified copy containing information collected at the time of birth, which can vary over the years. Read the current form descriptions and confirm which format the receiving organization will accept before you order.",
      ],
      note: "The state's filing address and application details have changed. Use the address printed on the current IDPH form rather than an older copy.",
      links: [{ label: "Review Illinois certified copy options", href: IL_BIRTH_URL }],
    },
    {
      id: "identification",
      heading: "Prepare acceptable identification",
      paragraphs: [
        "A valid, unexpired, and readable government-issued photo ID is required. A driver's license, state-issued photo ID, or passport qualifies. If a driver's license has an extension sticker on the back, submit a copy of both sides. If the ID expired no more than six months ago, the state also requires one document showing the applicant's name and current address.",
        "If the photo ID expired more than six months ago, or the applicant does not have a valid photo ID, Illinois requires two documents showing the applicant's name. One must show the current address, such as a utility, cellular, or water bill or other current mail. The second must be a medical or car insurance card, car registration, credit-card statement, bank statement, pay stub, public assistance card, voter registration card, or active-duty military ID with issue and expiration dates.",
        "A Matrícula Consular card issued after October 2006 and not expired is acceptable on its own. An older card requires an additional current-address document. Social Security cards are not accepted as identification. Incarcerated applicants can use a dated prison intake or offender summary with a photo; a recently released applicant can use release papers with a prison photo ID.",
      ],
      links: [{ label: "Review Illinois photo ID rules", href: IL_ID_URL }],
    },
    {
      id: "state-or-county",
      heading: "State Division of Vital Records or county clerk?",
      paragraphs: [
        "IDPH receives state-level requests by regular mail at the address on its current application. The county clerk where the birth occurred may also issue a birth certificate, and may offer different service options. Contact the county clerk directly for that office's current process.",
        "For births before 1916, the Illinois State Archives explains that most records were kept only by county clerks, with state and county records maintained jointly beginning in 1916. Start with the county where the birth occurred if the state cannot locate an early record.",
      ],
      bullets: [
        "Use IDPH for state-level mail requests and records from 1916 forward.",
        "Use the county clerk where the birth occurred for a local option or an early record.",
        "If the birth occurred outside Illinois, request the certificate from that state or country.",
        "Foreign-born children re-adopted in Illinois may need a Record of Foreign Birth rather than a standard birth certificate.",
      ],
      links: [
        { label: "Check Illinois state ordering instructions", href: IL_BIRTH_URL },
        { label: "Review early Illinois birth records", href: IL_ARCHIVES_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Match the record details to the birth certificate rather than to a married name, a nickname, or a later identity document. An error in the mother's maiden name or the city of birth can cause the request to fail.",
      ],
      bullets: [
        "The full name as it appears on the birth record.",
        "Date of birth and the city or county of birth.",
        "The mother's or co-parent's maiden name as shown on the record.",
        "The father's or co-parent's name as shown on the record.",
        "Your relationship to the person named on the record and the intended use of the certificate.",
        "A readable copy of acceptable photo ID or the alternate documents.",
        "Any guardianship, power-of-attorney, court, or written-authorization documents that support your request.",
      ],
    },
    {
      id: "process",
      heading: "How an Illinois request usually works",
      bullets: [
        "Confirm that you are entitled to the record and identify whether the state or a county clerk holds it.",
        "Choose the long form or short form based on what the receiving organization accepts.",
        "Complete the current Application for Illinois Birth Record or the county clerk's form.",
        "Include a readable copy of acceptable identification and any supporting authorization.",
        "Sign the application and provide the payment method the state or county office accepts.",
        "Mail the state request to the address on the current IDPH form, or file with the county clerk.",
        "Keep a copy of the application and identification, then check the certificate for accuracy when it arrives.",
      ],
      note: "Requests that are incomplete, use expired ID, or lack evidence of entitlement may be returned without processing.",
    },
    {
      id: "corrections-new-records",
      heading: "Corrections and new Illinois birth records",
      paragraphs: [
        "A correction is separate from ordering a copy. Illinois requires an Affidavit and Certificate of Correction Request and documentary evidence that supports the change. The state generally looks for records created before age 19 that show the date of birth and the name as it should appear. A court order may be required when the documents do not clearly prove the change.",
        "Illinois can create a new birth certificate after legitimation, a paternity determination, gender reassignment, or adoption. Those processes use different forms and evidence from a standard correction.",
      ],
      bullets: [
        "Use the correction form for incorrect or missing information on an existing record.",
        "Use the parentage or legitimation process when the legal parent needs to change.",
        "Use the gender-reassignment process for a new record based on the required documentation or court order.",
        "Use the adoption process for a new certificate after an adoption; do not file a standard correction.",
      ],
      links: [
        { label: "Review Illinois birth-certificate corrections", href: IL_CORRECTIONS_URL },
        { label: "Read Illinois adoption-record guidance", href: IL_ADOPTION_URL },
      ],
    },
    {
      id: "adoption",
      heading: "Adoption and original birth records",
      paragraphs: [
        "Illinois is a closed state for adoptions. After an adoption, the original birth record and associated documents are sealed, and IDPH can create a new birth record for the adopted person based on the certified adoption documents.",
        "An adult adoptee or surrendered person born in Illinois who is at least 21 may request a non-certified copy of the original birth record under the state's current adoption law. Birth parents have separate request rights. These requests use adoption-specific forms and are not the same as ordering a certified birth certificate.",
      ],
      links: [{ label: "Review Illinois adoption records", href: IL_ADOPTION_URL }],
    },
    {
      id: "apostille",
      heading: "Using an Illinois certificate outside the United States",
      paragraphs: [
        "An apostille or authentication is issued by the Illinois Secretary of State, not by IDPH. The birth certificate must be a certified copy issued by the custodian of the record, such as the county clerk or the state Division of Vital Records.",
        "Follow the Secretary of State's current instructions for the destination country, submission method, and payment. An apostille is for international use and is not issued for documents used only within the United States.",
      ],
      links: [{ label: "Review Illinois apostille instructions", href: IL_APOSTILLE_URL }],
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
      question: "Where do I find the official Illinois birth certificate requirements?",
      answer: `Use the [official Illinois birth-certificate page](${IL_BIRTH_URL}). It is the source of truth for current forms, eligibility, identification, fees, mailing instructions, and agency changes.`,
    },
    {
      question: "Who can get an Illinois birth certificate?",
      answer: `The person named on the record at age 18 or older, a parent shown on the record, or a legal guardian or legal representative with written evidence of that authority. Illinois birth records are not open to the general public. See [Illinois birth records](${IL_BIRTH_RECORDS_URL}).`,
    },
    {
      question: "What is the difference between the long form and short form?",
      answer: `The long form contains the most available information and is accepted for passports and other government uses. The short form contains basic birth information and may not be accepted by every agency. Both are certified. Confirm the format with the organization receiving the certificate. See [Illinois copy options](${IL_BIRTH_URL}).`,
    },
    {
      question: "What identification does Illinois accept?",
      answer: `A valid, unexpired government photo ID such as a driver's license, state photo ID, or passport. If the ID expired within six months, add one document showing your name and current address. If you have no valid photo ID or it expired more than six months ago, use two documents under the state's alternate-ID rules. See [Illinois photo ID requirements](${IL_ID_URL}).`,
    },
    {
      question: "Is a Social Security card acceptable as ID?",
      answer:
        "No. Illinois specifically says Social Security cards are not acceptable identification. Use a government photo ID or the alternate documents listed by the state.",
    },
    {
      question: "Can I request an Illinois birth certificate from a county clerk?",
      answer: `Yes. You may contact the county clerk where the birth occurred. IDPH handles state-level requests by regular mail, while county clerks may offer their own service options. Use the [state ordering page](${IL_BIRTH_URL}) and contact the county clerk for current local details.`,
    },
    {
      question: "What if the birth happened before 1916?",
      answer: `Start with the county clerk where the birth occurred. The [Illinois State Archives](${IL_ARCHIVES_URL}) explains that most early births were recorded only by county clerks, and state and county records were maintained jointly beginning in 1916.`,
    },
    {
      question: "What if the birth happened outside Illinois?",
      answer:
        "Illinois can only issue records for births that occurred in Illinois. Request the certificate from the state or country where the birth happened.",
    },
    {
      question: "How do I correct an Illinois birth certificate?",
      answer: `Use the Affidavit and Certificate of Correction Request and supporting documents that prove the change. A new record after legitimation, paternity, gender reassignment, or adoption uses a different process. Review [Illinois correction guidance](${IL_CORRECTIONS_URL}) before filing.`,
    },
    {
      question: "How do I get an apostille for an Illinois birth certificate?",
      answer: `Obtain a certified copy from IDPH or the county clerk, then follow the [Illinois Secretary of State apostille instructions](${IL_APOSTILLE_URL}). The Secretary of State handles the apostille; the vital-records office handles the certificate.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    {
      label: "Illinois Department of Public Health – Obtain a birth certificate",
      href: IL_BIRTH_URL,
    },
    { label: "Illinois Department of Public Health – Birth records", href: IL_BIRTH_RECORDS_URL },
    {
      label: "Illinois Department of Public Health – Valid government photo ID",
      href: IL_ID_URL,
    },
    {
      label: "Illinois Department of Public Health – Correct a birth certificate",
      href: IL_CORRECTIONS_URL,
    },
    { label: "Illinois Department of Public Health – Adoption", href: IL_ADOPTION_URL },
    {
      label: "Illinois Secretary of State Archives – Birth records",
      href: IL_ARCHIVES_URL,
    },
    {
      label: "Illinois Secretary of State – Apostilles",
      href: IL_APOSTILLE_URL,
    },
    {
      label: "Illinois Department of Public Health – Birth, death, and other records",
      href: IL_RECORDS_HOME_URL,
    },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Illinois Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

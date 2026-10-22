import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const MI_ORDER_URL =
  "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-a-copy-of-a-vital-record";
const MI_MAIL_URL = "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-by-mail";
const MI_ONLINE_URL =
  "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/order-a-record-online";
const MI_CORRECT_URL =
  "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/correct-change-a-vital-record-and-legal-name-change";
const MI_ADOPTION_URL =
  "https://www.michigan.gov/mdhhs/faq/adoption/can-the-adult-adoptee-obtain-a-copy-of-the-original-birth-certificate";
const MI_APOSTILLE_URL =
  "https://www.michigan.gov/sos/all-services/document-authentication-and-apostille";
const MI_AUTH_URL =
  "https://www.michigan.gov/mdhhs/doing-business/vitalrecords/eligibility/authenticated-copy/authenticated-copies";
const MI_VITAL_URL = "https://www.michigan.gov/mdhhs/doing-business/vitalrecords";

export const MICHIGAN_GUIDE: BirthGuideContent = {
  stateName: "Michigan",
  metaTitle: "Michigan Birth Certificate Guide: Eligibility and ID",
  metaDescription:
    "How Michigan birth certificate requests work: who may order, photo ID tiers, online, mail, county, corrections, USVC help.",
  subtitle:
    "Confirm who may receive a Michigan birth record, prepare the right identification, and choose a state, county, mail, or online path.",
  intro: [
    "Michigan birth records less than 100 years old are restricted. The Department of Health and Human Services issues certified copies to the person named on the record, parents named on the record, legal heirs, court-appointed guardians, qualifying powers of attorney, and licensed attorneys representing an eligible person.",
    "This guide explains the eligibility rules, Michigan's tiered ID requirements, state and county filing, corrections, adoption records, and authenticated copies for international use. The official MDHHS pages control the current application requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Michigan Department of Health and Human Services, Vital Records",
    },
    {
      label: "Record location",
      value: "State records from 1867; the first registered year varies by county",
    },
    {
      label: "Copy type",
      value: "Certified copy on safety paper with a raised, embossed seal",
    },
    {
      label: "Where to request",
      value: "State office, county clerk, mail, phone, online, drop box, or appointment",
    },
    {
      label: "Eligibility",
      value: "Subject, named parent, heir, guardian, qualifying power of attorney, or attorney",
    },
    {
      label: "Record access",
      value: "Records under 100 years are restricted; records 100 years or older are open",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Michigan resource",
      paragraphs: [
        "The Michigan Department of Health and Human Services controls the application, eligibility, identification, and payment rules. Its vital-records pages explain the current online, mail, phone, drop-box, appointment, and Will Call options.",
        "Use the official pages to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official Michigan vital-records page", href: MI_VITAL_URL },
        { label: "Review Michigan ordering options", href: MI_ORDER_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Michigan birth certificate",
      paragraphs: [
        "Michigan restricts birth records less than 100 years old. Eligible applicants include the person who is the subject of the record, parents named on the record, a legal heir, a court-appointed guardian, a power of attorney whose document specifically grants access to vital records, and a licensed attorney representing the subject or a named parent.",
        "Records 100 years or older are no longer restricted, so anyone may request them. The application must still identify the record and the requester.",
      ],
      bullets: [
        "The person named on the record may request their own certificate.",
        "A parent must be named on the birth record.",
        "A legal heir must provide the death information or death certificate required by the state.",
        "A guardian must provide the court order appointing the guardian.",
        "A power of attorney must specifically authorize access to vital records.",
        "A licensed attorney must represent the subject or a parent named on the record and provide the required documentation.",
        "A spouse cannot order the other spouse's record; each spouse must place a separate request.",
        "Records 100 years or older may be requested by anyone.",
      ],
      links: [{ label: "Review Michigan birth-record eligibility", href: MI_MAIL_URL }],
    },
    {
      id: "identification",
      heading: "Prepare identification under Michigan's tiers",
      paragraphs: [
        "Michigan requires identification from the person requesting a restricted birth record. The state uses a tiered list: a primary document that establishes identity by itself, a secondary combination when the primary ID is expired or unavailable, or a set of supporting documents when neither of the first two routes is available.",
        "Common primary IDs include a current or recently expired U.S. or foreign passport, U.S. passport card, U.S. or U.S. territory driver's license or state ID, and U.S. military ID. Another U.S. or U.S. territory photo document can qualify when it includes the required name, date of birth, signature, address, and expiration information.",
        "If you do not have a primary ID, use the combination shown on the state's acceptable-ID page. Secondary and supporting documents can include an employment or student ID with current proof, a Department of Corrections ID with release or incarceration verification, a Social Security or Medicare card, a marriage or divorce record, a child's birth certificate, a W-2 or pay stub, a bank statement, a voter registration, a vehicle registration or title, a health insurance card, a utility or medical bill, or other identity records the state accepts.",
      ],
      bullets: [
        "Send photocopies of identification; original documents are not returned.",
        "The name and identifying details should be consistent across the application and documents.",
        "A legal representative, guardian, power of attorney, or heir must include the authorization or relationship documents required for that role.",
        "An heir request for a restricted record must be filed by mail.",
        "A current valid driver's license, state-issued photo ID, or passport is the simplest primary route when available.",
      ],
      links: [{ label: "Review Michigan ID and mail requirements", href: MI_MAIL_URL }],
    },
    {
      id: "where-to-file",
      heading: "State office, county clerk, mail, or online",
      paragraphs: [
        "The state Vital Records office is in Lansing and accepts mail, online orders, phone orders, a drop box, scheduled in-person appointments, and Will Call pickup for eligible online orders. County clerks can also issue birth records for births in their counties, although local services and procedures vary.",
        "VitalChek is Michigan's only authorized online service provider. Online and phone orders are limited to a person requesting their own record or their child's record; heirs, powers of attorney, guardians, and attorneys generally must use the mail process with documentation.",
        "The state has records from 1867, but the first year of registration varies by county and some early births were never filed with the state. If a record cannot be found, check with the county of birth or the state's genealogy guidance.",
      ],
      bullets: [
        "State office: use the current application and the state's mail, drop-box, appointment, or Will Call instructions.",
        "County clerk: contact the clerk in the county where the birth occurred for local availability.",
        "Online or phone: use VitalChek through the official MDHHS page.",
        "Restricted heir, guardian, power of attorney, and attorney requests may require mail filing.",
        "Older records: confirm whether the birth was registered with the state or only with the county.",
      ],
      links: [
        { label: "Review Michigan ordering channels", href: MI_ORDER_URL },
        { label: "Review Michigan online and phone ordering", href: MI_ONLINE_URL },
        { label: "Review Michigan mail applications", href: MI_MAIL_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Use the details exactly as they appear on the birth record. A misspelled name, an unknown county, or a parent's married name used instead of the name on the record can delay the search.",
      ],
      bullets: [
        "The person's full name at birth, including any suffix.",
        "Date of birth and the city or county of birth in Michigan.",
        "The birth parent's name as shown on the record.",
        "The father's or other parent's name as shown on the record, if listed.",
        "Your relationship to the person named on the record.",
        "A primary photo ID or the alternate combination shown on the state ID page.",
        "Any guardianship, power of attorney, attorney representation, or heir documentation required for your role.",
        "A deliverable mailing address and the payment method accepted by the channel you choose.",
      ],
    },
    {
      id: "process",
      heading: "How a Michigan request usually works",
      bullets: [
        "Confirm that the birth occurred in Michigan and that you are eligible for the record.",
        "Choose the state office, a county clerk, or an authorized online or phone order.",
        "Prepare the required identification or alternate document combination.",
        "Gather any relationship, guardianship, power of attorney, or attorney documentation.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit the application, identification, supporting documents, and payment through the channel you selected.",
        "Keep the confirmation and any order reference so you can follow up.",
      ],
      note: "A correction or adoption change is a separate process from ordering a copy. Confirm which process applies before you file.",
    },
    {
      id: "corrections",
      heading: "Corrections, amendments, and legal name changes",
      paragraphs: [
        "Michigan handles corrections and changes through a separate application process. The appropriate form depends on the field being changed, and the state may require supporting records, a certified court order, or a completed affidavit.",
        "A court-ordered legal name change does not automatically change a birth certificate. The certified court order must be submitted with the vital-record application. Requests for a change to a marriage or divorce record go to the county clerk where the license was issued or the divorce was granted.",
      ],
      bullets: [
        "Select the form that matches the correction or change you need.",
        "Include the identification and supporting documents listed on that application.",
        "Court orders must be certified by the court.",
        "Follow the form's execution instructions for signatures and affidavits.",
        "Mail the completed application and documents to the address on the form.",
        "Do not use a standard certificate order when the record itself needs to be changed.",
      ],
      links: [
        { label: "Review Michigan correction and change instructions", href: MI_CORRECT_URL },
      ],
    },
    {
      id: "adoption",
      heading: "Adoption records and original birth certificates",
      paragraphs: [
        "When a Michigan adoption is finalized, the original birth certificate is sealed and an amended certificate is issued in the adoptive name. The court or adoption agency generally provides the amended certificate; if it was not provided, contact the court or agency that handled the adoption.",
        "An adult adoptee may request the original certificate only under the state's year-based rules. For parental rights terminated before May 28, 1945 or on or after September 12, 1980, the original may be released if no denial statement is on file with the Central Adoption Registry. For the period between those dates, a court order is required.",
        "If an adult adoptee needs the court that finalized the adoption, Vital Records can provide that information with a birth application, identification, and the required payment. Adoption records are held by the court and the placing agency, not in one central file.",
      ],
      bullets: [
        "The amended certificate is the current record in the adoptive name.",
        "Original-certificate release depends on when parental rights were terminated.",
        "A denial statement in the Central Adoption Registry can prevent release.",
        "A court order is required for the middle period between the state's two dates.",
        "Requests for identifying adoption information may need to go to the court or agency that holds the record.",
      ],
      links: [
        { label: "Review Michigan adult-adoptee original-record rules", href: MI_ADOPTION_URL },
      ],
    },
    {
      id: "apostille",
      heading: "Using a Michigan certificate outside the United States",
      paragraphs: [
        "For a Michigan birth certificate that will be used in another country, order an authenticated or exemplified birth record from MDHHS. That product includes the state's authentication and is the record foreign governments generally expect.",
        "You must provide the name of the foreign country where the record will be used. An apostille is not issued for use in the United States and is not required for foreign travel. The Secretary of State's Office of the Great Seal issues apostilles and certificates of authority, but the birth record itself must first be a certified copy from the state registrar or an authorized county or city clerk.",
      ],
      bullets: [
        "Order the authenticated or exemplified birth record, not a standard certificate, when the destination requires an apostille.",
        "Name the foreign country on the application.",
        "An apostille is for international use, not for use inside the United States.",
        "If you already have a certified copy, confirm with the Office of the Great Seal whether it can authenticate that document.",
      ],
      links: [
        { label: "Review Michigan authenticated birth records", href: MI_AUTH_URL },
        {
          label: "Review Michigan document authentication and apostilles",
          href: MI_APOSTILLE_URL,
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
      question: "Where do I find the official Michigan birth certificate requirements?",
      answer: `Use the [Michigan Vital Records page](${MI_VITAL_URL}) and the [ordering page](${MI_ORDER_URL}). They are the source of truth for current application options, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Are Michigan birth certificates public records?",
      answer:
        "Birth records less than 100 years old are restricted in Michigan. Records 100 years or older are not restricted. Review the [eligibility rules](" +
        MI_MAIL_URL +
        ") for who may request a restricted record.",
    },
    {
      question: "Who can request a Michigan birth certificate?",
      answer: `The person named on the record, a parent named on the record, a legal heir, a court-appointed guardian, a power of attorney with specific vital-records authorization, or a licensed attorney representing an eligible person. See [Michigan eligibility details](${MI_MAIL_URL}).`,
    },
    {
      question: "Can a spouse order a Michigan birth certificate for their spouse?",
      answer:
        "Michigan law does not allow one spouse to order the other spouse's birth record. Each spouse must place a separate request for their own record. Use the official ordering page to choose the correct route.",
    },
    {
      question: "What identification does Michigan require?",
      answer: `Michigan uses a tiered ID list. A current or recently expired passport, driver's license, state ID, military ID, or similar primary document is the simplest route. Without a primary ID, use the secondary or supporting combination on the [state ID page](${MI_MAIL_URL}).`,
    },
    {
      question: "Can I order a Michigan birth certificate online?",
      answer: `Yes, through VitalChek, Michigan's only authorized online provider. Online ordering is limited to your own record or your child's record. Start from the [official MDHHS page](${MI_ONLINE_URL}) so you use the correct service.`,
    },
    {
      question: "Can I request a Michigan birth certificate from a county clerk?",
      answer:
        "County clerks can issue birth records for births in their counties, but local services vary. Contact the clerk in the county where the birth occurred, or use the state ordering page to compare the state and local options.",
    },
    {
      question: "How do I correct a Michigan birth certificate?",
      answer: `Use the correction or change form that matches the field you need to update, include the required identification and evidence, and mail it to the address on the form. A legal name change requires a certified court order. Review [Michigan correction instructions](${MI_CORRECT_URL}).`,
    },
    {
      question: "How does an adult adoptee get an original Michigan birth certificate?",
      answer: `The original certificate may be released if parental rights were terminated before May 28, 1945 or on or after September 12, 1980 and no denial statement is on file. For the period between those dates, a court order is required. Review the [state FAQ](${MI_ADOPTION_URL}).`,
    },
    {
      question: "How do I get an apostille for a Michigan birth certificate?",
      answer: `Order an authenticated or exemplified birth record from MDHHS and name the foreign country where it will be used. The [authenticated-records page](${MI_AUTH_URL}) explains the product, and the [Secretary of State page](${MI_APOSTILLE_URL}) explains apostille authentication. An apostille is not for use inside the United States.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    {
      label: "Michigan Department of Health and Human Services – Vital Records",
      href: MI_VITAL_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Order a vital record",
      href: MI_ORDER_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Order by mail",
      href: MI_MAIL_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Order online",
      href: MI_ONLINE_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Correct or change a record",
      href: MI_CORRECT_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Adult adoptee original record",
      href: MI_ADOPTION_URL,
    },
    {
      label: "Michigan Department of Health and Human Services – Authenticated copies",
      href: MI_AUTH_URL,
    },
    {
      label: "Michigan Secretary of State – Document authentication and apostille",
      href: MI_APOSTILLE_URL,
    },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Michigan Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

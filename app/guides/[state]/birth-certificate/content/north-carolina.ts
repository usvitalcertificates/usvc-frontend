import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const NC_ORDER_URL = "https://vitalrecords.nc.gov/order.htm";
const NC_FAQ_URL = "https://vitalrecords.nc.gov/faqs.htm";
const NC_CHANGE_URL = "https://vitalrecords.nc.gov/change.htm";
const NC_ADOPTION_URL = "https://vitalrecords.nc.gov/adoptions.htm";
const NC_RESEARCH_URL = "https://vitalrecords.nc.gov/research.htm";
const NC_APOSTILLE_URL = "https://www.sosnc.gov/divisions/authentications/Apostille_Certificates";
const NC_COUNTY_URL = "https://www.ncard.us/find-your-register-of-deeds/";
const NC_HOME_URL = "https://vitalrecords.nc.gov/";

export const NORTH_CAROLINA_GUIDE: BirthGuideContent = {
  stateName: "North Carolina",
  metaTitle: "North Carolina Birth Certificate Guide: ID and Ordering",
  metaDescription:
    "How North Carolina birth certificate requests work: who may order, photo ID or alternatives, state, county, corrections, USVC help.",
  subtitle:
    "Confirm who may receive a North Carolina birth record, prepare identity and relationship proof, and choose the right state or county office.",
  intro: [
    "North Carolina birth certificates are confidential records, not searchable public records. The Office of Vital Records issues state certificates, while the Register of Deeds in the county where the birth occurred can also provide certified copies.",
    "This guide explains the eligibility list, the state's identity-verification rules, state and county filing, corrections, adoption records, and apostilles. The official North Carolina Vital Records pages control the current application requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "North Carolina Department of Health and Human Services, Office of Vital Records",
    },
    {
      label: "Record location",
      value: "State Office from October 1913; earlier births are county records",
    },
    {
      label: "Copy type",
      value: "Certified copy with the State Registrar's signature and raised seal",
    },
    {
      label: "Where to request",
      value: "State office, county Register of Deeds, or the authorized online vendor",
    },
    {
      label: "Eligibility",
      value:
        "Registrant, spouse, sibling, direct ancestor or descendant, step-relative, or legal representative",
    },
    {
      label: "Identification",
      value: "One primary photo ID or two different alternate documents",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official North Carolina resource",
      paragraphs: [
        "The North Carolina Office of Vital Records controls the application, identification, entitlement, and payment rules. Its ordering page explains state, county, mail, phone, and online options, and its FAQ answers common eligibility and ID questions.",
        "Use the official pages to confirm current fees, delivery choices, and any special instructions before you file. Those details can change, so this guide does not replace the agency's requirements.",
      ],
      links: [
        { label: "Open the official North Carolina ordering page", href: NC_ORDER_URL },
        { label: "Review North Carolina Vital Records FAQs", href: NC_FAQ_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a North Carolina birth certificate",
      paragraphs: [
        "North Carolina law limits certified copies to specific people. The registrant may request their own record, and a spouse, sibling, direct ancestor, direct descendant, stepparent, or stepchild may also request. A person seeking the record for a legal determination involving personal or property rights may qualify, as may an authorized agent, attorney, or legal representative of an eligible person.",
        "Proof of identity and proof of eligibility are both required. The application must show the relationship, and the state may ask for supporting records before issuing the certificate.",
      ],
      bullets: [
        "The registrant can request their own birth certificate.",
        "A spouse, sibling, stepparent, or stepchild must document the relationship.",
        "A direct ancestor or direct descendant includes a parent, grandparent, child, or grandchild in the direct line.",
        "An authorized agent, attorney, or legal representative must provide proof of authority.",
        "A person requesting for a legal determination must show the legal need for the record.",
        "An adopted person's certificate has additional access rules; the adoption process is separate.",
      ],
      links: [{ label: "Review North Carolina entitlement rules", href: NC_FAQ_URL }],
    },
    {
      id: "identification",
      heading: "Prepare primary photo ID or two alternate documents",
      paragraphs: [
        "North Carolina requires identification from the person requesting the certificate. A request without acceptable identification is returned. The state also uses the address on the application to match the address on the identification.",
        "Acceptable primary photo IDs include a current state-issued driver's license or non-driver ID, a current passport or visa with photo, a current U.S. military ID, a current Department of Corrections photo ID dated within the last year, a current government agency photo ID used for agency business, or a current student ID with a transcript.",
        "If you do not have a primary photo ID, the state accepts two different alternate documents. Examples include a temporary driver's license, a current utility bill, vehicle registration or title, a bank statement, a pay stub, an income tax return or W-2, a recent government letter, or a concealed-weapon permit showing the current address. The documents must meet the current requirements on the state page.",
      ],
      bullets: [
        "The name on the application must match the identification.",
        "The address on the application must match the address on the identification.",
        "If your name changed, provide a certified marriage record, divorce decree, or court order linking the names.",
        "A parent, relative, or other eligible person who can meet the ID rules may request the certificate if you cannot.",
        "Do not send an application without the required identification copy.",
      ],
      links: [{ label: "Review North Carolina ID requirements", href: NC_FAQ_URL }],
    },
    {
      id: "where-to-file",
      heading: "State office, county Register of Deeds, or online",
      paragraphs: [
        "The state Office of Vital Records holds birth certificates from October 1913 to the present. The Register of Deeds in the county where the birth occurred can also issue a certified copy. County offices may be the better choice when you need local service or want to confirm the record in the county of birth.",
        "Online state-issued certificate orders go through VitalChek, which North Carolina identifies as its only authorized vendor. The state ordering page also lists a mail-order application processed through VitalChek, plus in-person service by appointment. County Register of Deeds offices set their own hours and local procedures.",
        "For a birth before October 1913, contact the Register of Deeds in the county where the birth occurred. Do not send that request to the state Office of Vital Records.",
      ],
      bullets: [
        "State office: use the current application and the state's online, mail, phone, or appointment instructions.",
        "County Register of Deeds: use the office in the county where the birth occurred.",
        "Online: use VitalChek through the link on the official state ordering page.",
        "Pre-1913 births: contact the county Register of Deeds, not the state office.",
      ],
      links: [
        { label: "Review North Carolina ordering options", href: NC_ORDER_URL },
        { label: "Find a North Carolina Register of Deeds", href: NC_COUNTY_URL },
        { label: "Review North Carolina record availability", href: NC_RESEARCH_URL },
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
        "Date of birth and the city or county of birth in North Carolina.",
        "Both parents' full names as shown on the record.",
        "Your relationship to the person named on the certificate.",
        "One primary photo ID or two different alternate documents.",
        "Any marriage, divorce, or name-change record needed to connect your current name to the relationship.",
        "A street delivery address; the state does not deliver to a P.O. box for expedited shipping.",
      ],
    },
    {
      id: "process",
      heading: "How a North Carolina request usually works",
      bullets: [
        "Confirm that the birth occurred in North Carolina and that you are entitled to a certified copy.",
        "Choose the state office, the county Register of Deeds, or the authorized online vendor.",
        "Prepare one primary photo ID or two different alternate documents.",
        "Gather the relationship or legal-interest records needed for your request.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit the application, identification, supporting records, and payment through the channel you selected.",
        "Keep the confirmation and any order reference so you can follow up.",
      ],
      note: "A correction or adoption change is a separate process from ordering a copy. Confirm which process applies before you file.",
    },
    {
      id: "corrections",
      heading: "Corrections, amendments, and legal changes",
      paragraphs: [
        "After a birth certificate is accepted for registration, North Carolina requires a formal modification request to change it. Requests can be started through the state's birth-amendment portal, at some county Register of Deeds offices, or by mail when certified court orders or legitimation documents must be reviewed.",
        "The modification application requires identity documents and evidence supporting the change. If the field was already modified before, the state may require a court order. The state's change page lists the current process for each type of amendment.",
      ],
      bullets: [
        "Use the birth-amendment portal for eligible electronic modification requests.",
        "Use the county Register of Deeds where the birth occurred when that office accepts the request.",
        "Use the mail process for court-ordered name changes, legitimation, and requests that require inspection of certified documents.",
        "Use the separate paternity process for an affidavit of parentage, paternity judgment, or disestablishment.",
        "Follow the current form for the required identity, evidence, and signature steps.",
      ],
      links: [{ label: "Review North Carolina change and amendment options", href: NC_CHANGE_URL }],
    },
    {
      id: "adoption",
      heading: "Adoption records and new birth certificates",
      paragraphs: [
        "An adoption changes the birth record through a separate process. North Carolina does not use the standard certificate order or VitalChek for a new adoption certificate. The court, the Division of Social Services, and the Office of Vital Records coordinate the creation of the new certificate.",
        "For an in-state adoption, the Clerk of Superior Court sends the adoption order to the state, and the adoptive parents later use the adoption processing form to request the new certificate. For an out-of-state adoption, the adoptive parents or their attorney must send the certified court order with the state adoption form. Original pre-adoption certificates are sealed and available only by court order.",
      ],
      bullets: [
        "Do not order a new adoption certificate through VitalChek.",
        "Use the adoption processing form and the instructions on the state adoption page.",
        "An out-of-state adoption requires a certified court order with the court seal.",
        "Additional copies of the new certificate are ordered separately after the modification is complete.",
        "An original pre-adoption certificate requires a court order to unseal.",
      ],
      links: [{ label: "Review North Carolina adoption processing", href: NC_ADOPTION_URL }],
    },
    {
      id: "apostille",
      heading: "Using a North Carolina certificate outside the United States",
      paragraphs: [
        "The North Carolina Secretary of State issues apostilles for certified North Carolina public documents used in Hague Convention countries. A birth certificate must be a certified copy from North Carolina Vital Records or a county Register of Deeds.",
        "Submit the original certified document with the Secretary of State's current cover letter, payment, and return materials. If the destination country is not in the Hague Convention, the Secretary of State's authentication process applies instead and may require federal authentication afterward.",
      ],
      links: [{ label: "Review North Carolina apostille instructions", href: NC_APOSTILLE_URL }],
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
      question: "Where do I find the official North Carolina birth certificate requirements?",
      answer: `Use the [North Carolina Vital Records ordering page](${NC_ORDER_URL}) and [FAQs](${NC_FAQ_URL}). They are the source of truth for current application options, eligibility, identification, fees, and agency instructions.`,
    },
    {
      question: "Are North Carolina birth certificates public records?",
      answer:
        "No. North Carolina Vital Records says they are not free, searchable public records, and certified copies are limited to the people listed in state law. Review the [entitlement rules](" +
        NC_FAQ_URL +
        ").",
    },
    {
      question: "Who can request a North Carolina birth certificate?",
      answer: `The registrant, a spouse, sibling, direct ancestor, direct descendant, stepparent, or stepchild may request. A person with a legal need or an authorized agent, attorney, or legal representative may also qualify. See [North Carolina's eligibility FAQ](${NC_FAQ_URL}).`,
    },
    {
      question: "What identification does North Carolina require?",
      answer: `One current primary photo ID, such as a driver's license, state ID, passport, military ID, or qualifying government or student ID. Without a primary ID, provide two different alternate documents. The name and address must match the application. Review the [ID list](${NC_FAQ_URL}).`,
    },
    {
      question: "Can I order a North Carolina birth certificate online?",
      answer: `Yes. VitalChek is the only authorized vendor for a state-issued certified birth certificate. Start from the [official ordering page](${NC_ORDER_URL}) so you use the correct service and see the current fees.`,
    },
    {
      question: "Can I request the certificate from a county office?",
      answer: `Yes. The Register of Deeds in the county where the birth occurred can issue certified copies. Use the [county directory](${NC_COUNTY_URL}) to find the office and confirm its local services.`,
    },
    {
      question: "What if the birth occurred before October 1913?",
      answer:
        "Contact the Register of Deeds in the county where the birth occurred. North Carolina Vital Records holds certificates from October 1913 forward. The state research page explains where earlier records are held.",
    },
    {
      question: "How do I correct a North Carolina birth certificate?",
      answer: `Use the state's birth-amendment portal, a participating county Register of Deeds, or the mail process for court orders and legitimation. The [change page](${NC_CHANGE_URL}) explains each route and the evidence required.`,
    },
    {
      question: "How do I get a birth certificate after an adoption?",
      answer: `Use the [adoption process](${NC_ADOPTION_URL}) and its adoption processing form. Do not order a new adoption certificate through VitalChek. An out-of-state adoption requires a certified court order. Original pre-adoption certificates are sealed and require a court order.`,
    },
    {
      question: "How do I get an apostille for a North Carolina birth certificate?",
      answer: `Obtain a certified North Carolina birth certificate, then follow the [Secretary of State apostille instructions](${NC_APOSTILLE_URL}). Non-Hague destinations use the authentication process instead and may require federal authentication afterward.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "North Carolina Vital Records – Order a certificate", href: NC_ORDER_URL },
    { label: "North Carolina Vital Records – FAQs", href: NC_FAQ_URL },
    { label: "North Carolina Vital Records – Change a record", href: NC_CHANGE_URL },
    { label: "North Carolina Vital Records – Adoptions", href: NC_ADOPTION_URL },
    { label: "North Carolina Vital Records – Research", href: NC_RESEARCH_URL },
    {
      label: "North Carolina Secretary of State – Apostille certificates",
      href: NC_APOSTILLE_URL,
    },
    { label: "North Carolina Association of Registers of Deeds – Directory", href: NC_COUNTY_URL },
    { label: "North Carolina Vital Records", href: NC_HOME_URL },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your North Carolina Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const FLORIDA_BIRTH_URL = "https://www.floridahealth.gov/certificates-records/birth-certificates/";
const FLORIDA_COUNTY_URL =
  "https://www.floridahealth.gov/community-environmental-public-health/community-health/county-health-departments/county-health-department-location-finder/";
const FLORIDA_AMENDMENT_URL =
  "https://www.floridahealth.gov/certificates-records/amendments-and-corrections/";
const FLORIDA_APOSTILLE_URL =
  "https://www.floridahealth.gov/certificates-records/apostille-notarial-certificates/";
const FLORIDA_DOS_APOSTILLE_URL =
  "https://dos.fl.gov/sunbiz/other-services/apostille-notarial-certification/";
const FLORIDA_VITALCHEK_URL = "https://www.floridahealth.gov/certificates-records/vitalchek/";
const CDC_OUTSIDE_URL = "https://www.cdc.gov/nchs/w2w.htm";
const STATE_DEPT_BIRTH_URL =
  "https://travel.state.gov/en/international-travel/living-abroad/birth.html";

export const FLORIDA_GUIDE: BirthGuideContent = {
  stateName: "Florida",
  metaTitle: "Florida Birth Certificate Guide: Eligibility and Ordering",
  metaDescription:
    "How Florida birth certificate requests work: who may order, photo ID, state or county filing, certificate types, corrections, and USVC help.",
  subtitle:
    "Confirm your eligibility, choose the right Florida certificate type, prepare photo identification, and use the official state and county resources.",
  intro: [
    "Florida birth records are confidential for a period set by state law, so the Bureau of Vital Statistics releases them only to eligible requestors. The application path also depends on whether you order from the state or from the county health department where the birth occurred.",
    "This guide explains the eligibility rules, the certificate types, and the preparation steps that matter most. The official Florida Department of Health pages remain the source of truth for current requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value:
        "Florida Department of Health – Bureau of Vital Statistics and county health departments",
    },
    {
      label: "Record location",
      value: "Statewide; the county of birth determines local service",
    },
    {
      label: "Copy types",
      value: "Computer-generated and photocopy birth certificates",
    },
    {
      label: "Where to request",
      value: "State walk-in or mail, county health department, or the state's online vendor",
    },
    {
      label: "Best first step",
      value: "Confirm eligibility and photo-ID requirements on the official page",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Florida resource",
      paragraphs: [
        "The Florida Department of Health controls the application, eligibility, and identification rules. Its official birth-certificate page explains current request channels, certificate types, and the documents the agency accepts. Those details can change without notice on the agency page, which this guide doesn't control.",
        "Read the eligibility section before you gather documents. If you are not an eligible requestor, the state may require a different application path or supporting authorization.",
      ],
      links: [
        { label: "Open the official Florida birth-certificate page", href: FLORIDA_BIRTH_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Florida birth certificate",
      paragraphs: [
        "Florida treats recent birth records as confidential. The Bureau of Vital Statistics may issue a certificate to the registrant if of legal age, a parent listed on the birth record, a legal guardian with guardianship papers, a legal representative of an eligible person with documentation, or a person acting under a court order.",
        "After the registrant's death is recorded, a birth certificate marked deceased may be issued to a spouse, child, grandchild, or sibling if of legal age. The application should note that the registrant is deceased and include a copy of the death certificate.",
      ],
      note: "Eligibility is controlled by Florida law. Confirm your category on the official page before submitting, especially if you are ordering for another adult.",
      links: [{ label: "Review Florida eligibility and ordering rules", href: FLORIDA_BIRTH_URL }],
    },
    {
      id: "certificate-types",
      heading: "Choose the Florida certificate type",
      paragraphs: [
        "Florida issues computer-generated birth certificates and manually produced photocopy certificates. Both are printed on security paper with the Florida embossed seal. The state describes the computer-generated form as accepted by all state and federal agencies; the photocopy form is manually produced and may take a different processing path.",
        "Ask the receiving organization which version it accepts before you order. A passport office, school, insurer, or foreign authority may have requirements that go beyond the state's standard certificate.",
      ],
      links: [{ label: "Compare Florida birth-certificate options", href: FLORIDA_BIRTH_URL }],
    },
    {
      id: "state-or-county",
      heading: "State office or county health department?",
      paragraphs: [
        "The state Bureau of Vital Statistics offers walk-in service in Jacksonville and mail-in service. It also lists an online ordering option through its contracted vendor. County health departments can serve births from 1917 to the present, and county fees and service options can vary.",
        "The county where the birth occurred is the key detail for local service. If the birth occurred outside Florida, request the record from that state or country instead.",
      ],
      links: [
        { label: "Find a Florida county health department", href: FLORIDA_COUNTY_URL },
        { label: "Review the state's online ordering information", href: FLORIDA_VITALCHEK_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Florida asks for identifying details about the person named on the certificate and about the applicant. Having them together makes the application easier to complete and reduces the chance of a mismatch.",
      ],
      bullets: [
        "The full name on the birth record and the person's sex.",
        "Date of birth, or a range of years if the date is unknown.",
        "The city or county of birth.",
        "Parents' full names before their first marriage.",
        "Your full name, relationship to the person named on the record, mailing address, and phone number.",
        "Your signature and a copy of acceptable photo identification.",
        "The certificate type you need and any supporting documents that apply.",
      ],
      note: "Photo identification is required for a Florida birth-record request. The state lists driver's licenses, state identification cards, passports, and military identification as examples.",
    },
    {
      id: "process",
      heading: "How a Florida request usually works",
      bullets: [
        "Confirm that you are an eligible requestor.",
        "Choose the state office, a county health department, or the state's online ordering option.",
        "Download the current application or complete the online flow.",
        "Prepare the record details, photo identification, and any supporting documents.",
        "Submit the request and pay the agency through the channel it supports.",
        "Keep your confirmation and track the request until the certificate arrives.",
        "Check the certificate for accuracy and contact the agency if a correction is needed.",
      ],
      note: "A correction or amendment is a separate process from ordering a copy. If the record itself needs to change, review the amendment requirements before you order the corrected certificate.",
    },
    {
      id: "special-situations",
      heading: "Common Florida situations",
      paragraphs: [
        "Some requests need a different application or an additional authorization. Check the official guidance for your situation before filing.",
      ],
      bullets: [
        "Name, paternity, adoption, or legal name-change amendments: these follow the state's amendment process, not a standard copy request.",
        "International use: an apostille or authentication is a two-step process involving the Florida Department of Health and the Florida Department of State.",
        "Birth outside Florida: use the CDC directory for other U.S. states, or the U.S. Department of State for births outside the United States.",
        "Older records: county health departments serve births from 1917 to the present; contact the state for records outside that range.",
      ],
      links: [
        { label: "Read Florida amendment and correction guidance", href: FLORIDA_AMENDMENT_URL },
        { label: "Review Florida apostille instructions", href: FLORIDA_APOSTILLE_URL },
        { label: "Find another state's vital-records office", href: CDC_OUTSIDE_URL },
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
      question: "Where do I find the official Florida birth certificate requirements?",
      answer: `Use the [official Florida birth-certificate page](${FLORIDA_BIRTH_URL}). It is the source of truth for current eligibility, application options, identification, certificate types, and agency instructions.`,
    },
    {
      question: "Who can order a Florida birth certificate?",
      answer: `Florida may issue a confidential birth record to the registrant if of legal age, a parent listed on the record, a legal guardian with guardianship papers, a legal representative with documentation, or a person acting under a court order. After the registrant's death is recorded, a spouse, child, grandchild, or sibling of legal age may request a certificate marked deceased with a copy of the death certificate. See [Florida eligibility rules](${FLORIDA_BIRTH_URL}).`,
    },
    {
      question: "What identification does Florida require?",
      answer: `Florida requires a copy of valid photo identification, such as a driver's license, state identification card, passport, or military identification. If you are not an eligible requestor, the state may require additional authorization or supporting documents. Review the [official instructions](${FLORIDA_BIRTH_URL}).`,
    },
    {
      question: "Should I order from the state or a county health department?",
      answer: `The state Bureau of Vital Statistics offers walk-in and mail service, and county health departments can serve births from 1917 to the present. County fees and service options vary. Use the [county health department finder](${FLORIDA_COUNTY_URL}) or compare the options on the [state page](${FLORIDA_BIRTH_URL}).`,
    },
    {
      question: "What is the difference between the Florida certificate types?",
      answer: `Florida issues computer-generated and manually produced photocopy certificates. Both carry the Florida embossed seal. The state describes the computer-generated form as accepted by all state and federal agencies; ask the receiving organization which version it requires. See [Florida birth certificates](${FLORIDA_BIRTH_URL}).`,
    },
    {
      question: "Can I order a Florida birth certificate online?",
      answer: `The state lists an online ordering option through its contracted vendor and also supports walk-in and mail requests. USVC is an independent document assistance service, not the state's contracted vendor. Compare the official options on the [state page](${FLORIDA_BIRTH_URL}) and [online ordering page](${FLORIDA_VITALCHEK_URL}).`,
    },
    {
      question: "What if the birth happened outside Florida?",
      answer: `Florida can only issue records for births that occurred in Florida. Use the [CDC directory](${CDC_OUTSIDE_URL}) for another U.S. state or the [U.S. Department of State](${STATE_DEPT_BIRTH_URL}) for a birth outside the United States.`,
    },
    {
      question: "What if I need the certificate for use in another country?",
      answer: `An apostille or authentication is a two-step process: obtain the Florida vital-record certificate, then have it authenticated by the Florida Department of State. Review the [Florida Department of Health apostille guidance](${FLORIDA_APOSTILLE_URL}) and the [Department of State instructions](${FLORIDA_DOS_APOSTILLE_URL}).`,
    },
    {
      question: "What if the name or parent information is wrong?",
      answer: `A correction or amendment is separate from ordering a standard copy. Review [Florida amendment and correction guidance](${FLORIDA_AMENDMENT_URL}) before ordering the corrected certificate.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Florida Department of Health – Birth certificates", href: FLORIDA_BIRTH_URL },
    { label: "Florida Department of Health – County health departments", href: FLORIDA_COUNTY_URL },
    {
      label: "Florida Department of Health – Amendments and corrections",
      href: FLORIDA_AMENDMENT_URL,
    },
    { label: "Florida Department of Health – Apostille certificates", href: FLORIDA_APOSTILLE_URL },
    {
      label: "Florida Department of State – Apostille certification",
      href: FLORIDA_DOS_APOSTILLE_URL,
    },
    {
      label: "Florida Department of Health – Order certificates online",
      href: FLORIDA_VITALCHEK_URL,
    },
    { label: "CDC – Where to write for vital records", href: CDC_OUTSIDE_URL },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Florida Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

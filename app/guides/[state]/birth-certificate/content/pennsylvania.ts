import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const PA_BIRTH_URL = "https://www.pa.gov/agencies/health/programs/vital-records/birth-certificates";
const PA_ID_URL = "https://www.pa.gov/agencies/health/programs/vital-records/acceptable-id";
const PA_PUBLIC_OFFICES_URL =
  "https://www.pa.gov/agencies/health/programs/vital-records/public-offices";
const PA_AMENDMENTS_URL =
  "https://www.pa.gov/agencies/health/programs/vital-records/birth-certificates/amending-birth-record";
const PA_ADOPTIONS_URL = "https://www.pa.gov/agencies/health/programs/vital-records/adoptions";
const PA_APOSTILLE_URL = "https://www.pa.gov/services/dos/get-document-certifications---apostilles";
const PA_VITAL_RECORDS_URL = "https://www.pa.gov/agencies/health/programs/vital-records";
const PA_ONLINE_URL = "https://mycertificates.health.pa.gov/";

export const PENNSYLVANIA_GUIDE: BirthGuideContent = {
  stateName: "Pennsylvania",
  metaTitle: "Pennsylvania Birth Certificate Guide: ID and Ordering",
  metaDescription:
    "How Pennsylvania birth certificate requests work: who may order, photo ID or alternatives, online, mail, in-person offices, corrections, USVC help.",
  subtitle:
    "Confirm who may order a Pennsylvania birth record, prepare acceptable identification, and choose the right official filing path.",
  intro: [
    "Pennsylvania birth certificates for births in the Commonwealth are issued by the Department of Health. Applicants can file online through the state's authorized vendor, by mail, or at a Vital Records public office. The Department processes the order even when a private vendor collects it online.",
    "This guide explains the eligibility list, the photo-ID and alternate-document rules, the difference between state and public-office service, and the separate paths for corrections, adoptions, and apostilles. The official Pennsylvania pages remain the source of truth.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Pennsylvania Department of Health, Bureau of Health Statistics and Registries",
    },
    {
      label: "Record location",
      value: "Pennsylvania births recorded by the Department of Health",
    },
    {
      label: "Copy type",
      value: "Certified birth certificate; a Report of Live Birth is a different document",
    },
    {
      label: "Where to request",
      value: "Online through the authorized vendor, by mail, or at a public office",
    },
    {
      label: "Eligibility",
      value: "Listed relatives, power of attorney, or attorney/legal representative",
    },
    {
      label: "Best first step",
      value: "Confirm your relationship and acceptable identification",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Pennsylvania resource",
      paragraphs: [
        "The Department of Health controls the application, identification, eligibility, and payment rules. Its birth-certificate page explains the current online, mail, and in-person options and links to the forms the agency accepts.",
        "Use the official page to confirm the current fee, fee-waiver rules, and delivery options before you file. Those details can change without notice, so this guide does not replace the agency's instructions.",
      ],
      links: [
        { label: "Open the official Pennsylvania birth-certificate page", href: PA_BIRTH_URL },
        { label: "Review Pennsylvania Vital Records", href: PA_VITAL_RECORDS_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a Pennsylvania birth certificate",
      paragraphs: [
        "Pennsylvania uses a defined eligibility list. The person named on the certificate may apply, along with a spouse, parent or step-parent, brother or sister, half-brother or half-sister, son or daughter, step-son or step-daughter, grandparent or great-grandparent, and grandchild or great-grandchild.",
        "A power of attorney, attorney, or other legal representative of the person named on the record may also apply. If the person named on the certificate is deceased, a family member who is not on the list must also submit a copy of the death certificate.",
      ],
      bullets: [
        "Applicants using the in-person or mail process must be at least 16 years old.",
        "Online applicants must be at least 18 because of the online payment and identity requirements.",
        "Eligibility is based on the relationship to the person named on the record, not on where the applicant lives.",
        "A legal representative should be prepared to document the authority to act for the person named on the record.",
      ],
      links: [{ label: "Read Pennsylvania eligibility and application rules", href: PA_BIRTH_URL }],
    },
    {
      id: "identification",
      heading: "Prepare photo ID or alternate documents",
      paragraphs: [
        "Pennsylvania requires an unexpired government-issued photo ID at the time of application. If the certificate will be mailed, the ID must also show the applicant's current address. A driver's license, state-issued ID card, passport, military ID, license to carry firearms, or medical marijuana ID can qualify, subject to the pickup or mail rules on the state's ID page.",
        "An inmate identification card can be used, but a recently released applicant must also provide release papers or a letter from the institution verifying the current mailing address.",
        "If you do not have an acceptable government photo ID, the state allows two documents that verify your name and current mailing address. Examples include a bank or credit-card statement, medical records, a pay stub, a Social Security statement, a utility bill, a current lease, school records, a tax return or W-2, and vehicle registration. Documents must fall within the age limits shown on the state page. Junk mail and envelopes do not qualify.",
      ],
      note: "Mail a legible photocopy of your identification documents. Do not send original ID cards.",
      links: [{ label: "Review Pennsylvania acceptable identification", href: PA_ID_URL }],
    },
    {
      id: "where-to-file",
      heading: "Online, by mail, or at a public office",
      paragraphs: [
        "Pennsylvania offers three application paths. Online orders use the Department's authorized vendor. The Department says other online providers convert orders into paper applications, which can add delay and cost, so confirm that you are on the official vendor site.",
        "Mail requests use the Application for Birth Certificate and are processed by the Birth Certificate Processing Unit. In-person requests are handled at the Department's Vital Records public offices. Check the current office hours and appointment rules before visiting, especially in Philadelphia.",
      ],
      bullets: [
        "Online: credit-card payment and the state's authorized vendor; delivery options are shown during ordering.",
        "Mail: complete the current state application and use the payment method the Department accepts by mail.",
        "In person: use a listed public office and bring acceptable identification and payment.",
        "The Department processes requests for all channels, including online orders collected by its vendor.",
      ],
      links: [
        { label: "Open the authorized Pennsylvania online ordering site", href: PA_ONLINE_URL },
        { label: "Find Pennsylvania Vital Records public offices", href: PA_PUBLIC_OFFICES_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Use the details exactly as they appear on the birth record. A spelling mismatch, an unknown county, or a parent's married name used instead of the name on the record can delay the search.",
      ],
      bullets: [
        "The person's full name at birth, including any suffix.",
        "Date of birth and the city or county of birth in Pennsylvania.",
        "The mother's name as shown on the record, including her maiden name.",
        "The father's or other parent's name as shown on the record.",
        "Your relationship to the person named on the certificate.",
        "Acceptable photo ID or two alternate documents, plus a deliverable mailing address.",
        "A death certificate if you are a family member requesting a deceased person's record and are not on the standard eligibility list.",
      ],
    },
    {
      id: "process",
      heading: "How a Pennsylvania request usually works",
      bullets: [
        "Confirm that you are an eligible applicant and that the birth occurred in Pennsylvania.",
        "Decide whether online, mail, or in-person service fits your deadline and location.",
        "Prepare acceptable identification and any supporting relationship or death-certificate documents.",
        "Complete the current application with the name, date, and place exactly as recorded.",
        "Submit payment through the channel the Department supports.",
        "Keep the confirmation and track the order through the channel you used.",
        "Check the certificate when it arrives and contact the Department if a correction is needed.",
      ],
      note: "A correction is a separate process from ordering a copy. Do not file a standard order if the record itself needs to be changed first.",
    },
    {
      id: "corrections-adoption",
      heading: "Corrections, name changes, and adoptions",
      paragraphs: [
        "Pennsylvania uses different modification forms based on the person's age and the type of change. Parentage changes use a dedicated form. The Department's older correction form on the back of some certificates has been replaced and is no longer accepted.",
        "Adoption is handled separately from a standard correction. After an adoption, the Department can issue an updated birth certificate based on the adoption record. Do not use the general modification forms for an adoption.",
      ],
      bullets: [
        "Use the current Request to Modify form that matches the subject's age.",
        "Use the parentage form to add, remove, or replace a parent.",
        "For a name change, follow the modification instructions and the court or identity-document steps that apply.",
        "For an adoption, start with the Department's adoption guidance rather than the correction forms.",
      ],
      links: [
        { label: "Review Pennsylvania birth-record modifications", href: PA_AMENDMENTS_URL },
        { label: "Read Pennsylvania adoption guidance", href: PA_ADOPTIONS_URL },
      ],
    },
    {
      id: "apostille",
      heading: "Using a Pennsylvania certificate outside the United States",
      paragraphs: [
        "An apostille or document certification is issued by the Pennsylvania Department of State, not by the Department of Health. The birth certificate must first be an original certified copy issued by the proper Pennsylvania official, not a photocopy.",
        "Follow the Department of State's current instructions for the destination country, submission method, and payment. An apostille is for international use and is not issued for documents used only within the United States.",
      ],
      links: [
        {
          label: "Review Pennsylvania apostille and certification instructions",
          href: PA_APOSTILLE_URL,
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
      question: "Where do I find the official Pennsylvania birth certificate requirements?",
      answer: `Use the [official Pennsylvania birth-certificate page](${PA_BIRTH_URL}). It is the source of truth for current application options, eligibility, identification, fees, fee waivers, and agency instructions.`,
    },
    {
      question: "Who can request a Pennsylvania birth certificate?",
      answer: `The person named on the record, a spouse, parent or step-parent, sibling or half-sibling, child or step-child, grandparent or great-grandparent, grandchild or great-grandchild, a power of attorney, or an attorney or legal representative. A deceased person's record may require a death certificate from a family member outside that list. See [eligibility rules](${PA_BIRTH_URL}).`,
    },
    {
      question: "Does Pennsylvania require photo identification?",
      answer: `Yes. The applicant must present an unexpired government-issued photo ID. A mail request also requires the ID to show the current mailing address. Review the [acceptable ID page](${PA_ID_URL}) for the pickup and mail rules.`,
    },
    {
      question: "What if I do not have a government-issued photo ID?",
      answer: `Pennsylvania accepts two documents that verify your name and current mailing address, such as a recent bank or credit-card statement, medical records, a pay stub, a utility bill, a current lease, school records, a tax return, or vehicle registration. The documents must meet the age limits on the [acceptable ID page](${PA_ID_URL}).`,
    },
    {
      question: "Can I order online, by mail, or in person?",
      answer: `Yes. Pennsylvania supports online ordering through its authorized vendor, mail using the Application for Birth Certificate, and in-person service at a Vital Records public office. Compare the current options on the [birth-certificate page](${PA_BIRTH_URL}) and [public-office page](${PA_PUBLIC_OFFICES_URL}).`,
    },
    {
      question: "Why does Pennsylvania warn about other online vendors?",
      answer:
        "The Department says its authorized vendor is the only online provider that collects orders on its behalf. Other providers may convert your order into a paper application, which can add delay and cost. Start from the official state page rather than a search ad.",
    },
    {
      question: "What if the birth happened outside Pennsylvania?",
      answer:
        "Pennsylvania can only issue records for births that occurred in Pennsylvania. Request the certificate from the state or country where the birth happened.",
    },
    {
      question: "How do I correct a Pennsylvania birth record?",
      answer: `Use the current Request to Modify form that matches the subject's age, or the parentage form for parent changes. Adoption is separate. Review [Pennsylvania modification guidance](${PA_AMENDMENTS_URL}) before filing.`,
    },
    {
      question: "How do I get an apostille for a Pennsylvania birth certificate?",
      answer: `First obtain an original certified Pennsylvania birth certificate, then follow the [Pennsylvania Department of State apostille instructions](${PA_APOSTILLE_URL}). The Department of Health issues the certificate; the Department of State handles the apostille.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Pennsylvania Department of Health – Birth certificates", href: PA_BIRTH_URL },
    { label: "Pennsylvania Department of Health – Acceptable ID", href: PA_ID_URL },
    { label: "Pennsylvania Department of Health – Public offices", href: PA_PUBLIC_OFFICES_URL },
    {
      label: "Pennsylvania Department of Health – Modifying a birth record",
      href: PA_AMENDMENTS_URL,
    },
    { label: "Pennsylvania Department of Health – Adoptions", href: PA_ADOPTIONS_URL },
    {
      label: "Pennsylvania Department of State – Certifications and apostilles",
      href: PA_APOSTILLE_URL,
    },
    { label: "Pennsylvania Department of Health – Vital Records", href: PA_VITAL_RECORDS_URL },
    { label: "Pennsylvania authorized online ordering", href: PA_ONLINE_URL },
  ],
  sourceChecked: "10/22/2026",
  ctaLabel: "Start Your Pennsylvania Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

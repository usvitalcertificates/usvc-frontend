import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const OH_ORDER_URL =
  "https://odh.ohio.gov/know-our-programs/vital-statistics/how-to-order-certificates";
const OH_VS_URL = "https://odh.ohio.gov/know-our-programs/vital-statistics";
const OH_APP_URL =
  "https://odh.ohio.gov/know-our-programs/vital-statistics/resources/vs-applicationforcertifiedcopies";
const OH_LOCAL_URL =
  "https://odh.ohio.gov/know-our-programs/vital-statistics/resources/vs-localvsdirectory";
const OH_CORRECTIONS_URL =
  "https://odh.ohio.gov/know-our-programs/vital-statistics/Changing-Correcting-Birth-Record";
const OH_ADOPTION_URL =
  "https://odh.ohio.gov/know-our-programs/vital-statistics/Adoption-File-Information";
const OH_APOSTILLE_URL = "https://www.ohiosos.gov/records/apostilles-certifications/";
const OH_LAW_URL = "https://codes.ohio.gov/ohio-revised-code/section-3705.23";

export const OHIO_GUIDE: BirthGuideContent = {
  stateName: "Ohio",
  metaTitle: "Ohio Birth Certificate Guide: Abstract or Certified",
  metaDescription:
    "How Ohio birth certificate requests work: abstract vs certified copies, state or local filing, mail and online limits, corrections, and USVC help.",
  subtitle:
    "Understand Ohio's open-record rule, choose between an online abstract and a certified copy, and use the right state or local filing path.",
  intro: [
    "The Ohio Department of Health maintains birth records for Ohio births from December 20, 1908. Ohio law generally directs the state or a local registrar to issue a certified copy to any applicant, unless the record has ceased to be a public record under a specific exception. Adoption files and some other records are restricted.",
    "Ohio's online portal issues an abstract birth certificate, while the mail-in and local-office paths can provide a certified record. This guide explains that choice, the state and local options, corrections, adoption files, and apostilles.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "Ohio Department of Health, Bureau of Vital Statistics",
    },
    {
      label: "Record location",
      value: "State records from December 20, 1908; earlier births may be local or archival",
    },
    {
      label: "Copy types",
      value: "Online abstract, certified birth record, and heirloom certification",
    },
    {
      label: "Where to request",
      value: "Online, by mail, at the state office, or through a local vital statistics office",
    },
    {
      label: "Eligibility",
      value: "Generally any applicant, subject to restricted records such as adoption files",
    },
    {
      label: "Best first step",
      value: "Decide whether U.S. use or international use requires a certified record",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official Ohio resource",
      paragraphs: [
        "The Ohio Department of Health controls the application, payment, record-type, and local-office rules. Its How to Order page explains the online portal, mail-in application, state office, and local vital statistics offices.",
        "Use the official page to confirm current fees, service limits, and mail instructions. Those details can change without notice, so this guide should be read with the agency's current guidance.",
      ],
      links: [
        { label: "Open the official Ohio ordering page", href: OH_ORDER_URL },
        { label: "Review Ohio Vital Statistics", href: OH_VS_URL },
      ],
    },
    {
      id: "copy-types",
      heading: "Online abstract or certified birth record?",
      paragraphs: [
        "Ohio's online ordering portal produces an abstract birth certificate. The Department says the abstract is valid for all U.S. legal uses, including a passport. That makes it a practical option for many domestic purposes.",
        "The Department specifically says not to order online for genealogy, dual citizenship, international legal matters, or an international marriage. Those requests require the mail-in application. A certified record can also be requested by mail or through a local vital statistics office.",
      ],
      bullets: [
        "Online abstract: useful for U.S. legal uses, including passports, subject to the receiving organization's rules.",
        "Certified birth record: request through the state or a local office when you need a certified copy rather than the online abstract.",
        "Heirloom certification: a decorative record with its own application; it is not the same as a standard certified copy.",
        "Adoption file: a separate restricted record that cannot be ordered online.",
      ],
      note: "Ask the organization receiving the certificate whether it accepts an abstract or requires a certified copy.",
      links: [{ label: "Compare Ohio ordering methods", href: OH_ORDER_URL }],
    },
    {
      id: "who-may-request",
      heading: "Who may request an Ohio birth certificate",
      paragraphs: [
        "Ohio's vital-records statute generally requires the state registrar or a local registrar to issue a certified copy to any applicant who submits a signed application and the required fee, unless the record has ceased to be a public record under the listed exceptions.",
        "That open-record rule is different from the relationship-based eligibility used by many states. Restricted records still require a different process; adoption files are the most common example.",
      ],
      bullets: [
        "You do not need to be the person named on the record or an immediate relative for a standard public birth record.",
        "The applicant must sign the application and provide accurate contact and record details.",
        "A record that has ceased to be public under Ohio law is not available through the standard process.",
        "Adoption files have age-based and year-based rules and cannot be ordered through the online birth-certificate portal.",
      ],
      links: [
        { label: "Read the Ohio certified-copy statute", href: OH_LAW_URL },
        { label: "Review Ohio ordering instructions", href: OH_ORDER_URL },
      ],
    },
    {
      id: "identification",
      heading: "Applicant details and identification",
      paragraphs: [
        "Ohio's state application asks for the applicant's name, address, phone number, email, and signature. It does not list a statewide photo-ID requirement for a standard birth record. If you use a local office, ask that office about any identification or intake requirements before you visit.",
        "An adoption-file request is different. The Department's adoption guidance requires two pieces of identification, with linkage shown if a name changed through marriage or another event.",
      ],
      links: [
        { label: "Download the Ohio application", href: OH_APP_URL },
        { label: "Review Ohio adoption-file requirements", href: OH_ADOPTION_URL },
      ],
    },
    {
      id: "state-local",
      heading: "State office, mail, or local vital statistics office",
      paragraphs: [
        "The state Bureau of Vital Statistics accepts the mail-in application and offers limited in-person service at its Columbus office. More than 100 local vital statistics offices also serve the public, and local service can be more convenient depending on where you live or travel in Ohio.",
        "The state maintains births from December 20, 1908. For earlier births, contact the local vital statistics office where the birth occurred. Ohio law also allows birth records older than 125 years to be transferred to the Ohio History Connection.",
      ],
      bullets: [
        "Online: use the state portal for an abstract and pay by credit card.",
        "Mail: send the current Application for Certified Copies and the payment method the state accepts by mail.",
        "State office: use the Columbus location and complete the application before arrival.",
        "Local: use the Department's local directory to contact the office serving the birth place; confirm hours and services.",
      ],
      links: [
        { label: "Find Ohio local vital statistics offices", href: OH_LOCAL_URL },
        { label: "Review state and local ordering options", href: OH_ORDER_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Ohio asks for the record details exactly as they appear on the birth record. The mother's name before first marriage is especially important; using a married name can cause the search to fail.",
      ],
      bullets: [
        "The person's full birth name and any name change since birth.",
        "Date of birth and the city and county where the birth occurred.",
        "The mother's name before first marriage, as shown on the record.",
        "The father's or other parent's name as shown on the record.",
        "The reason for the request and the number of copies you need.",
        "Your name, mailing address, phone number, email, and signature.",
        "For international use, the destination country and any apostille instructions.",
      ],
    },
    {
      id: "process",
      heading: "How an Ohio request usually works",
      bullets: [
        "Decide whether the receiving organization will accept an online abstract or requires a certified record.",
        "Confirm whether the birth is in the state's 1908-present holdings or must be requested locally.",
        "Complete the online order or the Application for Certified Copies.",
        "Enter the name, date, county, and mother's name before first marriage exactly as recorded.",
        "Use a credit card online, or a check or money order by mail; do not send cash.",
        "Keep the confirmation and track the order through the state or local office you used.",
        "Check the certificate for accuracy when it arrives and use the correction process if needed.",
      ],
      note: "Online orders cannot be canceled once submitted, and the state does not offer expedited online or mail service. Confirm the details before paying.",
    },
    {
      id: "corrections",
      heading: "Correcting an Ohio birth record",
      paragraphs: [
        "Ohio uses different paths for different changes. A Birth Affidavit is limited to minor spelling and data-entry errors on the original record. It cannot change race, gender, or the names of the child or parents already listed, and it cannot be used with adoption or paternity paperwork.",
        "Court-ordered corrections can be handled through an Ohio probate court and may correct errors or add missing information. A legal name change uses a certified court order. The Department also makes changes to the sex marker on a birth certificate with a probate court order.",
      ],
      bullets: [
        "Minor spelling or data-entry error: use the Birth Affidavit process described by the state.",
        "Court-ordered correction: contact the probate court in the county where you reside.",
        "Legal name change: submit a certified copy of the U.S. court order to the state bureau.",
        "Adoption or paternity: use the separate adoption or paternity process, not a Birth Affidavit.",
      ],
      links: [{ label: "Review Ohio birth-record changes", href: OH_CORRECTIONS_URL }],
    },
    {
      id: "adoption",
      heading: "Ohio adoption files and original birth records",
      paragraphs: [
        "The Bureau of Vital Statistics houses birth and adoption records for people born in Ohio and adopted anywhere in the United States. An adoption file is not the same as a standard birth certificate and cannot be ordered through the online birth-certificate portal.",
        "Ohio's adoption rules depend on when the adoption was finalized. Adult adoptees and, in some periods, their adult lineal descendants may request an adoption file. For adoptions finalized after September 18, 1996, the adoptee must generally be over 21, or the adoptive parent may request for an adoptee between 18 and 21, subject to a denial-of-release form in the file.",
      ],
      bullets: [
        "Adoptions finalized before 1964: adult adoptees and adult lineal descendants may apply.",
        "Adoptions finalized from 1964 through 1996: adult adoptees at least 18 and adult lineal descendants may apply.",
        "Adoptions finalized after September 18, 1996: adoptee over 21, or adoptive parent for an adoptee 18 to 21, subject to the file's restrictions.",
        "Adoption-file requests use a separate form, require two pieces of identification, and are not handled online.",
      ],
      links: [{ label: "Review Ohio adoption-file information", href: OH_ADOPTION_URL }],
    },
    {
      id: "apostille",
      heading: "Using an Ohio birth certificate outside the United States",
      paragraphs: [
        "An apostille or authentication is issued by the Ohio Secretary of State. The document must be a certified copy of the birth record issued by the Ohio Department of Health or a local vital statistics office; the Secretary of State cannot attach an apostille to an uncertified photocopy.",
        "Follow the Secretary of State's current instructions for the destination country and submission method. An apostille is for use outside the United States and is not issued for a document used only within this country.",
      ],
      links: [
        { label: "Review Ohio apostille and authentication instructions", href: OH_APOSTILLE_URL },
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
      question: "Where do I find the official Ohio birth certificate requirements?",
      answer: `Use the [official Ohio How to Order page](${OH_ORDER_URL}). It is the source of truth for current fees, online and mail options, local offices, forms, and agency limits.`,
    },
    {
      question: "Can anyone request an Ohio birth certificate?",
      answer: `Ohio law generally requires a certified copy to be issued to any applicant who submits a signed application and the required fee, unless the record has ceased to be public under a specific exception. Adoption files and other restricted records are different. See the [Ohio statute](${OH_LAW_URL}).`,
    },
    {
      question: "What is the difference between an Ohio abstract and a certified copy?",
      answer: `The online portal issues an abstract, which the Department says is valid for all U.S. legal uses, including passports. For genealogy, dual citizenship, international legal matters, or an international marriage, the Department requires the mail-in application instead. See [Ohio ordering options](${OH_ORDER_URL}).`,
    },
    {
      question: "Can I use an Ohio online abstract for a passport?",
      answer:
        "Yes. The Ohio Department of Health says online birth certificates are abstract copies valid for all U.S. legal uses, including passports. Confirm with the passport acceptance facility if you have a specific concern.",
    },
    {
      question: "Why can't I order online for international use?",
      answer: `Ohio specifically directs genealogy, dual citizenship, international legal matters, and international marriage requests to the mail-in process rather than the online abstract. Follow the [How to Order page](${OH_ORDER_URL}) and the apostille instructions for your destination country.`,
    },
    {
      question: "Where can I order in person in Ohio?",
      answer: `There are more than 100 local vital statistics offices, plus limited service at the state office in Columbus. Use the [Ohio local directory](${OH_LOCAL_URL}) and confirm the office's hours and services before visiting.`,
    },
    {
      question: "What if the birth happened before December 20, 1908?",
      answer: `Contact the local vital statistics office where the birth occurred. The state's birth holdings begin December 20, 1908, and Ohio law allows very old records to be transferred to the Ohio History Connection. Start with the [state ordering guidance](${OH_ORDER_URL}).`,
    },
    {
      question: "Does Ohio require photo ID for a birth certificate?",
      answer:
        "The state mail-in application asks for your contact details and signature and does not list a statewide photo-ID requirement for a standard birth record. Local offices may have their own intake practices, so confirm before you visit. Adoption-file requests require two forms of identification.",
    },
    {
      question: "How do I correct an Ohio birth certificate?",
      answer: `Use the Birth Affidavit only for minor spelling or data-entry errors. Court-ordered corrections go through an Ohio probate court, and legal name changes require a certified court order. Review [Ohio correction guidance](${OH_CORRECTIONS_URL}) before filing.`,
    },
    {
      question: "How do I request an Ohio adoption file?",
      answer: `Use the separate adoption-file process; it cannot be ordered online. Eligibility depends on when the adoption was finalized and whether the requester is the adoptee, an adoptive parent, or a lineal descendant. Review [Ohio adoption-file information](${OH_ADOPTION_URL}).`,
    },
    {
      question: "How do I get an apostille for an Ohio birth certificate?",
      answer: `Obtain a certified copy from the Ohio Department of Health or a local vital statistics office, then submit it to the [Ohio Secretary of State](${OH_APOSTILLE_URL}) with the required cover information. The Secretary of State handles the apostille, not the vital-records office.`,
    },
    {
      question: "What if the birth happened outside Ohio?",
      answer:
        "Ohio can only issue records for births that occurred in Ohio. Request the certificate from the state or country where the birth happened.",
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "Ohio Department of Health – How to order certificates", href: OH_ORDER_URL },
    { label: "Ohio Department of Health – Vital Statistics", href: OH_VS_URL },
    { label: "Ohio Department of Health – Application for Certified Copies", href: OH_APP_URL },
    { label: "Ohio Department of Health – Local vital statistics offices", href: OH_LOCAL_URL },
    {
      label: "Ohio Department of Health – Changing or correcting a birth record",
      href: OH_CORRECTIONS_URL,
    },
    { label: "Ohio Department of Health – Adoption file information", href: OH_ADOPTION_URL },
    {
      label: "Ohio Secretary of State – Authentication and apostilles",
      href: OH_APOSTILLE_URL,
    },
    { label: "Ohio Revised Code – Section 3705.23", href: OH_LAW_URL },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your Ohio Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

import type { BirthGuideContent } from "../guide-types";
import { USVC_HELP_COPY } from "./shared";

const NEW_YORK_BIRTH_URL = "https://www.health.ny.gov/vital_records/birth.htm";
const NEW_YORK_CORRECTIONS_URL =
  "https://www.health.ny.gov/vital_records/docs/public_instructions_for_birth_corrections.pdf";
const NEW_YORK_PREADOPTION_URL = "https://www.health.ny.gov/vital_records/preadoption.htm";
const NEW_YORK_APOSTILLE_URL = "https://www.health.ny.gov/vital_records/apostille.htm";
const NEW_YORK_DOS_APOSTILLE_URL = "https://www.dos.ny.gov/licensing/apostille.html";
const NYC_BIRTH_URL = "https://www.nyc.gov/site/doh/services/birth-certificates.page";
const NEW_YORK_VITAL_RECORDS_URL = "https://www.health.ny.gov/vital_records/";

export const NEW_YORK_GUIDE: BirthGuideContent = {
  stateName: "New York",
  metaTitle: "New York Birth Certificate Guide: State vs. NYC",
  metaDescription:
    "How New York birth certificate requests work: state vs New York City records, who may order, identification, filing options, and USVC help.",
  subtitle:
    "Find out whether the state or New York City holds the record, confirm who may order it, and prepare the identification the agency requires.",
  intro: [
    "New York is not a single birth-record system. The state Department of Health holds records for births outside New York City, while New York City maintains records for the five boroughs. Local registrars can also issue records for births that occurred in their area.",
    "This guide explains the state-versus-city split, the eligibility rules, and the identification requirements. The official New York State and New York City resources remain the source of truth for current requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "New York State Department of Health and the New York City Department of Health",
    },
    {
      label: "Record location",
      value: "New York State records exclude the five New York City boroughs",
    },
    {
      label: "Copy types",
      value: "State birth certificates; New York City issues its own records",
    },
    {
      label: "Where to request",
      value: "State online, phone, or mail; New York City or local registrar for eligible records",
    },
    {
      label: "Best first step",
      value: "Confirm whether the birth occurred in New York City",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official New York resource",
      paragraphs: [
        "The New York State Department of Health controls the application, eligibility, and identification rules for state records. New York City controls records for births in Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Those details can change without notice on the issuing agency's page, which this guide doesn't control.",
        "Confirm the birth location before you gather documents. A request sent to the wrong office will not produce the certificate you need.",
      ],
      links: [
        {
          label: "Open the official New York State birth-certificate page",
          href: NEW_YORK_BIRTH_URL,
        },
      ],
    },
    {
      id: "state-or-nyc",
      heading: "New York State or New York City?",
      paragraphs: [
        "The state Department of Health has birth records for New York State since 1881, but it does not have records for New York City. New York City means the boroughs of Manhattan, Kings (Brooklyn), Queens, the Bronx, and Richmond (Staten Island).",
        "If the birth occurred in one of those boroughs, use the New York City process. If the birth occurred elsewhere in New York, the state or the local registrar for the place of birth can help. If the birth occurred outside New York, request the record from that state or country.",
      ],
      links: [
        { label: "Review New York City birth certificates", href: NYC_BIRTH_URL },
        { label: "Check New York State vital-records options", href: NEW_YORK_BIRTH_URL },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a New York State birth certificate",
      paragraphs: [
        "New York State limits who may receive a birth certificate. The person named on the certificate and a parent whose name appears on the certificate may request a copy. A spouse, child, or other person may request one only by order of a New York State court.",
        "This is stricter than the rules in many other states. If you are not the person named on the record or a parent listed on it, confirm the court-order requirement before you apply.",
      ],
      links: [{ label: "Read New York State eligibility requirements", href: NEW_YORK_BIRTH_URL }],
    },
    {
      id: "identification",
      heading: "Prepare the required identification",
      paragraphs: [
        "New York State requires a copy of either one valid photo ID or two documents that show the applicant's name and address. Acceptable photo IDs include a driver's license, a state-issued nondriver photo-ID card, a passport, and a U.S. military-issued photo ID.",
        "The two-document option includes items such as a utility or telephone bill, or a letter from a government agency dated within the last six months. If you are applying from a foreign country that requires a passport for travel, the state also asks for a copy of your U.S. passport.",
      ],
      links: [{ label: "Review New York State ID requirements", href: NEW_YORK_BIRTH_URL }],
    },
    {
      id: "process",
      heading: "How a New York State request usually works",
      paragraphs: [
        "The state offers online and phone ordering through its vendor and a mail application. The state says a Social Security number will be asked when you order online or on paper. A local registrar can also issue a record for a birth that occurred in its area.",
      ],
      bullets: [
        "Confirm whether the birth occurred in New York City or elsewhere in New York.",
        "Check that you are eligible to receive the record.",
        "Prepare the required photo ID or the two-document alternative.",
        "Choose online, phone, mail, or the local registrar for the birth location.",
        "Complete the current application and provide the requested identification.",
        "Keep your confirmation and track the request until the certificate arrives.",
        "Check the certificate for accuracy and contact the issuing office if a correction is needed.",
      ],
      note: "If you need the record for an apostille or dual citizenship, confirm the required form before ordering. The state advises online and phone applicants who need an apostille to request a long form, also called a full or vault copy.",
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Use the details exactly as they appear on the birth record. A mismatch between the application and the record can delay the request or produce a certificate the receiving organization will not accept.",
      ],
      bullets: [
        "The subject's full name at birth, including any suffix.",
        "Date of birth and the city or borough of birth.",
        "Parents' names as shown on the record.",
        "Your relationship to the person named on the certificate.",
        "Your contact details and a deliverable mailing address.",
        "The required photo ID or two-document alternative.",
        "A Social Security number if you order online or by paper, as the state requests.",
        "Any court order or other document required for your eligibility category.",
      ],
    },
    {
      id: "special-situations",
      heading: "Common New York situations",
      paragraphs: [
        "Some records need a different application or an additional step. Review the official guidance for your situation before filing.",
      ],
      bullets: [
        "Name, date, or gender corrections: the state publishes a correction guide and separate forms for different changes.",
        "Adult adoptees: the state has a separate process for an original pre-adoption birth certificate.",
        "International use: an apostille or authentication is issued by the New York State Department of State.",
        "New York City births: use the city process, not the state application.",
        "Births outside New York: request the record from the state or country where the birth occurred.",
      ],
      links: [
        { label: "Read New York birth-correction instructions", href: NEW_YORK_CORRECTIONS_URL },
        {
          label: "Review the pre-adoption birth-certificate process",
          href: NEW_YORK_PREADOPTION_URL,
        },
        { label: "Review New York apostille guidance", href: NEW_YORK_APOSTILLE_URL },
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
      question: "Where do I find the official New York birth certificate requirements?",
      answer: `Use the [official New York State birth-certificate page](${NEW_YORK_BIRTH_URL}). It is the source of truth for eligibility, identification, application options, and current agency instructions.`,
    },
    {
      question: "Does New York State have New York City birth records?",
      answer: `No. The state Department of Health says it does not have birth records for New York City, which means Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Use the [New York City birth-certificate process](${NYC_BIRTH_URL}) for those boroughs.`,
    },
    {
      question: "Who can request a New York State birth certificate?",
      answer: `The person named on the certificate and a parent whose name appears on it may request a copy. A spouse, child, or other person may request one only by order of a New York State court. Review the [state eligibility rules](${NEW_YORK_BIRTH_URL}).`,
    },
    {
      question: "What identification does New York State require?",
      answer: `Provide a copy of one valid photo ID, such as a driver's license, state-issued nondriver photo ID, passport, or U.S. military photo ID, or two documents showing your name and address, such as a utility bill or a government letter dated within the last six months. If applying from a foreign country that requires a passport for travel, include a copy of your U.S. passport. See the [official requirements](${NEW_YORK_BIRTH_URL}).`,
    },
    {
      question: "Can I order online, by phone, or by mail?",
      answer: `New York State offers online and phone ordering through its vendor and a mail application. The state says a Social Security number will be asked when you order online or on paper. Compare the current options on the [state page](${NEW_YORK_BIRTH_URL}).`,
    },
    {
      question: "Can a local registrar issue the certificate?",
      answer: `The state says birth records are also available from the local registrar of vital statistics where the birth occurred. Contact the local registrar for the birth location and confirm its current service options. See [New York vital records](${NEW_YORK_VITAL_RECORDS_URL}).`,
    },
    {
      question: "What if I need the certificate for an apostille?",
      answer: `The New York State Department of State issues apostilles and authentications. If you order online or by phone, the state advises requesting a long form, also called a full or vault copy. For mail orders, the state can forward the certificate to the Department of State if you follow its instructions and include the separate payment it requires. Review the [state apostille guidance](${NEW_YORK_APOSTILLE_URL}) and the [Department of State instructions](${NEW_YORK_DOS_APOSTILLE_URL}).`,
    },
    {
      question: "What if the birth record needs a correction?",
      answer: `A correction is separate from ordering a standard copy. New York publishes a correction guide and different forms for name, date, gender, parentage, and other changes. Review the [birth-correction instructions](${NEW_YORK_CORRECTIONS_URL}) before ordering the corrected certificate.`,
    },
    {
      question: "What if I was adopted?",
      answer: `New York has a separate process for an original pre-adoption birth certificate. Review the [pre-adoption birth-certificate guidance](${NEW_YORK_PREADOPTION_URL}) to see whether you qualify and what the state requires.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
  ],
  sources: [
    { label: "New York State Department of Health – Birth certificates", href: NEW_YORK_BIRTH_URL },
    { label: "New York State – Birth correction instructions", href: NEW_YORK_CORRECTIONS_URL },
    {
      label: "New York State – Original pre-adoption birth certificate",
      href: NEW_YORK_PREADOPTION_URL,
    },
    { label: "New York State – Apostille for vital records", href: NEW_YORK_APOSTILLE_URL },
    {
      label: "New York State Department of State – Apostille and authentication",
      href: NEW_YORK_DOS_APOSTILLE_URL,
    },
    { label: "NYC Health – Birth certificates", href: NYC_BIRTH_URL },
    { label: "New York State – Vital records", href: NEW_YORK_VITAL_RECORDS_URL },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your New York Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

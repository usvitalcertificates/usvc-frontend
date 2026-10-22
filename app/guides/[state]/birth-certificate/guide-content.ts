export interface GuideLink {
  label: string;
  href: string;
}

export interface GuideSection {
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
  links?: GuideLink[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface BirthGuideContent {
  stateName: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  intro: string[];
  quickFacts: { label: string; value: string }[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  sources: GuideLink[];
  sourceChecked: string;
  ctaLabel: string;
  ctaNote: string;
}

const CALIFORNIA_BIRTH_URL =
  "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Obtaining-Certified-Copies-of-Birth-Records.aspx";
const AUTHORIZED_COPY_URL =
  "https://www.cdph.ca.gov/Programs/CHSI/Pages/Authorized-Copy-vs--Informational-Copy.aspx";
const COUNTY_DIRECTORY_URL =
  "https://www.cdph.ca.gov/Programs/CHSI/pages/county-registrars-and-recorders.aspx";
const AMENDMENT_URL =
  "https://www.cdph.ca.gov/Programs/CHSI/Pages/Amending-a-California-Birth-Record.aspx";
const FEES_URL = "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Fees.aspx";
const PROCESSING_URL =
  "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Processing-Times.aspx";
const APOSTILLE_URL = "https://www.sos.ca.gov/notary/request-apostille";

const USVC_HELP_COPY = [
  "USVC is an independent document assistance service, not a government agency. We provide a guided online request flow in plain language, review submitted information for completeness and inconsistencies, file the request with the agency, and help you track the request process.",
  "The order form shows the current USVC processing fee before you pay. Agency fees and any shipping charges are separate and are charged upon review and acceptance by the issuing agency.",
];

const CALIFORNIA_GUIDE: BirthGuideContent = {
  stateName: "California",
  metaTitle: "California Birth Certificate Guide: Steps and Requirements",
  metaDescription:
    "How California birth certificate requests work: authorized vs informational copies, state or county filing, documents to prepare, and USVC help.",
  subtitle:
    "Understand the request path, choose the right office, prepare the details the agency asks for, and find the official California resources.",
  intro: [
    "A California birth record is held by the office that registered the birth, so the right place to request a copy depends on where the birth happened. The state Vital Records office and the county office for the birth location can both help, but their request options and documentation rules can differ.",
    "This guide explains how the process usually works, what to confirm before you apply, and how USVC can help you submit a complete request. The official California resource remains the source of truth for current requirements.",
  ],
  quickFacts: [
    {
      label: "Issuing authority",
      value: "California Department of Public Health – Vital Records and county offices",
    },
    {
      label: "Record location",
      value: "The California county where the birth occurred",
    },
    {
      label: "Copy types",
      value: "Authorized and informational certified copies",
    },
    {
      label: "Where to request",
      value: "State mail or electronic options, or the county office",
    },
    {
      label: "Best first step",
      value: "Confirm current requirements on the official CDPH page",
    },
    {
      label: "USVC role",
      value: "Guided request preparation, review, filing, and tracking",
    },
  ],
  sections: [
    {
      id: "official-resource",
      heading: "Start with the official California resource",
      paragraphs: [
        "California's requirements are set by the issuing agency. The official CDPH page explains current request options, required documentation, eligibility, fees, processing, and delivery information. Those details can change without notice, so the agency page — not this guide — controls.",
        "Open the official page first and confirm which request path fits your situation before you gather documents or pay anything.",
      ],
      links: [
        { label: "Open the official California birth-record page", href: CALIFORNIA_BIRTH_URL },
      ],
    },
    {
      id: "copy-types",
      heading: "Understand the two certified copy types",
      paragraphs: [
        "California issues more than one type of certified birth record. An authorized copy can be used to establish the identity of the person named on the certificate. An informational copy is still a certified copy of the record, but it carries a notice that it is not valid for identity purposes.",
        "The issuing agency controls who may receive each type. Before you order, confirm which copy the receiving organization will accept — a passport office, DMV, school, insurer, or foreign authority may have its own rules.",
      ],
      links: [
        {
          label: "Compare authorized and informational copies",
          href: AUTHORIZED_COPY_URL,
        },
      ],
    },
    {
      id: "who-may-request",
      heading: "Who may request a California birth certificate",
      paragraphs: [
        "Eligibility is set by California law and enforced by the issuing office. It can be limited to the person named on the record, a parent or legal guardian, a spouse, a child, a sibling, a grandparent, a grandchild, a domestic partner, or another party authorized by law or court order. Representatives and agencies may have separate rules.",
        "Informational copies may be available to a wider group. Confirm your eligibility on the official page before you submit an application, especially if you are ordering for someone else.",
      ],
      links: [
        {
          label: "Read California's eligibility guidance",
          href: AUTHORIZED_COPY_URL,
        },
      ],
    },
    {
      id: "state-or-county",
      heading: "State office or county office?",
      paragraphs: [
        "The state Vital Records office handles California birth records and supports mail and electronic request options. County offices handle records for births that happened in their county and may offer local or in-person service.",
        "The county where the birth occurred is the key detail. If the birth happened outside California, request the record from that state or country instead — California cannot issue it.",
      ],
      links: [
        { label: "Find the county registrar or recorder", href: COUNTY_DIRECTORY_URL },
        { label: "Check state request options", href: CALIFORNIA_BIRTH_URL },
      ],
    },
    {
      id: "prepare",
      heading: "What to have ready before you start",
      paragraphs: [
        "Having the record details together makes the guided request faster and reduces the chance of a correction after filing. Use the name exactly as it appears on the birth record, and ask the agency before submitting if a spelling or date is uncertain.",
      ],
      bullets: [
        "The subject's full name at birth, including any suffix.",
        "Date of birth and the city and county of birth.",
        "Parents' names as shown on the record, including the mother's name at birth.",
        "Your relationship to the person named on the certificate.",
        "Your contact details and a deliverable shipping address.",
        "A government-issued photo ID and any court or legal documents that apply.",
        "A payment method for the agency fee; agency and shipping charges are separate from USVC's service fee.",
      ],
    },
    {
      id: "process",
      heading: "How a California request usually works",
      bullets: [
        "Confirm which copy type you need and whether you are eligible to receive it.",
        "Choose the state office or the county office for the birth location.",
        "Download the current official form and read the instructions for your request type.",
        "Gather the record details, identification, and any supporting documents the agency lists.",
        "Submit the request through the channel the agency currently supports.",
        "Keep your confirmation and track the request until the certificate arrives.",
        "Check the certificate when it arrives; contact the agency promptly if a detail needs correction.",
      ],
      note: "A missing or inconsistent detail can delay a request or produce a record that the receiving organization will not accept. Confirm the exact requirements on the official page before filing.",
    },
    {
      id: "common-situations",
      heading: "Common California situations",
      paragraphs: [
        "Some requests need a different path from a standard certified copy. Check the official guidance for your situation before you order.",
      ],
      bullets: [
        "Older records: the county recorder for the birth location may be the right office when a state record is not available.",
        "Adoption or sealed records: a court order may be required before an original sealed record can be released.",
        "Name corrections or amendments: amending the record is a separate process from ordering a copy. Complete the amendment first if you need the corrected version.",
        "International use: confirm whether the receiving country requires an apostille, and order the copy from an office whose signature can be authenticated.",
      ],
      links: [
        { label: "Read about amending a California birth record", href: AMENDMENT_URL },
        { label: "Check apostille requirements", href: APOSTILLE_URL },
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
      question: "Where do I find the official California birth certificate requirements?",
      answer: `Use the [official California birth-record page](${CALIFORNIA_BIRTH_URL}). It is the source of truth for current request options, required documentation, eligibility, fees, and processing information, all of which can change.`,
    },
    {
      question: "What is the difference between an authorized and an informational copy?",
      answer: `An authorized copy can be used to establish identity. An informational copy is certified but carries a notice that it is not valid for identity purposes. The agency controls who may receive each type. See [California's comparison page](${AUTHORIZED_COPY_URL}) before you order.`,
    },
    {
      question: "Who can request a California birth certificate?",
      answer: `Eligibility is set by California law and can be limited to the person named on the record, a parent or legal guardian, a spouse, a child, a sibling, a grandparent, a grandchild, a domestic partner, or another authorized party. Confirm your eligibility on the [official page](${CALIFORNIA_BIRTH_URL}).`,
    },
    {
      question: "Should I request from the state office or the county office?",
      answer: `The state office handles California birth records, while the county office handles births that occurred in that county. Check both for current options, and use the [county directory](${COUNTY_DIRECTORY_URL}) if you want to contact the county where the birth happened.`,
    },
    {
      question: "What information do I need before starting?",
      answer:
        "The subject's full name at birth, date of birth, city and county of birth, parents' names, your relationship to the subject, your contact details, and a deliverable shipping address. The agency page lists the exact documents it requires.",
    },
    {
      question:
        "Can I request a California birth certificate if the birth happened in another state?",
      answer:
        "No. California can only issue records for births that occurred in California. Request the certificate from the state or country where the birth happened.",
    },
    {
      question: "What if I need the certificate for use in another country?",
      answer: `The receiving country may require an apostille or authentication. Check the [California Secretary of State apostille guidance](${APOSTILLE_URL}) and confirm the receiving authority's requirements before ordering.`,
    },
    {
      question: "What if the name or date on the birth record is wrong?",
      answer: `A correction is handled as an amendment, not as a standard copy request. Review the [birth-record amendment guidance](${AMENDMENT_URL}) before ordering the corrected certificate.`,
    },
    {
      question: "Can USVC file the request for me?",
      answer:
        "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files the request with the agency, and helps you track the process. We are an independent assistance service, not a government agency.",
    },
    {
      question: "How long does the USVC part take?",
      answer:
        "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary, so confirm current times on the official agency page before you plan around a deadline.",
    },
  ],
  sources: [
    {
      label: "CDPH – Obtaining certified copies of birth certificates",
      href: CALIFORNIA_BIRTH_URL,
    },
    { label: "CDPH – Authorized copy vs. informational copy", href: AUTHORIZED_COPY_URL },
    { label: "CDPH – County registrar and recorder directory", href: COUNTY_DIRECTORY_URL },
    { label: "CDPH – Birth record amendments", href: AMENDMENT_URL },
    { label: "CDPH – Vital record fees", href: FEES_URL },
    { label: "CDPH – Processing times", href: PROCESSING_URL },
    { label: "California Secretary of State – Apostille", href: APOSTILLE_URL },
  ],
  sourceChecked: "October 22, 2026",
  ctaLabel: "Start Your California Request",
  ctaNote:
    "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
};

function genericGuide(stateName: string, officialUrl: string): BirthGuideContent {
  return {
    stateName,
    metaTitle: `How to Get a ${stateName} Birth Certificate`,
    metaDescription: `Official guidance plus USVC help for a ${stateName} birth certificate request. Eligibility, fees, steps.`,
    subtitle: `A starting point for understanding a ${stateName} birth-certificate request and the official agency resource.`,
    intro: [
      `A ${stateName} birth certificate is issued under the rules of the ${stateName} issuing agency — so the record you need is held where the birth happened, not necessarily where you live now.`,
      "This guide explains how to check the current official requirements and how USVC can help you submit a complete request.",
    ],
    quickFacts: [
      { label: "Issuing authority", value: `${stateName} vital records office` },
      { label: "Record location", value: "Where the birth occurred" },
      { label: "Where to request", value: "The official state or local office" },
      { label: "Best first step", value: "Confirm current requirements on the official page" },
    ],
    sections: [
      {
        id: "official-resource",
        heading: `Start with the official ${stateName} resource`,
        paragraphs: [
          "The official issuing-agency page explains its current request options, required documentation, eligibility, fees, and processing information. Those details can change without notice, so the agency page — not this guide — is the source of truth.",
          "Open it first and confirm which request path fits your situation before you gather documents or pay anything.",
        ],
        links: [{ label: `Open the official ${stateName} birth-record page`, href: officialUrl }],
      },
      {
        id: "process",
        heading: `How a ${stateName} request usually works`,
        paragraphs: [
          `Most requests follow the same broad pattern. Confirm on the agency page whether you are eligible to receive the record. Then gather the subject's full name at birth, date and place of birth, parents' names, your contact details, and a deliverable shipping address. Submit the request through the channel the agency currently supports and keep your confirmation so you can track it.`,
        ],
      },
      {
        id: "prepare",
        heading: "What to have ready before you start",
        paragraphs: [
          "Having these details on hand makes the guided flow take most people about 10 minutes. If any detail is uncertain — a spelling, an exact date, a parent's name — check the agency's instructions for what it accepts before you submit, since corrections after filing can add delays.",
        ],
        bullets: [
          "The subject's full name at birth and date of birth.",
          "The city or county where the birth occurred.",
          "Parents' names as shown on the record.",
          "Your relationship to the subject.",
          "Your contact details and a deliverable shipping address.",
        ],
      },
      {
        id: "usvc-help",
        heading: "How USVC can help",
        paragraphs: USVC_HELP_COPY,
      },
    ],
    faqs: [
      {
        question: `Where do I find the official ${stateName} birth-certificate requirements?`,
        answer: `On the [official issuing-agency page](${officialUrl}) — it is the source of truth for current request options, required documentation, eligibility, fees, and processing information, all of which can change.`,
      },
      {
        question: "What information should I have ready before I start?",
        answer:
          "Typically the subject's full name at birth, date and place of birth, and parents' names, plus your contact details and a deliverable shipping address. The agency page lists the exact documents it requires.",
      },
      {
        question: "How long does a request take?",
        answer:
          "Our guided USVC form takes most people about 10 minutes. Agency processing and delivery times vary by state — confirm current times on the official agency page before you plan around a deadline.",
      },
      {
        question: "Can USVC file the request for me?",
        answer:
          "Yes. USVC provides a guided online request flow, reviews your submitted information for completeness, files it with the agency, and helps you track the request process. We are an independent assistance service, not a government agency.",
      },
    ],
    sources: [{ label: `${stateName} official birth-record resource`, href: officialUrl }],
    sourceChecked: "September 30, 2026",
    ctaLabel: `Start Your ${stateName} Request`,
    ctaNote:
      "Most people finish the guided form in about 10 minutes. Agency fees and shipping are separate from the USVC service fee.",
  };
}

export function getBirthGuideContent(
  state: string,
  stateName: string,
  officialUrl: string,
): BirthGuideContent {
  if (state === "california") return CALIFORNIA_GUIDE;
  return genericGuide(stateName, officialUrl);
}

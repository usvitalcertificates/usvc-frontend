import type { BirthGuideContent } from "./[state]/birth-certificate/guide-types";
import { RECORD_GUIDE_DATA } from "./record-guide-data";

export const RECORD_GUIDE_TYPES = [
  "death-certificate",
  "marriage-certificate",
  "divorce-certificate",
] as const;
export type RecordGuideType = (typeof RECORD_GUIDE_TYPES)[number];
export const RECORD_GUIDE_STATES = Object.keys(RECORD_GUIDE_DATA);
export function getRecordGuideContent(
  state: string,
  certificate: string,
): BirthGuideContent | undefined {
  if (
    !Object.hasOwn(RECORD_GUIDE_DATA, state) ||
    !RECORD_GUIDE_TYPES.some((type) => type === certificate)
  )
    return undefined;
  const entry = RECORD_GUIDE_DATA[state as keyof typeof RECORD_GUIDE_DATA];
  const kind = certificate.replace("-certificate", "") as "death" | "marriage" | "divorce";
  const record = entry.records[kind];
  return buildGuideContent(state, entry.name, kind, record);
}

type GuideRecord = {
  url: string;
  authority: string;
  record: string;
  access: string;
  route: string;
  detail: string;
  extra: readonly (readonly [string, string])[];
};
export function buildGuideContent(
  state: string,
  name: string,
  kind: "birth" | "death" | "marriage" | "divorce",
  record: GuideRecord,
): BirthGuideContent {
  const title = kind.charAt(0).toUpperCase() + kind.slice(1);
  const official = `[official ${name} ${kind}-record resource](${record.url})`;
  const source = { label: `${name}: official ${kind}-record resource`, href: record.url };
  const extras = record.extra.map(([label, href]) => ({ label, href }));
  const details =
    kind === "birth"
      ? [
          "The subject’s full name at birth and any recorded name changes.",
          "Date of birth and city or county of birth.",
          "Parents’ names as requested by the application, including prior surnames.",
          "Your identity, relationship and any authorization required by the issuing office.",
        ]
      : kind === "death"
        ? [
            "The deceased person’s full recorded name, including known name variations.",
            "Date and place of death, including the city and county.",
            "Your relationship or documented reason for requesting the record.",
            "The certificate version the receiving institution needs, including whether cause of death is required.",
          ]
        : [
            "Both parties’ names as recorded at the time of the event, including prior surnames if relevant.",
            `The ${kind} date and the county holding the ${kind === "marriage" ? "license" : "court case"}.`,
            kind === "divorce"
              ? "The case or docket number, if known, and whether you need the decree or an event certificate."
              : "The license location and whether the record is public or has a special confidential status.",
            "The exact document requested by the organization that will receive it.",
          ];
  const distinction =
    kind === "birth"
      ? "A hospital souvenir, baptismal record or online index is not an agency-certified birth certificate. Ask the receiving organization whether it requires a copy showing parent information. Adoption, parentage changes and access to an original pre-adoption record follow separate agency procedures; a routine copy order does not change the registered record."
      : kind === "death"
        ? "An obituary, burial entry or online index can help identify an event, but it is not a certified death certificate. Before ordering multiple copies, ask each institution whether it needs an original certified copy or can return the copy after review. Keep documents containing medical details and identifiers secure."
        : kind === "marriage"
          ? "A marriage license authorizes a ceremony; a recorded marriage document provides evidence of the completed event. A state verification or an online index may confirm only selected facts. Ask the receiving organization for its exact document requirements before choosing between a county copy and a state product."
          : "A divorce certificate or verification generally describes the event. A decree or final judgment is the court document containing the decision and, where applicable, its terms. If an organization asks for the judgment, do not substitute an index result or a brief certificate without first checking with that organization.";
  return {
    stateName: name,
    metaTitle: `${name} ${title} Certificate: How to Request a Copy`,
    metaDescription: `Find the right ${name} ${kind} record: official offices, copy types, eligibility checks, request steps, corrections, and sources.`,
    subtitle: `Find the right ${name} record office, choose the document you need, and prepare a complete ${kind}-record request.`,
    intro: [
      `${record.route} ${record.record}`,
      `This guide explains the official record route and how to prepare your request. It concerns copies of an existing ${kind} record${kind === "divorce" ? ", not starting or completing a divorce" : ""}. Issuing offices control access and availability; USVC is an independent assistance service.`,
    ],
    quickFacts: [
      { label: "Record holder", value: record.authority },
      { label: "Document choice", value: record.record },
      { label: "Access", value: record.access },
      { label: "Coverage and routing", value: record.detail },
      {
        label: "Best first step",
        value: "Confirm the exact document and issuing office before paying.",
      },
      {
        label: "Fees and timing",
        value:
          "Check the issuing office’s live instructions; service and delivery charges may be separate.",
      },
      {
        label: "USVC role",
        value:
          "Independent application guidance and review; contact support to confirm service for your record.",
      },
    ],
    sections: [
      {
        id: "official-resource",
        heading: `Start with the official ${name} resource`,
        paragraphs: [
          `Open the ${official} before preparing an application. Use the record holder’s own instructions to confirm the document name, where it is kept and which request method applies. A state office and a county court may offer different products for the same event.`,
          "Check that the office covers your event location. Living in a different state does not move the original record to your current home state. If you have only a historical index entry, use it as a lead and confirm the issuing office before ordering.",
        ],
        links: [source, ...extras],
      },
      {
        id: "record-type",
        heading: `Choose the right ${kind} document`,
        paragraphs: [record.record, distinction],
        note: "Confirm acceptance with the organization requesting the document. This guide does not decide whether a particular copy will satisfy its requirements.",
      },
      {
        id: "who-may-request",
        heading: "Who may request a copy and what to prove",
        paragraphs: [
          record.access,
          "Use the selected office’s application to determine whether you must show identity, relationship, authorization or a specific need. Requirements for a certified copy may differ from an informational copy or verification. An unrestricted product does not make every document in a court file available.",
          "If your current name differs from the name on supporting documents, check what linking evidence the office accepts. Use copies or originals only as directed. Do not send extra identity documents or sensitive identifiers that the official application does not request.",
        ],
        links: [source],
      },
      {
        id: "prepare",
        heading: `What to prepare for your ${name} request`,
        paragraphs: [
          "Start from the record, a prior copy or reliable family papers rather than guessing. Small differences in names, event dates and counties can send a search to the wrong file. If a detail is uncertain, check the office’s search procedure before entering an estimated value.",
        ],
        bullets: [
          ...details,
          "Your contact and return-delivery details, copy quantity and any documents the official instructions require.",
        ],
        note: "Keep application documents private. Do not place identity documents, record images or payment details in public messages.",
      },
      {
        id: "where-to-file",
        heading: `Where to request the ${name} record`,
        paragraphs: [
          record.route,
          record.detail,
          `Follow the channels listed by the actual issuing office. If it links to an online provider, start from the official page so you can distinguish the provider’s charges from agency charges. For a county or court request, confirm its own mail, online or counter options rather than assuming the state process applies.`,
        ],
        links: [source, ...extras],
      },
      {
        id: "request-steps",
        heading: "Complete and submit the request",
        bullets: [
          `Confirm that the receiving organization accepts the ${kind} document you have selected.`,
          "Identify the office holding the record and check its current application and coverage.",
          "Complete all required fields using recorded names and event details; explain uncertain search information as directed.",
          "Attach only the required evidence and choose a delivery method supported by the issuing office.",
          "Review the search, certification, additional-copy and delivery charges before paying.",
          "Keep your receipt and reference number, and follow the office’s status or deficiency instructions.",
        ],
        paragraphs: [
          "A request for a copy does not create or amend the underlying record. If the event has not been registered, or a court judgment has not been entered, ask the relevant office about that issue before repeating a certificate order.",
        ],
      },
      {
        id: "fees-timing",
        heading: "Fees, recent records and delivery",
        paragraphs: [
          "Check the official fee schedule on the day you apply. Search fees, certification, extra copies and delivery can be charged separately; a search may have a charge even if no matching record is found. Review the office’s refund policy before requesting additional search years.",
          "Separate registration time, application review, issuance and shipping when planning around a deadline. Paying for faster delivery does not guarantee that an unregistered record will be available or that missing documentation can be bypassed. Contact the issuing office if a newly recorded event cannot yet be located.",
          "If you use USVC, review the processing fee displayed in the form and confirm the record-specific service with support. Agency and shipping fees are separate. An official source link in this guide does not imply government endorsement of USVC.",
        ],
        links: [source],
      },
      {
        id: "corrections",
        heading: "Incorrect details or a record that cannot be found",
        paragraphs: [
          "A new copy normally reproduces the existing record. If the official record itself is wrong, ask its custodian about an amendment or correction before buying another copy. A change to a request form does not change a court judgment or an agency record.",
          "For a no-record result, check name variants, the event date, the license or case location and whether the event falls within that office’s holdings. Ask what was searched and which office to try next. Keep the response so a later search can address the actual gap instead of repeating the same request.",
          kind === "divorce"
            ? "If the decree and event certificate disagree, contact the court and the certificate custodian to learn which filing needs attention. Questions about changing the judgment itself should go to the court or a qualified legal professional."
            : "Use the official correction instructions for supporting evidence and signatures. The documents needed to correct a record can differ from those needed simply to order a copy.",
        ],
        links: extras.length ? extras : [source],
      },
      {
        id: "international-use",
        heading: "Using the record outside the United States",
        paragraphs: [
          "Ask the receiving authority whether it requires a certified copy, translation, apostille or authentication. Those are separate requirements, and the document must be suitable for the destination before you pay for extra processing. Do not alter or detach the certification from an issued record.",
          "Use the issuing office and the relevant state authentication office to confirm the sequence. A notarized photocopy is not automatically a substitute for an agency- or court-certified record. This guide does not promise acceptance by a foreign authority.",
        ],
      },
      {
        id: "usvc-help",
        heading: "How USVC can help",
        paragraphs: [
          "USVC is an independent document assistance service, not the issuing agency or a court. Our guided forms help organize request information and our team reviews submissions for missing details and inconsistencies. The government office decides eligibility, searches its holdings and issues the official record.",
          `Before starting, confirm that USVC can assist with your particular ${name} ${kind} record and document type. A guide explains available official routes; it is not a promise that every court document, historical record or special copy can be obtained through our form. You can also request records directly from the official custodian.`,
        ],
        links: [
          { label: "Ask USVC about your record", href: "/contact" },
          { label: `View ${name} record options`, href: `/state/${state}` },
        ],
      },
    ],
    faqs: [
      {
        question: `Where do I get a ${name} ${kind} record?`,
        answer: `${record.route} See the ${official} for current instructions.`,
      },
      {
        question:
          kind === "birth"
            ? "Is a hospital birth record the same as a certified birth certificate?"
            : kind === "divorce"
              ? "Is a divorce certificate the same as the decree?"
              : kind === "marriage"
                ? "Is a marriage certificate the same as a license or verification?"
                : "Is a death certificate the same as an obituary or index entry?",
        answer: record.record + " Ask the receiving organization which document it requires.",
      },
      {
        question: "Who may order, and is identification required?",
        answer: record.access + ` Confirm the requirements on the ${official}.`,
      },
      { question: "Which years or local offices should I check?", answer: record.detail },
      {
        question: "What information should I gather before applying?",
        answer:
          kind === "birth"
            ? "Prepare the recorded name at birth, date and place of birth, parents’ names and evidence of your identity and eligibility. Check separate instructions for adoption or delayed registration."
            : kind === "death"
              ? "Prepare the deceased person’s recorded name, date and place of death, your relationship or request purpose, and the copy type needed. Add evidence only as the chosen office requires."
              : `Prepare both parties’ recorded names, the ${kind} date and the license or court county. For a court request, include the case number if known and specify the exact document you need.`,
      },
      {
        question: "Can I order while living outside the state?",
        answer:
          "Start with the office holding the original record and check its remote-request options and delivery rules. Your current address does not determine the record’s custodian.",
      },
      {
        question: "How much will it cost and how long will it take?",
        answer: `Use the live fee and processing information on the ${official}. Search, extra-copy and delivery charges may differ. USVC service charges are separate; no delivery date is guaranteed by this guide.`,
      },
      {
        question: "What if there is a mistake in the record?",
        answer:
          "Ask the custodian about corrections before ordering another copy. An application correction does not amend the underlying record, and court judgments may require a separate court process.",
      },
      {
        question: "What if the office cannot locate the record?",
        answer:
          "Check the names, event date, license or court location and office coverage. Keep the search response and ask which office or record set to try next before repeating a paid search.",
      },
      {
        question: "Can USVC obtain every document described here?",
        answer:
          "Confirm the specific record and service with support first. These guides cover official routes, including products that may require direct requests to a county or court. USVC is an independent assistance service, and the issuing office controls eligibility and issuance.",
      },
    ],
    sources: [source, ...extras],
    sourceChecked: "10/27/2026",
    ctaLabel: kind === "birth" ? `Start Your ${name} Request` : `Ask About Your ${name} Request`,
    ctaNote:
      "Confirm the record type and service before ordering. Agency and shipping charges are separate from any USVC processing fee.",
  };
}

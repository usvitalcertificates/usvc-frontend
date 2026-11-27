import type { GuideFaq, GuideLink, GuideSection } from "./[state]/birth-certificate/guide-types";

/**
 * Cross-state topic guides for high-volume questions that are not tied to a
 * single state ("death certificate cost", "abstract birth certificate",
 * "replace a marriage certificate"). No government fee amounts or agency
 * processing times are stated: those are set by each issuing office. Per the
 * price disclosure policy, USVC prices appear only on the order form.
 */
export interface TopicGuide {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  breadcrumb: string;
  intro: string[];
  quickFacts: { label: string; value: string }[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  sources: GuideLink[];
  sourceChecked: string;
  related: GuideLink[];
}

const CHECKED = "11/27/2026";
const CDC_W2W = {
  label: "CDC: Where to Write for Vital Records",
  href: "https://www.cdc.gov/nchs/w2w/index.htm",
};

export const TOPIC_GUIDES: Record<string, TopicGuide> = {
  "death-certificate-cost": {
    slug: "death-certificate-cost",
    metaTitle: "Death Certificate Cost: Fees Explained by Type",
    metaDescription:
      "What a certified death certificate costs: the agency fee set by each state or county, extra copies, shipping, and USVC’s separate service fee.",
    h1: "How Much Does a Death Certificate Cost?",
    subtitle:
      "Understand the separate charges behind a certified death certificate before you order copies.",
    breadcrumb: "Death certificate cost",
    intro: [
      "The cost of a certified death certificate is set by the state or local office that holds the record, so it differs by state and sometimes by county. Many offices charge one price for the first copy and a different price for each additional copy ordered at the same time.",
      "If you use USVC, our service fee is separate from the agency fee and is shown on the order form before you pay. Agency and shipping charges are billed separately after review and acceptance.",
    ],
    quickFacts: [
      {
        label: "Who sets the agency fee",
        value: "The issuing state or local vital records office",
      },
      { label: "Additional copies", value: "Often priced differently from the first copy" },
      {
        label: "Other charges",
        value: "Shipping, expedited delivery, or vendor fees where offered",
      },
      {
        label: "USVC service fee",
        value: "Separate; shown on the order form before you pay",
      },
      {
        label: "Best first step",
        value: "Check the official fee page for the state where the death occurred",
      },
    ],
    sections: [
      {
        id: "what-you-pay-for",
        heading: "What you are paying for",
        bullets: [
          "Agency fee: charged by the office that searches for and certifies the record. Many offices keep it as a search fee even if no record is found.",
          "Additional copies: estates, banks, insurers and pension plans may each want their own certified copy, so ordering several at once can avoid a second request.",
          "Shipping: tracked or expedited delivery, where offered, is usually an extra charge.",
          "Service fees: online vendors and assistance services, including USVC, charge their own fee in addition to the agency fee.",
        ],
      },
      {
        id: "how-many-copies",
        heading: "How many copies do you need?",
        paragraphs: [
          "Before ordering, list every organization that will ask for proof of death and ask whether it needs to keep an original certified copy or can return it after review. Some accept a photocopy for routine updates.",
          "Also ask whether the organization needs the cause of death shown. Some states issue different versions, and access to the cause-of-death version can be restricted.",
        ],
      },
      {
        id: "find-official-fees",
        heading: "Where to find the official fee",
        paragraphs: [
          "Use the official fee page for the state where the death occurred, not where the person lived. Our state guides link to each official office.",
        ],
        links: [
          { label: "Texas death certificate guide", href: "/guides/texas/death-certificate" },
          { label: "Florida death certificate guide", href: "/guides/florida/death-certificate" },
          { label: "New York death certificate guide", href: "/guides/new-york/death-certificate" },
          {
            label: "California death certificate guide",
            href: "/guides/california/death-certificate",
          },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
      {
        id: "direct-or-service",
        heading: "Ordering directly vs using a service",
        paragraphs: [
          "You can always request a death certificate directly from the issuing office, which may cost less. USVC is an independent assistance service, not a government agency: we provide a guided application, review your details for missing information before filing, and online order tracking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do death certificate fees differ between states?",
        answer:
          "Each state, and in some states each county, sets its own fee for searching and certifying vital records. Check the official office for the state where the death occurred.",
      },
      {
        question: "Is the fee refunded if no record is found?",
        answer:
          "Many offices treat the fee as a search fee and do not refund it when no record is found. Check the issuing office’s policy before ordering.",
      },
      {
        question: "Does USVC’s fee include the government fee?",
        answer:
          "No. The USVC service fee is separate and is shown on the order form before you pay. The agency fee and any shipping charges are billed separately after review and acceptance by the issuing agency.",
      },
      {
        question: "Is a death certificate cheaper if I order it directly?",
        answer:
          "Usually, yes. Ordering directly from the issuing office avoids a service fee. A service may still be useful if you want guided help and a review before filing.",
      },
    ],
    sources: [CDC_W2W],
    sourceChecked: CHECKED,
    related: [
      {
        label: "Abstract vs certified birth certificate",
        href: "/guides/abstract-birth-certificate",
      },
      {
        label: "How to replace a marriage certificate",
        href: "/guides/replace-marriage-certificate",
      },
    ],
  },
  "abstract-birth-certificate": {
    slug: "abstract-birth-certificate",
    metaTitle: "Abstract Birth Certificate vs Certified Long Form",
    metaDescription:
      "What an abstract (short form) birth certificate is, how it differs from a full certified copy, and how to check which one your agency accepts.",
    h1: "What Is an Abstract Birth Certificate?",
    subtitle:
      "Learn the difference between an abstract (short form) and a full certified birth record before you order.",
    breadcrumb: "Abstract birth certificate",
    intro: [
      "An abstract birth certificate, sometimes called a short form, is a certified document that shows selected facts from the birth record, such as the name, date and place of birth. A full certified copy, often called a long form, reproduces more of the original record, which can include parent details.",
      "Which version you need depends on the organization receiving it, not on the state. Always ask that organization before ordering.",
    ],
    quickFacts: [
      { label: "Abstract / short form", value: "Certified summary of selected birth facts" },
      { label: "Long form / full copy", value: "Fuller certified copy of the registered record" },
      { label: "Who decides", value: "The organization that will receive the certificate" },
      { label: "Naming varies", value: "States use different names for each version" },
      {
        label: "Best first step",
        value: "Ask the receiving organization which version it accepts",
      },
    ],
    sections: [
      {
        id: "names-by-state",
        heading: "The same idea, different names by state",
        paragraphs: [
          "States label their products differently. For example, Ohio’s online portal issues an abstract birth certificate, while its mail-in and local-office routes can provide a certified record. Texas offers a long form and a short form, where the short form is a certified abstract.",
        ],
        links: [
          {
            label: "Ohio birth certificate guide: certified vs abstract",
            href: "/guides/ohio/birth-certificate",
          },
          {
            label: "Texas birth certificate guide: long vs short form",
            href: "/guides/texas/birth-certificate",
          },
        ],
      },
      {
        id: "when-full-copy",
        heading: "When a full certified copy is usually safer",
        bullets: [
          "Passport, citizenship, dual-citizenship or other international matters.",
          "Situations where parent names or other record details must be shown.",
          "Genealogy, estate or legal proceedings that rely on the full record.",
        ],
        note: "These are common examples, not rules. Confirm the requirement with the receiving organization.",
      },
      {
        id: "not-a-certificate",
        heading: "Documents that are not certified birth certificates",
        paragraphs: [
          "A hospital souvenir certificate, baptismal record, or an online index entry is not an agency-certified birth certificate, even if it looks official.",
        ],
      },
      {
        id: "order",
        heading: "How to request the right version",
        paragraphs: [
          "Find the state where the birth happened, read its guide, and choose the document type that matches the receiving organization’s requirement. USVC can help you prepare a guided request and review it before filing; you can also apply directly with the official office.",
        ],
        links: [
          { label: "All state certificate guides", href: "/guides" },
          { label: "Find your state", href: "/find-your-state" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is an abstract birth certificate a certified document?",
        answer:
          "Yes, when it is issued by the official vital records office it is certified. It simply contains fewer details than a full copy of the record.",
      },
      {
        question: "Is a short form the same as an abstract?",
        answer:
          "In many states, yes. The labels differ, so check the issuing office’s product description for the details shown.",
      },
      {
        question: "Can I use an abstract for a passport?",
        answer:
          "Check the current U.S. Department of State passport requirements before ordering. When the details required are not shown on an abstract, request a full certified copy instead.",
      },
      {
        question: "Which version should I order if I am unsure?",
        answer:
          "Ask the receiving organization first. If you cannot confirm, a full certified copy is the version accepted most widely.",
      },
    ],
    sources: [
      CDC_W2W,
      {
        label: "Ohio Department of Health: how to order certificates",
        href: "https://odh.ohio.gov/know-our-programs/vital-statistics/how-to-order-certificates",
      },
      {
        label: "Texas DSHS: birth records",
        href: "https://www.dshs.texas.gov/vital-statistics/birth-records",
      },
    ],
    sourceChecked: CHECKED,
    related: [
      { label: "Death certificate cost", href: "/guides/death-certificate-cost" },
      {
        label: "How to replace a marriage certificate",
        href: "/guides/replace-marriage-certificate",
      },
    ],
  },
  "replace-marriage-certificate": {
    slug: "replace-marriage-certificate",
    metaTitle: "How to Replace a Lost Marriage Certificate",
    metaDescription:
      "Lost your marriage certificate? How to get a certified duplicate copy from the county or state office that holds your marriage record.",
    h1: "How to Replace a Lost Marriage Certificate",
    subtitle:
      "Get a certified copy of your recorded marriage from the office that holds it. You do not need a new license.",
    breadcrumb: "Replace a marriage certificate",
    intro: [
      "If your marriage certificate is lost, damaged or you need another original, you request a new certified copy of the recorded marriage. You do not apply for a new marriage license: a license authorizes a ceremony, while the certificate is the record that the marriage took place.",
      "Marriage records are usually held by the county or local office where the license was issued. Many states also keep a state-level copy for certain years.",
    ],
    quickFacts: [
      { label: "What to request", value: "A certified copy of the recorded marriage" },
      {
        label: "Where it is held",
        value: "Usually the county or local office that issued the license",
      },
      { label: "State copies", value: "Available in many states for certain years" },
      { label: "Have ready", value: "Both names at marriage, date and county of the marriage" },
      { label: "Best first step", value: "Identify the county where the license was issued" },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to get a replacement copy",
        bullets: [
          "Find the county and state where the marriage license was issued; this can differ from where the ceremony took place in some states.",
          "Check whether the county office or the state vital records office holds your year of marriage.",
          "Gather both parties’ names as recorded, including prior surnames, and the marriage date.",
          "Check the eligibility and identification rules; some states limit certified copies or keep confidential marriages separate.",
          "Request a certified copy from the official office, or use a guided assistance service.",
        ],
      },
      {
        id: "state-guides",
        heading: "State marriage certificate guides",
        paragraphs: [
          "Each guide links to the official office and explains county vs state records.",
        ],
        links: [
          {
            label: "New York marriage certificate guide",
            href: "/guides/new-york/marriage-certificate",
          },
          {
            label: "New Jersey marriage certificate guide",
            href: "/guides/new-jersey/marriage-certificate",
          },
          { label: "Ohio marriage certificate guide", href: "/guides/ohio/marriage-certificate" },
          {
            label: "Virginia marriage certificate guide",
            href: "/guides/virginia/marriage-certificate",
          },
          {
            label: "California marriage certificate guide",
            href: "/guides/california/marriage-certificate",
          },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
      {
        id: "stolen",
        heading: "If your certificate was stolen",
        paragraphs: [
          "Ordering a new certified copy does not cancel the old one. If you believe your documents are being misused, contact the issuing office for its guidance.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need a new marriage license if I lost my certificate?",
        answer:
          "No. A license is only needed to get married. To replace proof of an existing marriage, request a certified copy of the recorded marriage.",
      },
      {
        question: "Is a duplicate marriage certificate the same as the original?",
        answer:
          "A certified copy issued by the official office is accepted as proof of marriage in the same way. Some organizations specify a particular version, so ask before ordering.",
      },
      {
        question: "Where do I order a copy if I married in another state?",
        answer:
          "Order from the state and county where the marriage license was issued, not where you live now.",
      },
      {
        question: "Can USVC help me get a replacement marriage certificate?",
        answer:
          "Yes, in states where we accept marriage certificate requests. USVC is an independent service, not a government agency. You can also apply directly with the official office.",
      },
    ],
    sources: [CDC_W2W],
    sourceChecked: CHECKED,
    related: [
      { label: "Death certificate cost", href: "/guides/death-certificate-cost" },
      {
        label: "Abstract vs certified birth certificate",
        href: "/guides/abstract-birth-certificate",
      },
    ],
  },
};

export const TOPIC_GUIDE_SLUGS = Object.keys(TOPIC_GUIDES);

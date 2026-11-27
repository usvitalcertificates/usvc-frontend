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
  "how-to-get-death-certificate": {
    slug: "how-to-get-death-certificate",
    metaTitle: "How to Get a Death Certificate: Who Can Order",
    metaDescription:
      "How to get a certified death certificate: which office holds it, who can order, what information and ID you need, and when a funeral home can help.",
    h1: "How to Get a Death Certificate",
    subtitle:
      "Find the right office, confirm you are eligible, and prepare the details you need to request certified copies.",
    breadcrumb: "How to get a death certificate",
    intro: [
      "Death certificates are issued by the vital records office of the state, or in some places the city or county, where the death occurred. The federal government does not issue death certificates.",
      "Most states limit certified copies, especially copies showing the cause of death, to close family members, legal representatives and people who can document a legal interest. Shortly after a death, the funeral director handling arrangements can often order copies for the family.",
    ],
    quickFacts: [
      { label: "Where to order", value: "The vital records office where the death occurred" },
      {
        label: "Who can order",
        value:
          "Commonly immediate family, legal representatives and people with a documented interest",
      },
      {
        label: "Soon after a death",
        value: "In many places the funeral director can order copies",
      },
      {
        label: "Have ready",
        value: "Full name, date and place of death, your relationship and photo ID",
      },
      {
        label: "Best first step",
        value: "Identify the state, and county if needed, where the death occurred",
      },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to get a death certificate",
        bullets: [
          "Identify the state, and county if needed, where the death occurred, not where the person lived.",
          "Check that office’s eligibility rules for the version you need, especially if the cause of death must be shown.",
          "Gather the details: the person’s full name, date and place of death, date of birth if known, your relationship and the purpose of the request.",
          "Prepare a valid photo ID and any documents that prove your relationship or legal interest.",
          "Decide how many certified copies you need, then request them from the official office or use a guided service.",
        ],
      },
      {
        id: "who-can-order",
        heading: "Who can order a certified copy",
        paragraphs: [
          "Eligibility is set by each state. A common pattern is the spouse, parent, adult child, sibling, grandparent or grandchild of the person who died, plus legal custodians and estate representatives. Others may need a court order or a document such as a will or insurance policy showing their interest.",
          "Some states issue copies without the cause of death to a wider group of applicants, while copies showing the cause of death stay restricted.",
        ],
      },
      {
        id: "funeral-home",
        heading: "Ordering through the funeral home",
        paragraphs: [
          "In many places the funeral director registers the death and can order certified copies for eligible family members during a period after the death. This is often the quickest route for the first copies. Later copies are ordered from the vital records office.",
        ],
      },
      {
        id: "state-guides",
        heading: "State death certificate guides",
        paragraphs: ["Each guide links to the official office and its eligibility rules."],
        links: [
          { label: "Texas death certificate guide", href: "/guides/texas/death-certificate" },
          { label: "Florida death certificate guide", href: "/guides/florida/death-certificate" },
          { label: "New York death certificate guide", href: "/guides/new-york/death-certificate" },
          { label: "Ohio death certificate guide", href: "/guides/ohio/death-certificate" },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
    ],
    faqs: [
      {
        question: "Where do I get a death certificate?",
        answer:
          "From the vital records office of the state where the death occurred, or the local office that holds the record. The federal government does not issue death certificates.",
      },
      {
        question: "Who is allowed to get a death certificate?",
        answer:
          "It depends on the state. Commonly, immediate family members, legal representatives and people with a documented legal interest can order certified copies. Copies showing the cause of death are usually the most restricted.",
      },
      {
        question: "Can the funeral home order death certificates for me?",
        answer:
          "Often, yes. In many places the funeral director who handled the arrangements can order copies for eligible family members for a period after the death.",
      },
      {
        question: "What information do I need?",
        answer:
          "Typically the person’s full name, date and place of death, your relationship to them, the reason for the request and a valid photo ID.",
      },
      {
        question: "Can USVC help me get a death certificate?",
        answer:
          "Yes, in states where we accept death certificate requests. USVC is an independent service, not a government agency. You can also apply directly with the official office.",
      },
    ],
    sources: [
      CDC_W2W,
      {
        label: "CDC: guidelines for requesting vital records",
        href: "https://www.cdc.gov/nchs/w2w/guidelines.htm",
      },
      {
        label: "Minnesota Department of Health: death certificates",
        href: "https://www.health.state.mn.us/people/vitalrecords/deathreg/index.html",
      },
      {
        label: "Florida Department of Health: death certificates",
        href: "https://www.floridahealth.gov/certificates/certificates/death/",
      },
      {
        label: "NYC Health: death certificates",
        href: "https://www.nyc.gov/site/doh/services/birth-death-records-death.page",
      },
    ],
    sourceChecked: CHECKED,
    related: [
      { label: "Death certificate cost", href: "/guides/death-certificate-cost" },
      { label: "Apostille for a birth certificate", href: "/guides/apostille-birth-certificate" },
    ],
  },
  "apostille-birth-certificate": {
    slug: "apostille-birth-certificate",
    metaTitle: "Apostille for a Birth Certificate: How It Works",
    metaDescription:
      "How to get an apostille on a US birth certificate: which state office issues it, what copy you need, and what to do for non-Hague countries.",
    h1: "How to Get an Apostille for a Birth Certificate",
    subtitle:
      "Understand who issues the apostille, what kind of birth certificate it can be attached to, and when extra steps apply.",
    breadcrumb: "Apostille for a birth certificate",
    intro: [
      "An apostille is a certificate that authenticates a public document, such as a birth certificate, for use in another country that is a party to the 1961 Hague Apostille Convention. It replaces the longer legalization process.",
      "For a US birth certificate, the apostille comes from the state that issued the certificate, usually its Secretary of State, not from the U.S. Department of State. The apostille is attached to a certified copy of the birth certificate.",
    ],
    quickFacts: [
      { label: "What it does", value: "Authenticates the official’s signature for use abroad" },
      {
        label: "Who issues it",
        value: "The state where the birth certificate was issued, usually the Secretary of State",
      },
      { label: "Document needed", value: "A certified copy of the birth certificate" },
      {
        label: "Non-Hague countries",
        value: "Extra federal or embassy certification may be required",
      },
      {
        label: "Best first step",
        value: "Ask the receiving country which document and certificate version it accepts",
      },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to get an apostille",
        bullets: [
          "Confirm whether the destination country is a party to the Hague Apostille Convention.",
          "Get a certified copy of the birth certificate from the vital records office of the state where the birth occurred.",
          "Check the issuing state’s Secretary of State rules on which officials’ signatures it can apostille; some local certificates need an extra county certification first.",
          "Submit the certified copy to that state’s apostille office.",
          "For a non-Hague country, ask whether a U.S. Department of State authentication or embassy legalization is also needed.",
        ],
      },
      {
        id: "which-state",
        heading: "The issuing state must apostille it",
        paragraphs: [
          "State-issued documents are authenticated by officials of the state that issued them. A birth certificate from one state cannot be apostilled by another state’s Secretary of State. The U.S. Department of State authenticates federal documents, not state birth certificates.",
          "An apostille confirms the official signature and seal. It does not verify the accuracy of the information in the record.",
        ],
      },
      {
        id: "which-copy",
        heading: "Which birth certificate copy to use",
        paragraphs: [
          "Apostille offices generally require original certified copies, not photocopies. Some states only apostille signatures of certain officials, such as the State Registrar or county recorder, so a certificate signed by another local official may need extra certification or a new copy. Some states also advise a full long form copy for use abroad.",
        ],
        links: [
          {
            label: "Oregon birth certificate guide (long form for use abroad)",
            href: "/guides/oregon/birth-certificate",
          },
          {
            label: "Washington birth certificate guide",
            href: "/guides/washington/birth-certificate",
          },
          { label: "Ohio birth certificate guide", href: "/guides/ohio/birth-certificate" },
          {
            label: "Abstract vs certified birth certificate",
            href: "/guides/abstract-birth-certificate",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Who issues an apostille for a US birth certificate?",
        answer:
          "The state that issued the birth certificate, usually through its Secretary of State. The U.S. Department of State handles federal documents.",
      },
      {
        question: "Can I get an apostille on a photocopy?",
        answer:
          "Generally, no. State apostille offices such as Washington’s require an original certified copy issued by the vital records office or another authorized official.",
      },
      {
        question: "What if the country is not part of the Hague Convention?",
        answer:
          "You may need additional certification from the U.S. Department of State, the destination country’s embassy, or both. Ask the receiving authority what it requires.",
      },
      {
        question: "Does an apostille confirm the information on my birth certificate?",
        answer:
          "No. It authenticates the signature and seal of the official who certified the document, not the accuracy of its contents.",
      },
      {
        question: "Can USVC get the apostille for me?",
        answer:
          "USVC helps you request the certified birth certificate. The apostille itself is issued by the state’s apostille office after you submit the certified copy.",
      },
    ],
    sources: [
      {
        label: "HCCH: Apostille Section",
        href: "https://www.hcch.net/en/instruments/conventions/specialised-sections/apostille",
      },
      {
        label: "U.S. Department of State: Foreign Affairs Manual, 7 FAM 870",
        href: "https://fam.state.gov/fam/07fam/07fam0870.html",
      },
      {
        label: "Washington Secretary of State: apostille FAQ",
        href: "https://www.sos.wa.gov/corporations-charities/apostilles-program/apostille-frequently-asked-questions",
      },
      {
        label: "California Secretary of State: apostille FAQs",
        href: "https://www.sos.ca.gov/notary/apostille-faqs",
      },
    ],
    sourceChecked: CHECKED,
    related: [
      {
        label: "Abstract vs certified birth certificate",
        href: "/guides/abstract-birth-certificate",
      },
      { label: "How to get a death certificate", href: "/guides/how-to-get-death-certificate" },
    ],
  },
  "copy-of-divorce-decree": {
    slug: "copy-of-divorce-decree",
    metaTitle: "How to Get a Copy of a Divorce Decree",
    metaDescription:
      "How to get a certified copy of a divorce decree from the court that granted it, and when a state divorce certificate or verification is enough.",
    h1: "How to Get a Copy of Your Divorce Decree",
    subtitle:
      "Find the court that holds your decree, choose a certified or plain copy, and know when a divorce certificate will do instead.",
    breadcrumb: "Copy of a divorce decree",
    intro: [
      "A divorce decree is the court order that ended a marriage. Copies come from the clerk of the court in the county or city where the divorce was granted, not from where you live now.",
      "Some states also issue a divorce certificate or verification through their vital records office. It proves that a divorce occurred, but it does not contain the terms of the decree.",
    ],
    quickFacts: [
      {
        label: "Who holds the decree",
        value: "The clerk of the court where the divorce was granted",
      },
      { label: "Certified copy", value: "Dated, signed and stamped by the court clerk" },
      {
        label: "Divorce certificate",
        value: "Issued by some states; proves the divorce, not its terms",
      },
      {
        label: "Have ready",
        value: "Both names, the county, the year and the case number if known",
      },
      { label: "Best first step", value: "Identify the county where the divorce was finalized" },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to get a copy of a divorce decree",
        bullets: [
          "Identify the county, or city, and state where the divorce was granted.",
          "Find the clerk of that court; the office name varies by state, such as Clerk of Court, District Clerk, County Clerk or Prothonotary.",
          "Gather both parties’ names, the approximate date and the case number if you have it.",
          "Ask whether you need a certified copy, a plain copy, or an exemplified copy for use in another state.",
          "Request the copy from the court by its listed methods; some courts offer online case search or requests.",
        ],
      },
      {
        id: "decree-vs-certificate",
        heading: "Divorce decree vs divorce certificate",
        paragraphs: [
          "The decree sets out the terms of the divorce, such as property, support and custody arrangements. A divorce certificate, issued by some state vital records offices, shows the names and the date and place of the divorce. It may be enough to change your name or remarry, but not to prove the terms.",
          "Not every state issues divorce certificates, and some issue only a verification letter that is not a legal substitute for the decree. Our state guides explain what each state offers.",
        ],
      },
      {
        id: "certified-copies",
        heading: "Certified, plain and exemplified copies",
        paragraphs: [
          "A certified copy is dated, signed and stamped by the clerk to confirm it is a true copy of the court record. An exemplified copy adds a further authentication and may be needed to record the decree in another state. Plain copies are for reference only.",
        ],
      },
      {
        id: "state-guides",
        heading: "State divorce record guides",
        paragraphs: ["Each guide explains which court or office holds divorce records."],
        links: [
          { label: "Texas divorce certificate guide", href: "/guides/texas/divorce-certificate" },
          {
            label: "Florida divorce certificate guide",
            href: "/guides/florida/divorce-certificate",
          },
          {
            label: "New York divorce certificate guide",
            href: "/guides/new-york/divorce-certificate",
          },
          {
            label: "California divorce certificate guide",
            href: "/guides/california/divorce-certificate",
          },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
    ],
    faqs: [
      {
        question: "Where do I get a copy of my divorce decree?",
        answer:
          "From the clerk of the court in the county or city where the divorce was granted. The clerk can tell you how to order, what it costs and what information you need.",
      },
      {
        question: "Is a divorce certificate the same as a divorce decree?",
        answer:
          "No. A divorce certificate, issued by some states, proves that a divorce occurred. The decree is the court order with the terms of the divorce.",
      },
      {
        question: "Can I get my divorce decree online?",
        answer:
          "Some courts offer online case search or online copy requests, but many still use mail or in-person requests. Check the court that granted the divorce.",
      },
      {
        question: "Who can get a copy of a divorce decree?",
        answer:
          "It depends on the state and court. In some states divorce records are not open to the public, and copies are limited to the parties or their attorneys.",
      },
      {
        question: "Can USVC help me get divorce records?",
        answer:
          "Yes, in states where we accept divorce certificate requests. USVC is an independent service, not a government agency. You can also contact the court or vital records office directly.",
      },
    ],
    sources: [
      {
        label: "USA.gov: divorce decrees and certificates",
        href: "https://www.usa.gov/divorce-decree",
      },
      CDC_W2W,
      {
        label: "Utah State Courts: divorce records and certified copies",
        href: "https://www.utcourts.gov/en/self-help/case-categories/family/divorce.html",
      },
      {
        label: "Florida Department of Health: divorce certificates",
        href: "https://www.floridahealth.gov/certificates-records/divorce-certificates/",
      },
      {
        label: "Texas DSHS: marriage and divorce records",
        href: "https://www.dshs.texas.gov/vital-statistics/marriage-divorce-records",
      },
    ],
    sourceChecked: "11/28/2026",
    related: [
      {
        label: "How to replace a lost marriage certificate",
        href: "/guides/replace-marriage-certificate",
      },
      {
        label: "How to replace a lost birth certificate",
        href: "/guides/replace-birth-certificate",
      },
    ],
  },
  "replace-birth-certificate": {
    slug: "replace-birth-certificate",
    metaTitle: "How to Replace a Lost Birth Certificate",
    metaDescription:
      "Lost your birth certificate? How to order a new certified copy from the state where you were born, who can order, and what ID you need.",
    h1: "How to Replace a Lost Birth Certificate",
    subtitle:
      "Order a new certified copy from the vital records office of the state where you were born.",
    breadcrumb: "Replace a birth certificate",
    intro: [
      "To replace a lost, damaged or stolen birth certificate, you order a new certified copy from the vital records office of the state or territory where you were born. The federal government does not issue birth certificates.",
      "A new copy is issued from the same registered record. Correcting an error or reflecting a legal name change is a separate amendment process with its own application.",
    ],
    quickFacts: [
      { label: "Where to order", value: "The vital records office of your birth state" },
      {
        label: "Who can order",
        value: "Commonly you, your parents named on the record, or a legal representative",
      },
      { label: "ID", value: "Valid photo ID; some states accept alternatives if you have none" },
      {
        label: "Have ready",
        value: "Full name at birth, date and city or county of birth, parents’ names",
      },
      { label: "Best first step", value: "Check your birth state’s eligibility and ID rules" },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to replace a birth certificate",
        bullets: [
          "Identify the state or territory where you were born, not where you live now.",
          "Check that office’s eligibility rules; many states limit certified copies to the person named, parents and legal representatives.",
          "Gather the details: full name at birth, date of birth, city or county of birth and parents’ names.",
          "Prepare valid photo ID; if you have none, ask whether the state accepts a sworn statement or a parent’s ID.",
          "Order the certified copy from the official office, or use a guided service.",
        ],
      },
      {
        id: "no-id",
        heading: "If you have lost your ID too",
        paragraphs: [
          "Many states accept alternatives when you have no photo ID, such as a sworn statement of identity or a notarized letter with a copy of a parent’s photo ID. Check your birth state’s current rules before applying.",
        ],
      },
      {
        id: "corrections",
        heading: "Corrections and name changes are separate",
        paragraphs: [
          "If the certificate has an error or you need it to reflect a legal name change, apply for an amendment through the birth state’s vital records office. This usually requires a separate form and supporting documents such as a certified court order.",
        ],
      },
      {
        id: "stolen",
        heading: "If your birth certificate was stolen",
        paragraphs: [
          "If you think your identity is being misused, report it to the Federal Trade Commission at IdentityTheft.gov and consider fraud alerts or a credit freeze with the credit bureaus.",
        ],
      },
      {
        id: "state-guides",
        heading: "State birth certificate guides",
        paragraphs: ["Each guide links to the official office and its eligibility rules."],
        links: [
          { label: "Texas birth certificate guide", href: "/guides/texas/birth-certificate" },
          { label: "New York birth certificate guide", href: "/guides/new-york/birth-certificate" },
          { label: "Florida birth certificate guide", href: "/guides/florida/birth-certificate" },
          {
            label: "California birth certificate guide",
            href: "/guides/california/birth-certificate",
          },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
    ],
    faqs: [
      {
        question: "Where do I get a replacement birth certificate?",
        answer:
          "From the vital records office of the state or territory where you were born. The federal government does not issue birth certificates.",
      },
      {
        question: "Can I replace my birth certificate if I live in another state now?",
        answer:
          "Yes. You still order from the state where you were born, usually online or by mail.",
      },
      {
        question: "What if I don’t have a photo ID?",
        answer:
          "Many states accept alternatives, such as a sworn statement of identity or a notarized letter with a parent’s photo ID. Check your birth state’s rules.",
      },
      {
        question: "Does ordering a new copy fix mistakes on my birth certificate?",
        answer:
          "No. A new copy shows the same registered information. To correct an error, apply for an amendment with the birth state’s vital records office.",
      },
      {
        question: "Can USVC help me replace my birth certificate?",
        answer:
          "Yes, in states where we accept birth certificate requests. USVC is an independent service, not a government agency. You can also apply directly with the official office.",
      },
    ],
    sources: [
      {
        label: "USA.gov: replace a birth certificate",
        href: "https://www.usa.gov/birth-certificate",
      },
      {
        label: "USA.gov: replace lost or stolen vital documents",
        href: "https://www.usa.gov/replace-vital-documents",
      },
      CDC_W2W,
      {
        label: "Florida Department of Health: birth certificates",
        href: "https://www.floridahealth.gov/certificates-records/birth-certificates/",
      },
      {
        label: "Florida Department of Health: amendments and corrections",
        href: "https://www.floridahealth.gov/certificates-records/amendments-and-corrections/",
      },
      { label: "USA.gov: identity theft", href: "https://www.usa.gov/identity-theft" },
    ],
    sourceChecked: "11/28/2026",
    related: [
      {
        label: "Abstract vs certified birth certificate",
        href: "/guides/abstract-birth-certificate",
      },
      { label: "Apostille for a birth certificate", href: "/guides/apostille-birth-certificate" },
    ],
  },
  "birth-certificate-correction": {
    slug: "birth-certificate-correction",
    metaTitle: "How to Correct or Amend a Birth Certificate",
    metaDescription:
      "How to correct an error or amend a birth certificate after a legal name change, including New York State vs New York City rules.",
    h1: "How to Correct or Amend a Birth Certificate",
    subtitle:
      "Fix a recording error or update a birth record after a court order, through the office where the birth was registered.",
    breadcrumb: "Correct a birth certificate",
    intro: [
      "Changes to a birth certificate are made by the vital records office of the state where the birth was registered, or New York City’s Health Department for births in the five boroughs. A local clerk or the state where you live now usually cannot change it.",
      "States distinguish between a correction, which fixes an error made when the record was filed, and an amendment, which reflects a later change such as a court-ordered name change, adoption or parentage. Each needs its own application and supporting documents.",
    ],
    quickFacts: [
      {
        label: "Who makes the change",
        value: "The vital records office where the birth was registered",
      },
      { label: "Correction", value: "Fixes an error made when the record was filed" },
      { label: "Amendment", value: "Reflects a later change, such as a court-ordered name change" },
      {
        label: "Evidence",
        value: "Original or certified documents; photocopies are usually refused",
      },
      {
        label: "Best first step",
        value: "Find the exact correction or amendment form for your birth state",
      },
    ],
    sections: [
      {
        id: "steps",
        heading: "Steps to correct a birth certificate",
        bullets: [
          "Identify where the birth was registered: the state, or New York City for births in the five boroughs.",
          "Decide whether you need a correction of an original error or an amendment for a later change.",
          "Get that office’s application form and its list of required supporting documents.",
          "Gather original or certified documents that prove the correct information; for a name change, a certified court order.",
          "Submit the application with photo ID, then order new certified copies once the change is recorded.",
        ],
      },
      {
        id: "recent-births",
        heading: "Errors found soon after birth",
        paragraphs: [
          "For a birth in the last year, New York State and New York City both say the fastest route may be through the hospital where the child was born. Other states have similar early-correction processes, so check with the birth state.",
        ],
      },
      {
        id: "name-change",
        heading: "Legal name changes",
        paragraphs: [
          "Changing a name on a birth certificate generally requires a certified court order for the name change. A name change by marriage does not change the birth certificate in New York State; you use the marriage record instead.",
        ],
      },
      {
        id: "new-york",
        heading: "New York State vs New York City",
        paragraphs: [
          "New York City’s Health Department handles birth records for the Bronx, Brooklyn, Manhattan, Queens and Staten Island. The New York State Department of Health handles births elsewhere in the state and cannot change New York City records. Local registrars in New York cannot amend birth certificates.",
        ],
        links: [
          { label: "New York birth certificate guide", href: "/guides/new-york/birth-certificate" },
          { label: "Texas birth certificate guide", href: "/guides/texas/birth-certificate" },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
    ],
    faqs: [
      {
        question: "Who can correct my birth certificate?",
        answer:
          "Only the vital records office where the birth was registered, such as the state health department or, for births in the five boroughs, the New York City Health Department.",
      },
      {
        question: "What is the difference between a correction and an amendment?",
        answer:
          "A correction fixes an error made when the record was filed. An amendment reflects a later change, such as a court-ordered name change, an adoption or a parentage order.",
      },
      {
        question: "Do I need a court order to change my name on my birth certificate?",
        answer:
          "Usually, yes. States such as New York and Texas require a certified copy of the court order for a legal name change.",
      },
      {
        question: "Can I send photocopies of my documents?",
        answer:
          "Generally no. Offices such as New York State and New York City require original documents or certified copies and refuse photocopies and notarized copies.",
      },
      {
        question: "Can USVC correct my birth certificate?",
        answer:
          "No. Corrections and amendments are decided by the vital records office. USVC can help you request new certified copies after the change is recorded.",
      },
    ],
    sources: [
      CDC_W2W,
      {
        label: "New York State DOH: corrections and amendments",
        href: "https://www.health.ny.gov/vital_records/amend_corr.htm",
      },
      {
        label: "New York State DOH: amending a birth certificate",
        href: "https://www.health.ny.gov/vital_records/amend_birth.htm",
      },
      {
        label: "NYC Health: birth certificate corrections",
        href: "https://www.nyc.gov/site/doh/services/birth-death-records-corrections-birth.page",
      },
      {
        label: "Texas DSHS: supporting documentation for record changes",
        href: "https://www.dshs.texas.gov/vital-statistics/requirements-requesting-changing-vital-records/supporting-documentation-record-changes",
      },
    ],
    sourceChecked: "11/28/2026",
    related: [
      {
        label: "How to replace a lost birth certificate",
        href: "/guides/replace-birth-certificate",
      },
      {
        label: "Abstract vs certified birth certificate",
        href: "/guides/abstract-birth-certificate",
      },
    ],
  },
  "marriage-license-vs-certificate": {
    slug: "marriage-license-vs-certificate",
    metaTitle: "Marriage License vs Marriage Certificate",
    metaDescription:
      "The difference between a marriage license and a marriage certificate, and how to get a certified copy of your recorded marriage.",
    h1: "Marriage License vs Marriage Certificate",
    subtitle:
      "A license lets you marry; the recorded certificate proves you did. Here is how to get the copy you need.",
    breadcrumb: "Marriage license vs certificate",
    intro: [
      "A marriage license is the permission to marry, issued before the ceremony. After the ceremony, the officiant returns the completed license to be recorded, and that recorded marriage is what proves you are married.",
      "For legal purposes, such as a name change or benefits, you usually need a certified copy of the recorded marriage. It is not sent automatically in every state; you may need to request it after the license is registered.",
    ],
    quickFacts: [
      { label: "Marriage license", value: "Permission to marry, issued before the ceremony" },
      {
        label: "Marriage certificate",
        value: "Proof that the marriage took place and was recorded",
      },
      { label: "Licenses expire", value: "Commonly within 30 days to a year if unused" },
      {
        label: "Where to get copies",
        value: "The office that issued the license, and in many states the state office",
      },
      {
        label: "Have ready",
        value: "Names at marriage, date, and the city or county of the license",
      },
    ],
    sections: [
      {
        id: "difference",
        heading: "What each document does",
        bullets: [
          "The license authorizes the marriage and is valid only for a limited time and, often, only in the issuing state.",
          "After the ceremony, the completed license is returned and registered by the issuing office.",
          "A certified copy of the registered marriage is what agencies accept as proof of marriage.",
        ],
      },
      {
        id: "where-to-get",
        heading: "Where to get a certified copy",
        paragraphs: [
          "Copies come from the office that issued the license, such as a county or city clerk. In many states the state vital records office also keeps marriage records. Some states, such as Texas, issue certified copies only through the county clerk, while New York City marriages are handled by the Office of the City Clerk rather than the state.",
        ],
        links: [
          {
            label: "New York marriage certificate guide",
            href: "/guides/new-york/marriage-certificate",
          },
          { label: "Texas marriage certificate guide", href: "/guides/texas/marriage-certificate" },
          { label: "All state certificate guides", href: "/guides" },
        ],
      },
      {
        id: "what-you-need",
        heading: "What to have ready",
        paragraphs: [
          "Have both names as recorded on the license, including birth names, the date of marriage, the city or county where the license was issued, and a valid photo ID. Some offices limit recent records to the spouses or people with their authorization.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is a marriage license the same as a marriage certificate?",
        answer:
          "No. A marriage license legally allows you to marry. A marriage certificate, or certified copy of the recorded marriage, proves you got married.",
      },
      {
        question: "Does a marriage license expire?",
        answer:
          "Yes. Most licenses expire within 30 days to a year depending on the state. New York State licenses, for example, are valid for 60 days.",
      },
      {
        question: "Where do I get a copy of my marriage certificate?",
        answer:
          "From the office that issued your license, or in many states the state vital records office. Contact the state where you were married, not where you live now.",
      },
      {
        question: "Can USVC help me get a marriage certificate?",
        answer:
          "Yes, in states where we accept marriage certificate requests. USVC is an independent service, not a government agency. You can also apply directly with the official office.",
      },
    ],
    sources: [
      { label: "USA.gov: marriage certificates", href: "https://www.usa.gov/marriage-certificate" },
      {
        label: "New York State DOH: getting married in New York",
        href: "https://www.health.ny.gov/publications/4210/",
      },
      {
        label: "Texas DSHS: marriage and divorce FAQs",
        href: "https://www.dshs.texas.gov/vital-statistics/frequently-asked-questions/marriage-divorce-faqs",
      },
      {
        label: "Sonoma County: marriage certificates",
        href: "https://sonomacounty.gov/administrative-support-and-fiscal-services/clerk-recorder-assessor/clerk-recorder/vital-records/marriage-certificates",
      },
    ],
    sourceChecked: "11/28/2026",
    related: [
      {
        label: "How to replace a lost marriage certificate",
        href: "/guides/replace-marriage-certificate",
      },
      { label: "How to get a copy of a divorce decree", href: "/guides/copy-of-divorce-decree" },
    ],
  },
};

export const TOPIC_GUIDE_SLUGS = Object.keys(TOPIC_GUIDES);

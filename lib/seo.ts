import type { Metadata } from "next";

export const SITE_URL = "https://usvitalcertificates.org";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const SOCIAL_IMAGE = {
  url: `${SITE_URL}/opengraph-image`,
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "US Vital Certificates. Trusted help for vital certificate requests. Independent service, not a government agency.",
} as const;

/** Page-level metadata replaces nested layout fields; include images explicitly. */
export function socialMetadata({
  title,
  description,
  url,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  type?: "website" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "US Vital Certificates",
      locale: "en_US",
      images: [{ ...SOCIAL_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
    },
  };
}

/** Standard site disclaimer: one consistent voice on every public page
 *  except the homepage (which carries no disclaimer box). */
export const SITE_DISCLAIMER =
  "Our online service provides convenient access to official vital records for both the public and legal professionals. While you may obtain these records directly from government agencies, our platform offers a faster, more convenient alternative, eliminating the need for in-person visits. Our fees cover secure online ordering, expert assistance, and a thorough review to ensure compliance with all regulations.";

/**
 * Boss rule: keep rendered `<title>` and `meta[name=description]` / `og:*`
 * strictly between 25–150 characters so SERP + social + AI citations
 * never truncate (`...`) and thin pages never waste the slot.
 */
export const SEO_TITLE_MIN = 25;
export const SEO_TITLE_MAX = 150;
export const SEO_DESCRIPTION_MIN = 25;
export const SEO_DESCRIPTION_MAX = 150;

export function assertSeoLength(kind: "title" | "description", value: string): string {
  const min = kind === "title" ? SEO_TITLE_MIN : SEO_DESCRIPTION_MIN;
  const max = kind === "title" ? SEO_TITLE_MAX : SEO_DESCRIPTION_MAX;
  if (value.length < min || value.length > max) {
    throw new Error(`SEO ${kind} must be ${min}-${max} chars, got ${value.length}: ${value}`);
  }
  return value;
}

export const BIRTH_GUIDE_SOURCES: Record<string, { state: string; url: string }> = {
  california: {
    state: "California",
    url: "https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records-Obtaining-Certified-Copies-of-Birth-Records.aspx",
  },
  texas: { state: "Texas", url: "https://www.dshs.texas.gov/vital-statistics/birth-records" },
  florida: {
    state: "Florida",
    url: "https://www.floridahealth.gov/certificates-records/birth-certificates/",
  },
  "new-york": { state: "New York", url: "https://www.health.ny.gov/vital_records/birth.htm" },
  pennsylvania: {
    state: "Pennsylvania",
    url: "https://www.pa.gov/agencies/health/programs/vital-records",
  },
  illinois: {
    state: "Illinois",
    url: "https://dph.illinois.gov/topics-services/birth-death-other-records/birth-records/obtain-birth-certificate.html",
  },
  ohio: {
    state: "Ohio",
    url: "https://odh.ohio.gov/know-our-programs/vital-statistics/how-to-order-certificates",
  },
  georgia: { state: "Georgia", url: "https://georgia.gov/request-vital-records" },
  "north-carolina": { state: "North Carolina", url: "https://vitalrecords.nc.gov/order.htm" },
  michigan: {
    state: "Michigan",
    url: "https://www.michigan.gov/mdhhs/doing-business/vitalrecords",
  },
  "new-jersey": {
    state: "New Jersey",
    url: "https://www.nj.gov/health/vital/order-vital/non-genealogical-records",
  },
  virginia: {
    state: "Virginia",
    url: "https://www.vdh.virginia.gov/vital-records/applications-for-a-vital-record/",
  },
  washington: {
    state: "Washington",
    url: "https://doh.wa.gov/licenses-permits-and-certificates/vital-records/ordering-vital-record/birth-record",
  },
};

export const INDEXABLE_STATES = [
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "district-of-columbia",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new-hampshire",
  "new-jersey",
  "new-mexico",
  "new-york",
  "north-carolina",
  "north-dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "puerto-rico",
  "rhode-island",
  "south-carolina",
  "south-dakota",
  "tennessee",
  "texas",
  "utah",
  // Vermont + Wyoming listed in the directory but not accepting orders:
  // excluded from the sitemap and detail pages carry noindex.
  "virginia",
  "washington",
  "west-virginia",
  "wisconsin",
] as const;

/** Exact, lowercase jurisdictions accepted by public application routes. */
export const ALL_STATE_SLUGS = [...INDEXABLE_STATES, "vermont", "wyoming"] as const;

const STATE_SLUG_SET = new Set<string>(ALL_STATE_SLUGS);

export function isKnownStateSlug(value: string): boolean {
  return STATE_SLUG_SET.has(value);
}

export const CERTIFICATE_SLUGS = [
  "birth-certificate",
  "death-certificate",
  "marriage-certificate",
  "divorce-certificate",
] as const;

export function titleCase(value: string) {
  const small = new Set(["of", "and", "de", "del"]);
  return value
    .split("-")
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (index > 0 && small.has(lower)) return lower;
      return part[0].toUpperCase() + part.slice(1);
    })
    .join(" ");
}

/**
 * Stable sitemap dates (P0 SEO). `new Date()` on every request makes
 * `<lastmod>` churn daily, so Google ignores it for recrawl priority.
 * Update these only when that section's content actually changes.
 */
// All four public page groups received the social metadata update on this date.
// These describe page modifications, not the date official sources were checked.
export const SITEMAP_STATIC_LAST_MODIFIED = "2026-10-22";
export const SITEMAP_STATES_LAST_MODIFIED = "2026-10-21";
export const SITEMAP_ORDERS_LAST_MODIFIED = "2026-10-21";
export const SITEMAP_GUIDES_LAST_MODIFIED = "2026-10-22";

/**
 * P1 SEO: cert-type content slots so the 200 order pages and 50 state
 * hubs are not byte-identical shells. Copy is deliberately generic and
 * truthful (no invented state fees, timelines, or eligibility rules —
 * those stay "confirm with the issuing agency" per YMYL policy).
 */
export const CERTIFICATE_DETAILS: Record<
  string,
  { label: string; uses: string; checklist: string[]; faq: { q: string; a: string }[] }
> = {
  "birth-certificate": {
    label: "Birth",
    uses: "A certified birth certificate is most often requested as proof of identity, age, citizenship, and parentage — for passports, REAL ID, school enrollment, and benefits claims.",
    checklist: [
      "Subject's full name at birth, date of birth, and place of birth",
      "Parents' names as shown on the record",
      "Requestor contact details and a deliverable shipping address",
    ],
    faq: [
      {
        q: "What is a birth certificate used for?",
        a: "Common uses include passports, REAL ID or driver's licenses, school enrollment, and Social Security or benefits claims. The receiving office decides whether a copy is accepted.",
      },
      {
        q: "What does USVC review before filing?",
        a: "We check your application for missing details and inconsistencies, then file it with the issuing agency. Agency fees are charged separately upon review and acceptance.",
      },
      {
        q: "How long does the USVC part take?",
        a: "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary by state — confirm current times with the issuing agency.",
      },
    ],
  },
  "death-certificate": {
    label: "Death",
    uses: "A certified death certificate is most often requested to settle estates, claim insurance, close accounts, and notify government agencies.",
    checklist: [
      "Decedent's full name, date of death, and place of death",
      "Your relationship to the person named on the record",
      "Requestor contact details and a deliverable shipping address",
    ],
    faq: [
      {
        q: "What is a death certificate used for?",
        a: "Common uses include insurance claims, probate and property transfers, closing accounts, and notifying Social Security. The receiving office decides whether a copy is accepted.",
      },
      {
        q: "What does USVC review before filing?",
        a: "We check your application for missing details and inconsistencies, then file it with the issuing agency. Agency fees are charged separately upon review and acceptance.",
      },
      {
        q: "How long does the USVC part take?",
        a: "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary by state — confirm current times with the issuing agency.",
      },
    ],
  },
  "marriage-certificate": {
    label: "Marriage",
    uses: "A certified marriage certificate is most often requested for name changes, spousal benefits, immigration filings, and joint tax or property matters.",
    checklist: [
      "Both spouses' names and the date of marriage",
      "Place of marriage as shown on the record",
      "Requestor contact details and a deliverable shipping address",
    ],
    faq: [
      {
        q: "What is a marriage certificate used for?",
        a: "Common uses include name changes with Social Security and the DMV, adding a spouse to benefits, and spousal immigration petitions. The receiving office decides whether a copy is accepted.",
      },
      {
        q: "What does USVC review before filing?",
        a: "We check your application for missing details and inconsistencies, then file it with the issuing agency. Agency fees are charged separately upon review and acceptance.",
      },
      {
        q: "How long does the USVC part take?",
        a: "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary by state — confirm current times with the issuing agency.",
      },
    ],
  },
  "divorce-certificate": {
    label: "Divorce",
    uses: "A divorce certificate or certified decree is most often requested to remarry, restore a former name, or update benefits and property records.",
    checklist: [
      "Both spouses' names and the date of divorce",
      "Place of divorce as shown on the record",
      "Requestor contact details and a deliverable shipping address",
    ],
    faq: [
      {
        q: "What is a divorce certificate used for?",
        a: "Common uses include obtaining a new marriage license, restoring a former name on identity documents, and updating beneficiaries. The receiving office decides whether a copy is accepted.",
      },
      {
        q: "What does USVC review before filing?",
        a: "We check your application for missing details and inconsistencies, then file it with the issuing agency. Agency fees are charged separately upon review and acceptance.",
      },
      {
        q: "How long does the USVC part take?",
        a: "Most people finish our guided form in about 10 minutes. Agency processing and delivery times vary by state — confirm current times with the issuing agency.",
      },
    ],
  },
};

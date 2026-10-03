export const SITE_URL = "https://usvitalcertificates.org";

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
    url: "https://www.floridahealth.gov/certificates/certificates/birth/index.html",
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
  "vermont",
  "virginia",
  "washington",
  "west-virginia",
  "wisconsin",
  "wyoming",
] as const;

export const CERTIFICATE_SLUGS = [
  "birth-certificate",
  "death-certificate",
  "marriage-certificate",
  "divorce-certificate",
] as const;

export function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

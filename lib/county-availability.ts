const TEMPORARILY_UNAVAILABLE_CALIFORNIA_COUNTIES = new Set([
  "San Francisco",
  "San Bernardino",
  "Yolo",
  "Riverside",
  "Del Norte",
  "Lake",
  "Sutter",
  "Kings",
  "Santa Barbara",
]);

const UNAVAILABLE_NEW_YORK_MARRIAGE_COUNTIES = new Set([
  "new york",
  "kings",
  "bronx",
  "richmond",
  "queens",
]);

export const NEW_YORK_MARRIAGE_COUNTY_UNAVAILABLE_MESSAGE =
  "No Service Available for Marriage Certificates in this county.";

export function isNewYorkMarriageCountyUnavailable(
  stateCode: string,
  county: string,
  certificate: string,
): boolean {
  return (
    stateCode.toUpperCase() === "NY" &&
    ["MARRIAGE", "marriage-certificate"].includes(certificate) &&
    UNAVAILABLE_NEW_YORK_MARRIAGE_COUNTIES.has(county.trim().toLowerCase())
  );
}

export function isCountyTemporarilyUnavailable(
  stateCode: string,
  county: string,
  certificate = "",
): boolean {
  return (
    (stateCode.toUpperCase() === "CA" && TEMPORARILY_UNAVAILABLE_CALIFORNIA_COUNTIES.has(county)) ||
    isNewYorkMarriageCountyUnavailable(stateCode, county, certificate)
  );
}

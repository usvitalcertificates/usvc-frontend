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

const UNAVAILABLE_NEW_YORK_COUNTIES = new Set(["new york", "kings", "bronx", "richmond", "queens"]);

export const NEW_YORK_COUNTY_UNAVAILABLE_MESSAGE =
  "No Service Available for Certificates in this county.";

export function isNewYorkCountyUnavailable(stateCode: string, county: string): boolean {
  return (
    stateCode.toUpperCase() === "NY" &&
    UNAVAILABLE_NEW_YORK_COUNTIES.has(county.trim().toLowerCase())
  );
}

export function isCountyTemporarilyUnavailable(stateCode: string, county: string): boolean {
  return (
    (stateCode.toUpperCase() === "CA" && TEMPORARILY_UNAVAILABLE_CALIFORNIA_COUNTIES.has(county)) ||
    isNewYorkCountyUnavailable(stateCode, county)
  );
}

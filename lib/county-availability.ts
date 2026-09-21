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

export const COUNTY_UNAVAILABLE_MESSAGE =
  "Certificate issuance is currently unavailable through this county authority. Please select a different county.";

export function isCountyTemporarilyUnavailable(stateCode: string, county: string): boolean {
  return (
    stateCode.toUpperCase() === "CA" && TEMPORARILY_UNAVAILABLE_CALIFORNIA_COUNTIES.has(county)
  );
}

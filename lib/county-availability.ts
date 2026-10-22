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

export function isCountyTemporarilyUnavailable(stateCode: string, county: string): boolean {
  return (
    stateCode.toUpperCase() === "CA" && TEMPORARILY_UNAVAILABLE_CALIFORNIA_COUNTIES.has(county)
  );
}

/** States shown in the directory but not accepting orders. They stay visible
 *  (list, search, counts) with disabled controls; detail/order routes render
 *  an unavailable notice instead of order entry. */

const UNSUPPORTED_STATE_SLUGS = new Set(["vermont", "wyoming"]);
const UNSUPPORTED_STATE_CODES = new Set(["VT", "WY"]);

export const STATE_UNAVAILABLE_MESSAGE =
  "We don't currently accept orders for this state. Please check back later or contact support for help.";

export function isStateUnsupported(slugOrCode: string): boolean {
  const value = slugOrCode.trim().toLowerCase();
  if (UNSUPPORTED_STATE_SLUGS.has(value)) return true;
  return UNSUPPORTED_STATE_CODES.has(value.toUpperCase());
}

export const CALIFORNIA_DIVORCE_UNAVAILABLE_TITLE =
  "California Divorce Certificate is not available";
export const CALIFORNIA_DIVORCE_UNAVAILABLE_MESSAGE =
  "California Divorce Certificate is not available through our online service.";

/** New public applications only; existing applications may still resume. */
export function isCertificateUnavailable(state: string, certificate: string): boolean {
  return (
    ["ca", "california"].includes(state.trim().toLowerCase()) &&
    ["divorce", "divorce-certificate"].includes(certificate.trim().toLowerCase())
  );
}

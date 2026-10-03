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

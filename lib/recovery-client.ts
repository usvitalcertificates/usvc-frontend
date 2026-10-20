import { STATES } from "./states";
export async function recoveryJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/backend/recovery${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers: { "content-type": "application/json", ...init.headers },
  });
  const body = await response.json();
  if (!response.ok)
    throw Object.assign(new Error(body.message || "Unable to continue your application."), {
      status: response.status,
      errors: body.errors,
      orderId: body.orderId,
      publicNumber: body.publicNumber,
    });
  return body as T;
}
export interface RecoveryApplication {
  id: string;
  publicNumber: string;
  certificate: string;
  stateName: string;
  stateSlug: string;
  stateCode: string;
  createdAt: string;
  amountCents: number;
  currency: string;
  paymentStatus: string;
  status: string;
  revision: number;
  county: string;
  city: string;
  reason: string;
  reasonOther: string;
  applicant: Record<string, string>;
  subject: Record<string, string>;
  family: Record<string, string>;
  addresses: Record<string, Record<string, string>>;
  copies: number;
  rush: boolean;
  deliveryMethod: string;
  destinationType: string;
  hasStoredSsn: boolean;
  processing: boolean;
}
export function recoveryDraft(order: RecoveryApplication): Record<string, string> {
  const a = order.applicant;
  const draft: Record<string, string> = {
    ...order.subject,
    ...order.family,
    county: order.county,
    city: order.city,
    reason: order.reason,
    reasonOther: order.reasonOther,
    relationship: a.relationship,
    relationshipOther: a.relationshipOther,
    applicantFirstName: a.firstName,
    applicantMiddleName: a.middleName,
    applicantLastName: a.lastName,
    applicantSuffix: a.suffix,
    applicantDob: a.dateOfBirth,
    phone: a.phone,
    email: a.email,
    confirmEmail: a.email,
    copies: String(order.copies),
    processing: order.rush ? "rush" : "standard",
    delivery: order.deliveryMethod,
    signature: "",
    billingSource: "none",
    sameShipping: "no",
  };
  for (const prefix of ["home", "shipping", "billing"]) {
    const addr = order.addresses[prefix] ?? {};
    for (const [field, key] of Object.entries({
      Line1: "line1",
      Line2: "line2",
      City: "city",
      State: "state",
      Zip: "postalCode",
      Country: "country",
    }))
      draft[`${prefix}${field}`] = addr[key] ?? "";
    if (addr.addressType !== "international" && addr.addressType !== "military")
      draft[`${prefix}State`] =
        STATES.find((s) => s.abbreviation === addr.state || s.name === addr.state)?.name ??
        addr.state ??
        "";
    draft[`${prefix}Type`] =
      addr.addressType === "international"
        ? "International (including Canada and Mexico)"
        : addr.addressType === "military"
          ? "US Military (APO/FPO)"
          : "Domestic (US and Puerto Rico)";
  }
  return draft;
}

const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Certificate = "BIRTH" | "DEATH" | "MARRIAGE" | "DIVORCE";

export interface AddressInput {
  firstName?: string;
  lastName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  addressType?: "domestic" | "military" | "international";
}

export interface CreateOrderPayload {
  antiAbuse: { honeypot: string; formStartedAt: number };
  stateSlug: string;
  stateCode: string;
  stateName: string;
  certificate: Certificate;
  county: string;
  city: string;
  reason: string;
  reasonOther?: string;
  applicant: {
    relationship: string;
    relationshipOther?: string;
    firstName: string;
    lastName: string;
    previousLastName?: string;
    dateOfBirth?: string;
    phone: string;
    email: string;
  };
  requestorSsn?: string;
  subject: Record<string, string>;
  family: Record<string, string>;
  addresses: { home: AddressInput; shipping: AddressInput; billing: AddressInput };
  destinationType: "domestic" | "international";
  copies: number;
  rush: boolean;
  deliveryMethod?: string;
  consents: {
    accurate: boolean;
    govtId: boolean;
    terms: boolean;
    privacy: boolean;
    refund: boolean;
    independent: boolean;
    processingPayment: boolean;
  };
  processingAuthorization: { accepted: true; text: string; acceptedAt: string };
  signature: string;
  paymentCard: { number: string; expiry: string; securityCode: string };
  totalCents: number;
}

async function post<T>(path: string, payload: unknown): Promise<T> {
  const r = await fetch(`${api}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    const error = new Error(body.message ?? "Request failed") as Error & {
      errors?: Record<string, string>;
      status?: number;
    };
    error.errors = body.errors;
    error.status = r.status;
    throw error;
  }
  return body as T;
}

export async function createOrder(payload: CreateOrderPayload) {
  return post<{ id: string; publicNumber: string; amountCents: number }>("/orders", payload);
}

export async function verifyOrderBeforePayment(payload: CreateOrderPayload) {
  return post<{ ok: boolean; amountCents: number }>("/orders/verify-before-payment", payload);
}

export async function trackOrder(publicNumber: string, email: string) {
  return post<{
    publicNumber: string;
    status: string;
    paymentStatus: string;
    certificate: string;
    stateCode: string;
  }>("/orders/tracking", { publicNumber, email });
}

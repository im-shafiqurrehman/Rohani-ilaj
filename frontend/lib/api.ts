import { getUserToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export type BookingPayload = {
  serviceType: "call" | "physical";
  customerName: string;
  customerPhone: string;
  /** Required: the booking confirmation and the post-approval contact number
   *  are both delivered here, so a booking without one cannot be fulfilled. */
  customerEmail: string;
  slotTime?: string;
  calendlyEventUri?: string;
  // Card (bank transfer) is the only payment method the site offers.
  paymentMethod: "card";
  /** The receipt image is the only proof of payment collected — the amount and
   *  reference are read off it by the admin. */
  screenshot: File;
  /** Set when the money came from someone else's account. The name is only
   *  asked for in that case, since otherwise the payer is the customer. */
  paidByThirdParty?: boolean;
  accountTitle?: string;
};

export async function submitBooking(payload: BookingPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) form.append(key, value as string | Blob);
  });

  // Sent only when the customer happens to be signed in — the endpoint
  // accepts guests either way, and links the booking when it can.
  const token = getUserToken();

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Booking submit nahi ho saki.");
  }
  return data as { message: string; bookingId: string };
}

export type ContactTopic = "sawal" | "booking" | "tassur" | "deegar";

export type ContactPayload = {
  name: string;
  phone: string;
  email?: string;
  topic: ContactTopic;
  message: string;
  /** Honeypot — left empty by real people, filled by bots. */
  website?: string;
};

/** Thrown with the server's machine-readable code attached, so the UI can
 *  render a localised message instead of echoing a fixed Roman-Urdu string. */
export class ContactError extends Error {
  code?: string;
  contactEmail?: string;
  constructor(message: string, code?: string, contactEmail?: string) {
    super(message);
    this.name = "ContactError";
    this.code = code;
    this.contactEmail = contactEmail;
  }
}

export async function submitContact(payload: ContactPayload) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new ContactError(
      data.error || "Could not send the message.",
      data.code,
      data.contactEmail
    );
  }
  return data as { message: string };
}

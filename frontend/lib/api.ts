const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type BookingPayload = {
  serviceType: "call" | "physical";
  customerName: string;
  customerPhone: string;
  slotTime?: string;
  calendlyEventUri?: string;
  // Card (bank transfer) is the only payment method the site offers.
  paymentMethod: "card";
  accountTitle: string;
  transactionId: string;
  screenshot: File;
};

export async function submitBooking(payload: BookingPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined) form.append(key, value as string | Blob);
  });

  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
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

export async function submitContact(payload: ContactPayload) {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Paigham bhej nahi saka.");
  }
  return data as { message: string };
}

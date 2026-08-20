import {
  clearUserToken,
  getUserToken,
  setUserToken,
  type User,
} from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const getToken = getUserToken;
export const setToken = setUserToken;
export const clearToken = clearUserToken;

export async function adminLogin(phone: string, password: string) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, password }),
  });
  const data = await res.json();
  // 403 here means the credentials were right but the account isn't an admin.
  if (!res.ok) throw new Error(data.error || "Login nahi ho saka.");
  setToken(data.token);
  return data.user as User;
}

export type Booking = {
  _id: string;
  user?: string;
  serviceType: "call" | "physical";
  amount: number;
  customerName: string;
  customerPhone: string;
  slotTime?: string;
  slotEndTime?: string;
  /** Short quotable code from the Calendly event, e.g. "4F2A9C31". */
  slotReference?: string;
  calendlyEventName?: string;
  paidByThirdParty?: boolean;
  createdByAdmin?: boolean;
  paymentMethod: string;
  /** Only present on bookings taken before the form was simplified. */
  accountTitle?: string;
  transactionId?: string;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  meetLink?: string;
  adminNote?: string;
  createdAt: string;
};

export type NotifyResult = { sent: boolean; reason?: string };

export type NewBookingInput = {
  serviceType: "call" | "physical";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  slotTime?: string;
  amount?: number;
  adminNote?: string;
  meetLink?: string;
};

/** Records a booking taken over WhatsApp. Created already approved, since the
 *  receipt was checked before it got here. */
export async function createAdminBooking(input: NewBookingInput) {
  const res = await fetch(`${API_URL}/admin/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Booking add nahi ho saki.");
  return data as Booking & { notified?: NotifyResult };
}

export type Stats = {
  pending: number;
  approved: number;
  rejected: number;
  approvedRevenue: number;
};

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function fetchStats() {
  const res = await fetch(`${API_URL}/admin/stats`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Stats load nahi hui.");
  return data as Stats;
}

export type BookingPage = {
  items: Booking[];
  total: number;
  skip: number;
  limit: number;
};

export async function fetchBookings(
  status?: string,
  q?: string,
  opts?: { skip?: number; limit?: number }
) {
  const url = new URL(`${API_URL}/admin/bookings`);
  if (status) url.searchParams.set("status", status);
  if (q) url.searchParams.set("q", q);
  url.searchParams.set("skip", String(opts?.skip ?? 0));
  url.searchParams.set("limit", String(opts?.limit ?? 25));

  const res = await fetch(url.toString(), { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Bookings load nahi hui.");
  return data as BookingPage;
}

export async function updateBookingStatus(
  id: string,
  // "pending" reopens a booking whose decision was a mis-click.
  status: "approved" | "rejected" | "pending",
  extra?: { meetLink?: string; adminNote?: string }
) {
  const res = await fetch(`${API_URL}/admin/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status, ...extra }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
  return data as Booking & { notified?: NotifyResult };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "rohani_illaj_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login nahi ho saka.");
  setToken(data.token);
  return data.token as string;
}

export type Booking = {
  _id: string;
  serviceType: "call" | "physical";
  amount: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  accountTitle: string;
  transactionId: string;
  screenshotUrl: string;
  status: "pending" | "approved" | "rejected";
  meetLink?: string;
  adminNote?: string;
  createdAt: string;
};

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

export async function fetchBookings(status?: string, q?: string) {
  const url = new URL(`${API_URL}/admin/bookings`);
  if (status) url.searchParams.set("status", status);
  if (q) url.searchParams.set("q", q);

  const res = await fetch(url.toString(), { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Bookings load nahi hui.");
  return data as Booking[];
}

export async function updateBookingStatus(
  id: string,
  status: "approved" | "rejected",
  extra?: { meetLink?: string; adminNote?: string }
) {
  const res = await fetch(`${API_URL}/admin/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status, ...extra }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update nahi ho saka.");
  return data as Booking;
}

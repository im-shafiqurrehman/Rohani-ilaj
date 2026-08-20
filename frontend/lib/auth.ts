const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const TOKEN_KEY = "rohani_user_token";

export type Role = "user" | "admin";

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** Access is decided by this, not by which login page was used. */
  role: Role;
};

export const isAdmin = (user: User | null) => user?.role === "admin";

export type MyBooking = {
  _id: string;
  serviceType: "call" | "physical";
  amount: number;
  slotTime?: string;
  status: "pending" | "approved" | "rejected";
  slotEndTime?: string;
  slotReference?: string;
  calendlyEventName?: string;
  screenshotUrl?: string;
  meetLink?: string;
  /** Sent by the API only on approved bookings — this is the gate. */
  contactNumber?: string;
  adminNote?: string;
  createdAt: string;
};

export function getUserToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearUserToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data as T;
}

export async function signup(input: {
  name: string;
  phone: string;
  email?: string;
  password: string;
}) {
  const data = await post<{ token: string; user: User }>("/auth/signup", input);
  setUserToken(data.token);
  return data;
}

export async function login(input: { phone: string; password: string }) {
  const data = await post<{ token: string; user: User }>("/auth/login", input);
  setUserToken(data.token);
  return data;
}

export async function fetchMe(): Promise<User | null> {
  const token = getUserToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    // Expired or tampered token — drop it rather than looping on 401s.
    clearUserToken();
    return null;
  }
  const data = await res.json();
  return data.user as User;
}

export async function fetchMyBookings(): Promise<MyBooking[]> {
  const res = await fetch(`${API_URL}/auth/my-bookings`, {
    headers: { Authorization: `Bearer ${getUserToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load your bookings.");
  return data as MyBooking[];
}

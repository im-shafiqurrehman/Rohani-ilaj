"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Booking,
  Stats,
  fetchBookings,
  fetchStats,
  getToken,
  clearToken,
  updateBookingStatus,
} from "@/lib/adminApi";

const TABS = [
  { key: "pending", label: "زیرِ التواء" },
  { key: "approved", label: "منظور شدہ" },
  { key: "rejected", label: "مسترد شدہ" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, s] = await Promise.all([
        fetchBookings(tab, search || undefined),
        fetchStats(),
      ]);
      setBookings(list);
      setStats(s);
    } catch (err: any) {
      if (String(err.message).toLowerCase().includes("login")) {
        router.push("/admin/login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab, search, router]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/admin/login");
      return;
    }
    load();
  }, [load, router]);

  async function handleDecision(
    id: string,
    status: "approved" | "rejected",
    meetLink?: string
  ) {
    setBusyId(id);
    try {
      await updateBookingStatus(id, status, { meetLink });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen bg-navy-soft px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy">Bookings</h1>
          <button
            onClick={() => {
              clearToken();
              router.push("/admin/login");
            }}
            className="rounded-full border border-navy/25 bg-white px-4 py-1.5 font-body text-xs text-navy/70 transition hover:border-navy hover:text-navy"
          >
            Logout
          </button>
        </div>

        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="زیرِ التواء" value={String(stats.pending)} highlight />
            <StatCard label="منظور شدہ" value={String(stats.approved)} />
            <StatCard label="مسترد شدہ" value={String(stats.rejected)} />
            <StatCard
              label="کل وصولی"
              value={`Rs ${stats.approvedRevenue.toLocaleString()}`}
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-4 py-1.5 font-body text-sm transition ${
                tab === t.key
                  ? "border-navy bg-navy text-white"
                  : "border-gold bg-white text-navy/70 hover:bg-gold-soft"
              }`}
            >
              {t.label}
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="نام، نمبر یا TID تلاش کریں"
            className="ms-auto w-full rounded-full border border-gold bg-white px-4 py-1.5 font-body text-sm text-navy placeholder-navy/35 outline-none focus:border-gold-deep sm:w-64"
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 font-body text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 space-y-4">
          {loading && <p className="font-body text-navy/60">Loading...</p>}
          {!loading && bookings.length === 0 && (
            <p className="rounded-2xl border border-gold bg-white p-8 text-center font-body text-navy/60">
              اس فہرست میں کوئی بکنگ نہیں ہے۔
            </p>
          )}

          {bookings.map((b) => (
            <BookingRow
              key={b._id}
              booking={b}
              busy={busyId === b._id}
              onDecide={handleDecision}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight ? "border-gold-deep bg-gold-soft" : "border-gold bg-white"
      }`}
    >
      <p className="font-body text-xs text-navy/55">{label}</p>
      <p className="mt-1 font-body text-xl font-semibold text-navy">{value}</p>
    </div>
  );
}

function BookingRow({
  booking: b,
  busy,
  onDecide,
}: {
  booking: Booking;
  busy: boolean;
  onDecide: (id: string, status: "approved" | "rejected", meetLink?: string) => void;
}) {
  const [showApprove, setShowApprove] = useState(false);
  const [meetLink, setMeetLink] = useState("");

  const waNumber = b.customerPhone.replace(/\D/g, "").replace(/^0/, "92");

  return (
    <div className="rounded-2xl border border-gold bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="font-body text-sm text-navy/85">
          <p className="text-base font-semibold text-navy">
            {b.customerName} — {b.serviceType === "call" ? "Call" : "Physical"} (Rs{" "}
            {b.amount.toLocaleString()})
          </p>
          <p className="mt-1">
            Phone:{" "}
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noreferrer"
              className="text-gold-dark underline"
            >
              {b.customerPhone}
            </a>
          </p>
          <p>
            {b.paymentMethod} · Account title: {b.accountTitle} · TID:{" "}
            <span className="font-semibold text-navy">{b.transactionId}</span>
          </p>
          <a
            href={b.screenshotUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-gold-dark underline"
          >
            Screenshot dekhein
          </a>
          <p className="mt-1 text-xs text-navy/45">
            {new Date(b.createdAt).toLocaleString()}
          </p>
          {b.meetLink && (
            <p className="mt-1 text-xs text-navy/60">Meet: {b.meetLink}</p>
          )}
        </div>

        {b.status === "pending" ? (
          <div className="flex items-start gap-2">
            <button
              disabled={busy}
              onClick={() => setShowApprove((v) => !v)}
              className="rounded-full bg-navy px-4 py-1.5 font-body text-xs text-white transition hover:bg-navy-light disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busy}
              onClick={() => onDecide(b._id, "rejected")}
              className="rounded-full border border-red-300 bg-red-50 px-4 py-1.5 font-body text-xs text-red-700 transition hover:bg-red-100 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        ) : (
          <span
            className={`h-fit rounded-full px-3 py-1 font-body text-xs ${
              b.status === "approved"
                ? "border border-gold-deep bg-gold-soft text-gold-dark"
                : "border border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {b.status}
          </span>
        )}
      </div>

      {showApprove && b.status === "pending" && (
        <div className="mt-4 rounded-xl border border-gold bg-gold-soft p-4">
          <label className="mb-2 block font-body text-xs text-navy/70">
            Google Meet link (optional — Calendly usually emails this itself)
          </label>
          <div className="flex flex-wrap gap-2">
            <input
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="min-w-0 flex-1 rounded-lg border border-gold bg-white px-3 py-2 font-body text-sm text-navy placeholder-navy/30 outline-none focus:border-gold-deep"
            />
            <button
              disabled={busy}
              onClick={() => onDecide(b._id, "approved", meetLink || undefined)}
              className="rounded-full bg-navy px-5 py-2 font-body text-xs text-white transition hover:bg-navy-light disabled:opacity-50"
            >
              {busy ? "..." : "Confirm approve"}
            </button>
          </div>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              `السلام علیکم ${b.customerName}، آپ کی بکنگ کی تصدیق ہو گئی ہے۔`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-body text-xs text-gold-dark underline"
          >
            WhatsApp par confirmation bhejein →
          </a>
        </div>
      )}
    </div>
  );
}

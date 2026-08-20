"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/components/AuthProvider";
import PalettePicker from "@/components/PalettePicker";
import StatusBadge from "@/components/StatusBadge";
import { Button, Alert } from "@/components/ui";
import { formatDateTime, formatSlotRange } from "@/lib/datetime";
import {
  Booking,
  Stats,
  clearToken,
  fetchBookings,
  fetchStats,
  getToken,
  updateBookingStatus,
} from "@/lib/adminApi";

const PAGE_SIZE = 25;

const TABS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "", label: "All" },
] as const;

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [tab, setTab] = useState<string>("pending");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async () => {
    try {
      const [page, s] = await Promise.all([
        fetchBookings(tab, query, { skip: 0, limit: PAGE_SIZE }),
        fetchStats(),
      ]);
      setBookings(page.items);
      setTotal(page.total);
      setStats(s);
      setError("");
    } catch (err: any) {
      setError(err.message);
    }
  }, [tab, query]);

  const loadMore = useCallback(async () => {
    if (!bookings) return;
    setLoadingMore(true);
    try {
      const page = await fetchBookings(tab, query, {
        skip: bookings.length,
        limit: PAGE_SIZE,
      });
      setBookings((prev) => [...(prev ?? []), ...page.items]);
      setTotal(page.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [bookings, tab, query]);

  // One effect owns fetching. Previously a mount effect and a debounce effect
  useEffect(() => {
    if (authLoading) return;
    // A token alone is no longer enough — a signed-in customer must not reach
    // the panel just because they have a valid session.
    if (!getToken() || user?.role !== "admin") {
      router.replace("/admin/login");
      return;
    }
    const t = setTimeout(load, query ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, query, router, user, authLoading]);

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/asset/logo-mark.png"
              alt=""
              width={421}
              height={541}
              className="h-9 w-auto"
            />
            <div>
              <p className="eyebrow font-body">
                Administration{user ? ` · ${user.name}` : ""}
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-light text-fg">
                Bookings
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <PalettePicker />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                signOut();
                clearToken();
                router.push("/admin/login");
              }}
              className="rounded-full border border-line px-4 py-2 font-body text-xs text-muted transition-colors hover:border-accent/60 hover:text-accent"
            >
              Sign out
            </button>
          </div>
        </header>

        {stats && (
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            <Stat label="Pending" value={stats.pending} highlight />
            <Stat label="Approved" value={stats.approved} />
            <Stat label="Rejected" value={stats.rejected} />
            <Stat
              label="Approved revenue"
              value={`Rs ${stats.approvedRevenue.toLocaleString()}`}
            />
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {TABS.map((t) => (
            <button
              key={t.label}
              onClick={() => setTab(t.value)}
              aria-pressed={tab === t.value}
              className={`rounded-full border px-4 py-2 font-body text-xs tracking-wide transition-all duration-500 ease-editorial ${
                tab === t.value
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-fg"
              }`}
            >
              {t.label}
            </button>
          ))}

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, or slot ref…"
            aria-label="Search bookings"
            className="ms-auto w-full border-b border-line bg-transparent py-2 font-body text-sm text-fg placeholder:text-muted/50 outline-none transition-colors focus:border-accent sm:w-72"
          />
        </div>

        {error && (
          <div className="mt-8">
            <Alert>{error}</Alert>
          </div>
        )}

        {bookings === null && !error && (
          <p className="mt-10 font-body text-sm text-muted">Loading…</p>
        )}

        {bookings?.length === 0 && (
          <div className="mt-10 rounded-lg border border-line bg-surface p-14 text-center font-body text-sm text-muted">
            No bookings in this view.
          </div>
        )}

        {bookings && bookings.length > 0 && (
          <>
            <p className="mt-10 font-body text-xs text-muted">
              Showing {bookings.length} of {total}
            </p>

            <ul className="mt-4 space-y-px overflow-hidden rounded-lg border border-line bg-line">
              {bookings.map((b) => (
                <BookingRow key={b._id} booking={b} onChanged={load} />
              ))}
            </ul>

            {bookings.length < total && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-2.5 text-xs"
                >
                  {loadingMore ? "Loading…" : `Load ${Math.min(PAGE_SIZE, total - bookings.length)} more`}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-surface p-6">
      <p className="font-body text-[11px] tracking-[0.18em] text-muted">
        {label.toUpperCase()}
      </p>
      <p
        className={`mt-3 font-display text-3xl font-light ${
          highlight ? "text-accent" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function BookingRow({
  booking: b,
  onChanged,
}: {
  booking: Booking;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [meetLink, setMeetLink] = useState(b.meetLink || "");
  const [note, setNote] = useState("");
  const [rowError, setRowError] = useState("");
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  // Rejecting asks for a reason first rather than firing on the first click —
  // the customer has already paid, so a bare "rejected" guarantees a phone call.
  const [confirmingReject, setConfirmingReject] = useState(false);

  async function act(status: "approved" | "rejected" | "pending") {
    if (status === "rejected" && note.trim().length < 5) {
      setConfirmingReject(true);
      setRowError("Add a short reason before rejecting.");
      return;
    }

    setBusy(true);
    setRowError("");
    setNotice(null);
    try {
      const updated = await updateBookingStatus(b._id, status, {
        meetLink: meetLink || undefined,
        adminNote: note || undefined,
      });
      setConfirmingReject(false);

      // Surface whether the customer was actually emailed. Approving without
      const n = updated.notified;
      if (status !== "pending" && n) {
        setNotice(
          n.sent
            ? { ok: true, text: "Customer notified by email." }
            : {
                ok: false,
                text:
                  n.reason === "no-email"
                    ? "Saved, but this booking has no email address. Contact them on WhatsApp."
                    : `Saved, but the email did NOT send (${n.reason}). Contact them on WhatsApp.`,
              }
        );
      }
      onChanged();
    } catch (err: any) {
      setRowError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="bg-surface p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-light text-fg">{b.customerName}</h2>
            <StatusBadge status={b.status} force="en" />
            {b.user && (
              <span className="rounded-full border border-line px-2.5 py-0.5 font-body text-[10px] tracking-wide text-muted">
                Registered
              </span>
            )}
            {b.paidByThirdParty && (
              <span className="rounded-full border border-accent/50 px-2.5 py-0.5 font-body text-[10px] tracking-wide text-accent">
                Third-party payment
              </span>
            )}
          </div>
          <p className="mt-2 font-body text-sm text-muted">
            {b.serviceType === "call" ? "Initial call" : "Physical session"} · Rs{" "}
            {b.amount.toLocaleString()}
          </p>
        </div>

        <a
          href={`https://wa.me/${b.customerPhone.replace(/\D/g, "").replace(/^0/, "92")}`}
          target="_blank"
          rel="noreferrer noopener"
          className="border-b border-line pb-0.5 font-body text-sm text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {b.customerPhone}
        </a>
      </div>

      <div className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-[180px_1fr]">
        {/* The receipt is the only proof of payment now, so it leads the row
            rather than hiding behind a link the ustad has to think to click. */}
        {b.screenshotUrl && (
          <a
            href={b.screenshotUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative block overflow-hidden rounded-md border border-line transition-colors hover:border-accent"
            title="Open full size"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.screenshotUrl}
              alt={`Payment receipt from ${b.customerName}`}
              loading="lazy"
              className="h-36 w-full bg-surface-2 object-cover object-top"
            />
            <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center font-body text-[10px] tracking-wide text-fg opacity-0 transition-opacity group-hover:opacity-100">
              Open full size ↗
            </span>
          </a>
        )}

        <dl className="grid gap-5 font-body text-xs sm:grid-cols-2">
          <div>
            <dt className="text-muted/70">Slot</dt>
            <dd className="mt-1.5 text-fg">
              {formatSlotRange(b.slotTime, b.slotEndTime)}
            </dd>
            {b.calendlyEventName && (
              <dd className="mt-1 text-muted/70">{b.calendlyEventName}</dd>
            )}
            {!b.slotTime && (
              <dd className="mt-1 text-muted/70">
                Not resolved. Set the Calendly token
              </dd>
            )}
          </div>
          <div>
            <dt className="text-muted/70">Slot reference</dt>
            <dd className="mt-1.5 font-medium tracking-wider text-accent">
              {b.slotReference || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted/70">Submitted</dt>
            <dd className="mt-1.5 text-fg">{formatDateTime(b.createdAt)}</dd>
          </div>
          {/* Present when the customer said the money came from another
              person's account, or on legacy bookings from the older form. */}
          {b.accountTitle && (
            <div>
              <dt className="text-muted/70">
                {b.paidByThirdParty ? "Paid by (third party)" : "Paid from"}
              </dt>
              <dd className="mt-1.5 break-words text-fg">{b.accountTitle}</dd>
            </div>
          )}
          {b.transactionId && (
            <div>
              <dt className="text-muted/70">Transaction ID</dt>
              <dd className="mt-1.5 break-all text-accent">{b.transactionId}</dd>
            </div>
          )}
        </dl>
      </div>

      {b.status === "pending" ? (
        <div className="mt-7 rounded-md border border-line bg-surface-2 p-5">
          <p className="font-body text-[11px] tracking-[0.18em] text-muted">
            VERIFY &amp; RESPOND
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="Google Meet link (optional)"
              aria-label="Google Meet link"
              className="w-full border-b border-line bg-transparent py-2 font-body text-sm text-fg placeholder:text-muted/50 outline-none focus:border-accent"
            />
            <input
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (rowError) setRowError("");
              }}
              placeholder={
                confirmingReject
                  ? "Reason for rejection (required)"
                  : "Note to customer (optional)"
              }
              aria-label="Note to customer"
              aria-invalid={confirmingReject && note.trim().length < 5}
              className={`w-full border-b bg-transparent py-2 font-body text-sm text-fg placeholder:text-muted/50 outline-none focus:border-accent ${
                confirmingReject && note.trim().length < 5
                  ? "border-danger"
                  : "border-line"
              }`}
            />
          </div>

          {rowError && (
            <p className="mt-4 font-body text-xs text-danger">{rowError}</p>
          )}

          {notice && (
            <p
              className={`mt-4 rounded-md border px-3 py-2 font-body text-xs leading-6 ${
                notice.ok
                  ? "border-accent/40 text-accent"
                  : "border-danger/50 text-danger"
              }`}
            >
              {notice.text}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => act("approved")}
              disabled={busy}
              className="px-6 py-2 text-xs"
            >
              {busy ? "…" : "Approve payment"}
            </Button>
            <Button
              variant="outline"
              onClick={() => act("rejected")}
              disabled={busy}
              className="px-6 py-2 text-xs hover:border-danger/60 hover:text-danger"
            >
              {confirmingReject ? "Confirm rejection" : "Reject"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-t border-line pt-5">
          {b.meetLink && (
            <p className="font-body text-xs text-muted">
              Meet link:{" "}
              <a
                href={b.meetLink}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent hover:underline"
              >
                {b.meetLink}
              </a>
            </p>
          )}
          {b.adminNote && (
            <p className="mt-2 font-body text-xs leading-6 text-muted">
              Reason / note: {b.adminNote}
            </p>
          )}

          {rowError && (
            <p className="mt-3 font-body text-xs text-danger">{rowError}</p>
          )}

          {notice && (
            <p
              className={`mt-3 rounded-md border px-3 py-2 font-body text-xs leading-6 ${
                notice.ok
                  ? "border-accent/40 text-accent"
                  : "border-danger/50 text-danger"
              }`}
            >
              {notice.text}
            </p>
          )}

          {/* One wrong tap used to be permanent. */}
          <button
            type="button"
            onClick={() => act("pending")}
            disabled={busy}
            className="mt-4 border-b border-line pb-0.5 font-body text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {busy ? "…" : "↩ Undo, move back to pending"}
          </button>
        </div>
      )}
    </li>
  );
}

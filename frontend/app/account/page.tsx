"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import { fetchMyBookings, MyBooking } from "@/lib/auth";
import { CONTACT_LINK } from "@/lib/site";
import { useLang } from "@/components/LanguageProvider";
import WhatsAppFab from "@/components/WhatsAppFab";
import { formatDateTime, formatSlotRange } from "@/lib/datetime";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { t } = useLang();
  const [bookings, setBookings] = useState<MyBooking[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/account/login?next=/account");
      return;
    }
    fetchMyBookings()
      .then(setBookings)
      .catch((err) => setError(err.message));
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <>
        <Header />
        <main className="grid min-h-[60vh] place-items-center px-6">
          <p className="font-body text-sm text-muted">{t.auth.loading}</p>
        </main>
        <WhatsAppFab />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="eyebrow font-body" dir="ltr">
              {t.auth.myAccount}
            </p>
            <h1 className="mt-4 text-title font-light text-fg">
              {t.auth.welcome}, {user.name}
            </h1>
            <p className="mt-3 font-body text-sm text-muted" dir="ltr">
              {user.phone}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="font-body text-sm text-muted transition-colors hover:text-accent"
          >
            {t.auth.signOut}
          </button>
        </div>

        <h2 className="mt-14 font-body text-[11px] tracking-[0.22em] text-muted" dir="ltr">
          {t.auth.myBookings}
        </h2>

        {error && (
          <p className="mt-6 font-body text-sm text-danger">{error}</p>
        )}

        {bookings === null && !error && (
          <p className="mt-8 font-body text-sm text-muted">{t.auth.loading}</p>
        )}

        {bookings?.length === 0 && (
          <div className="mt-8 rounded-lg border border-line bg-surface p-12 text-center">
            <p className="font-body text-sm leading-8 text-muted">
              {t.auth.noBookings}
            </p>
            <Button as={Link} href="/booking" className="mt-7">
              {t.auth.bookNow}
            </Button>
          </div>
        )}

        {bookings && bookings.length > 0 && (
          <ul className="mt-8 space-y-px overflow-hidden rounded-lg border border-line bg-line">
            {bookings.map((b) => (
              <li key={b._id} className="bg-surface p-7 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-light text-fg">
                      {b.serviceType === "call" ? t.reviews.serviceCall : t.reviews.servicePhysical}
                    </h3>
                    <p className="mt-2 font-body text-sm text-muted">
                      {b.amount.toLocaleString()} {t.services.currency}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <dl className="mt-6 grid gap-4 border-t border-line pt-5 font-body text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-muted/70">{t.auth.slotTime}</dt>
                    <dd className="mt-1.5 text-fg" dir="ltr">
                      {formatSlotRange(b.slotTime, b.slotEndTime)}
                    </dd>
                  </div>
                  {b.slotReference && (
                    <div>
                      <dt className="text-muted/70">{t.auth.slotRef}</dt>
                      <dd className="mt-1.5 tracking-wider text-accent" dir="ltr">
                        {b.slotReference}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted/70">{t.auth.requestedOn}</dt>
                    <dd className="mt-1.5 text-fg" dir="ltr">
                      {formatDateTime(b.createdAt)}
                    </dd>
                  </div>
                  {b.screenshotUrl && (
                    <div>
                      <dt className="text-muted/70">{t.auth.receipt}</dt>
                      <dd className="mt-1.5">
                        <a
                          href={b.screenshotUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="border-b border-line pb-0.5 text-fg transition-colors hover:border-accent hover:text-accent"
                        >
                          {t.auth.viewReceipt}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                {/* The number only exists in this payload when the API has
                    confirmed the booking is approved. */}
                {b.status === "approved" && b.contactNumber && (
                  <div className="mt-6 rounded-lg border border-accent/40 bg-accent/5 p-5">
                    <p className="font-body text-[11px] tracking-[0.18em] text-accent">
                      {t.auth.contactLabel}
                    </p>
                    <a
                      href={`tel:${b.contactNumber.replace(/\s/g, "")}`}
                      dir="ltr"
                      className="mt-2 block font-display text-2xl font-light tracking-wide text-fg transition-colors hover:text-accent"
                    >
                      {b.contactNumber}
                    </a>
                    <p className="mt-3 font-body text-xs leading-7 text-muted">
{t.auth.contactHint1}{" "}
                      <span className="text-fg" dir="ltr">
                        {formatSlotRange(b.slotTime, b.slotEndTime)}
                      </span>
                      {t.auth.contactHint2}
                    </p>
                  </div>
                )}

                {b.status === "approved" && b.meetLink && (
                  <a
                    href={b.meetLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-block border-b border-accent/50 pb-0.5 font-body text-sm text-accent hover:border-accent"
                    dir="ltr"
                  >
                    {t.auth.joinSession}
                  </a>
                )}

                {b.adminNote && (
                  <p className="mt-5 rounded-md border border-line bg-surface-2 px-4 py-3 font-body text-xs leading-7 text-muted">
                    {b.adminNote}
                  </p>
                )}

                {b.status === "pending" && (
                  <p className="mt-5 font-body text-xs leading-7 text-muted/70">
{t.auth.pendingNote}
                  </p>
                )}

                {b.status === "rejected" && (
                  <a
                    href={CONTACT_LINK}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-block border-b border-line pb-0.5 font-body text-xs text-fg hover:border-accent hover:text-accent"
                  >
                    {t.auth.rejectedHelp}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

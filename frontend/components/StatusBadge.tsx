"use client";

import { useLang } from "./LanguageProvider";

const STATUS = {
  pending: {
    en: "Pending",
    className: "border-accent/45 text-accent",
  },
  approved: {
    en: "Approved",
    className: "border-emerald-500/50 text-emerald-500",
  },
  rejected: {
    en: "Rejected",
    className: "border-danger/50 text-danger",
  },
} as const;

export type BookingStatus = keyof typeof STATUS;

/**
 * Approved/rejected keep a green/red read because they're a verification
 * result, not decoration — this is the one place the palette makes room for
 * semantic colour, and it's what the ustad scans for.
 */
export default function StatusBadge({
  status,
  force,
}: {
  status: BookingStatus;
  /** Admin panel is English-only, so it opts out of the site language. */
  force?: "en";
}) {
  const { t, lang } = useLang();
  const s = STATUS[status] ?? STATUS.pending;
  const label = force === "en" ? s.en : t.account.status[status];

  return (
    <span

      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-body text-[11px] tracking-wide ${s.className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

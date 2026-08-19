"use client";

import { useState } from "react";

/**
 * Shows a payment detail (account number / IBAN / title) with a big copy
 * button. Retyping an account number is the most common place a payment goes
 * to the wrong account, so copying is the default action here rather than an
 * extra.
 */
export default function CopyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Older mobile browsers without the clipboard API
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gold/60 bg-white px-4 py-3">
      <div className="min-w-0 text-right">
        <p className="font-body text-xs text-navy/55">{label}</p>
        <p className="mt-0.5 truncate font-body text-lg font-semibold tracking-wide text-navy" dir="ltr">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${label} کاپی کریں`}
        className="shrink-0 rounded-full border border-gold-deep bg-gold-soft px-4 py-2 font-body text-xs font-semibold text-gold-dark transition hover:bg-gold hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
      >
        {copied ? "✓ کاپی ہو گیا" : "کاپی کریں"}
      </button>
    </div>
  );
}

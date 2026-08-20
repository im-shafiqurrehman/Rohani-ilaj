"use client";

import { useState } from "react";
import { useLang } from "./LanguageProvider";

/**
 * Shows a payment detail (account number / IBAN / title) with a copy button.
 * Retyping an account number is the most common way a payment ends up in the
 * wrong account, so copying is the default action rather than an extra.
 */
export default function CopyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { t } = useLang();
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
    <div className="flex items-center justify-between gap-4 border-b border-line py-4">
      <div className="min-w-0">
        <p className="font-body text-[11px] tracking-wide text-muted">{label}</p>
        <p className="mt-1.5 truncate font-body text-sm tracking-wide text-fg" dir="ltr">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${t.booking.copy}: ${label}`}
        className={`shrink-0 rounded-full border px-4 py-1.5 font-body text-[11px] tracking-wide transition-all duration-500 ease-editorial focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
          copied
            ? "border-accent text-accent"
            : "border-line text-muted hover:border-accent/60 hover:text-accent"
        }`}
      >
        {copied ? t.booking.copied : t.booking.copy}
      </button>
    </div>
  );
}

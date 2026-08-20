"use client";

import { useLang } from "./LanguageProvider";
import { LANGS, Lang } from "@/lib/i18n";

const LABEL: Record<Lang, string> = { ur: "اردو", en: "EN" };

/**
 * Two-state segmented switch rather than a dropdown: with only two languages
 * a menu costs an extra click and hides the option you want. Both labels are
 * written in their own script, so each is legible to the person who needs it.
 */
export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-line p-0.5"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            lang={l}
            className={`rounded-full px-2.5 py-1 font-body text-[11px] leading-none tracking-wide transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
              active
                ? "bg-accent text-accent-fg"
                : "text-muted hover:text-fg"
            }`}
          >
            {LABEL[l]}
          </button>
        );
      })}
    </div>
  );
}

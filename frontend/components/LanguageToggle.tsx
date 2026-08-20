"use client";

import { useLang } from "./LanguageProvider";
import { LANGS, Lang } from "@/lib/i18n";

const LABEL: Record<Lang, string> = { ur: "اردو", en: "English" };
/** The header is tight on a 360px screen, so English shortens to EN there. */
const SHORT: Record<Lang, string> = { ur: "اردو", en: "EN" };

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
            <span className="sm:hidden">{SHORT[l]}</span>
            <span className="hidden sm:inline">{LABEL[l]}</span>
          </button>
        );
      })}
    </div>
  );
}

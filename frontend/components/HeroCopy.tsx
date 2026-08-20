"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";

export default function HeroCopy({ hasBanner }: { hasBanner: boolean }) {
  const { t } = useLang();

  return (
    <div
      className={`mx-auto flex max-w-4xl flex-col items-center px-6 text-center ${
        hasBanner ? "py-36 sm:py-48" : "py-28 sm:py-40"
      }`}
    >
      <p className="eyebrow reveal font-body" dir="ltr">
        {t.hero.eyebrow}
      </p>
      <span className="rule-accent reveal mt-5" style={{ animationDelay: "80ms" }} />

      <h1
        className="reveal mt-8 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] font-light leading-[1.22] tracking-[-0.015em] text-fg"
        style={{ animationDelay: "140ms" }}
      >
        {t.hero.title1}{" "}
        <span className="text-accent-gradient">{t.hero.title2}</span>
      </h1>

      <p
        className="reveal mt-7 max-w-measure font-body text-base leading-9 text-muted sm:text-lg"
        style={{ animationDelay: "220ms" }}
      >
        {t.hero.lede}
      </p>

      <div
        className="reveal mt-12 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
        style={{ animationDelay: "300ms" }}
      >
        <Link
          href="/booking"
          className="glow-button w-full rounded-full bg-accent px-8 py-3.5 text-center font-body text-sm tracking-wide text-accent-fg transition-all duration-500 ease-editorial hover:brightness-110 sm:w-auto"
        >
          {t.hero.ctaBook}
        </Link>
        <Link
          href="/services"
          className="btn-outline w-full rounded-full px-8 py-3.5 text-center font-body text-sm tracking-wide sm:w-auto"
        >
          {t.hero.ctaServices}
        </Link>
      </div>

      <p
        className="reveal mt-11 inline-block rounded-full border border-line px-5 py-2 font-body text-xs tracking-wide text-muted"
        style={{ animationDelay: "380ms" }}
      >
        {t.hero.note}
      </p>
    </div>
  );
}

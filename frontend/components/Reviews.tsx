"use client";

import { Section } from "./ui";
import Reveal from "./Reveal";
import { AVERAGE_RATING, REVIEWS, REVIEWS_ARE_REAL } from "@/lib/reviews";
import Link from "next/link";
import { useLang } from "./LanguageProvider";

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5`} dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
          className={i <= rating ? "text-accent" : "text-muted/25"}
        >
          <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35l-5.81 3.05 1.11-6.47L2.6 9.35l6.5-.95L12 2.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { lang, t } = useLang();
  return (
    <Section
      id="reviews"
      eyebrow={t.reviews.eyebrow}
      title={t.reviews.title}
      lede={t.reviews.lede}
    >
      <div className="mt-10 flex flex-col items-center gap-3">
        <Stars rating={Math.round(AVERAGE_RATING)} size={18} />
        <p className="font-body text-sm text-muted">
          <span className="text-fg">{AVERAGE_RATING.toFixed(1)}</span>{" "}
          {t.reviews.average} · {REVIEWS.length} {t.reviews.count}
        </p>
        {!REVIEWS_ARE_REAL && (
          <p
            className="mt-1 rounded-full border border-accent/40 px-4 py-1.5 font-body text-[11px] tracking-wide text-accent"
          >
            {t.reviews.sample}
          </p>
        )}
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Reveal
            as="figure"
            key={`${r.name}-${r.city}`}
            delay={i * 80}
            variant="scale"
            className="lift-hover flex flex-col bg-surface p-8 transition-colors duration-500 ease-editorial hover:bg-surface-2"
          >
            <Stars rating={r.rating} />
            <blockquote className="mt-6 flex-1 font-body text-sm leading-8 text-muted">
              {lang === "en" ? r.textEn : r.text}
            </blockquote>
            <figcaption className="mt-7 border-t border-line pt-5">
              <p className="font-body text-sm text-fg">{r.name}</p>
              <p className="mt-1 font-body text-[11px] tracking-wide text-muted/70">
                {r.city} ·{" "}
                {r.service === "call"
                  ? t.reviews.serviceCall
                  : t.reviews.servicePhysical}
              </p>
            </figcaption>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 border-b border-line pb-1 font-body text-sm text-fg transition-colors duration-500 ease-editorial hover:border-accent hover:text-accent"
        >
          {t.reviews.cta}
          <span aria-hidden="true">←</span>
        </Link>

      </div>
    </Section>
  );
}

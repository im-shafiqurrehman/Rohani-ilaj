"use client";

import Link from "next/link";
import { Section } from "./ui";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

const PRICES = { call: "2,000", physical: "5,000" } as const;
const KEYS = ["call", "physical"] as const;

export default function Services() {
  const { t } = useLang();

  return (
    <Section
      id="services"
      eyebrow={t.services.eyebrow}
      title={t.services.title}
      lede={t.services.lede}
      tone="surface"
    >
      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {KEYS.map((key, i) => {
          const s = t.services[key];
          return (
            <Reveal
              key={key}
              delay={i * 120}
              variant="scale"
              className="lift-hover group flex flex-col bg-surface p-9 transition-colors duration-500 ease-editorial hover:bg-surface-2 sm:p-11"
            >
              <p className="eyebrow font-body" dir="ltr">
                {key === "call" ? "Initial Call" : "Physical Session"}
              </p>

              <h3 className="mt-6 text-3xl font-light text-fg">{s.title}</h3>

              <div className="mt-7 flex items-baseline gap-2">
                <span className="font-display text-4xl font-light text-accent">
                  {PRICES[key]}
                </span>
                <span className="font-body text-sm text-muted">
                  {t.services.currency}
                </span>
              </div>

              <dl className="mt-7 space-y-2.5 border-t border-line pt-6 font-body text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.services.duration}</dt>
                  <dd className="text-fg">{s.durationValue}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t.services.method}</dt>
                  <dd className="text-end text-fg">{s.note}</dd>
                </div>
              </dl>

              <p className="mt-7 flex-1 font-body text-sm leading-8 text-muted">
                {s.desc}
              </p>

              <Link
                href={`/booking?service=${key}`}
                className="mt-9 inline-flex items-center gap-2 self-start border-b border-line pb-1 font-body text-sm text-fg transition-colors duration-500 ease-editorial group-hover:border-accent group-hover:text-accent"
              >
                {t.services.book}
                <span aria-hidden="true">←</span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-8 text-center font-body text-xs leading-7 text-muted/70">
        {t.services.footnote}
      </p>
    </Section>
  );
}

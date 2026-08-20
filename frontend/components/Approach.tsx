"use client";

import { Section } from "./ui";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

export default function Approach() {
  const { t } = useLang();

  return (
    <Section
      eyebrow={t.approach.eyebrow}
      title={t.approach.title}
      lede={t.approach.lede}
      tone="surface"
    >
      {/* A checklist of what we actually do, rather than a badge asserting a
          standard. Each line is something a visitor can hold us to. */}
      <div className="mx-auto mt-14 max-w-2xl">
        <ul className="grid gap-x-8 gap-y-4 text-start sm:grid-cols-2">
          {t.approach.principles.map((item, i) => (
            <Reveal
              as="li"
              key={item}
              delay={i * 70}
              className="flex items-start gap-3 border-b border-line pb-4"
            >
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true"
                className="mt-1.5 shrink-0 text-accent"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="font-body text-sm leading-7 text-fg">{item}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {t.approach.points.map((p, i) => (
          <Reveal key={p.en} delay={i * 100} className="bg-surface p-9 sm:p-10">
            <p className="eyebrow font-body" dir="ltr">
              {p.en}
            </p>
            <h3 className="mt-5 text-xl font-light text-fg">{p.title}</h3>
            <p className="mt-4 font-body text-sm leading-8 text-muted">
              {p.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

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

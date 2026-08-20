"use client";

import { Section } from "./ui";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";

export default function Process() {
  const { t } = useLang();

  return (
    <Section
      id="process"
      eyebrow={t.process.eyebrow}
      title={t.process.title}
      lede={t.process.lede}
    >
      <ol className="mt-16 border-t border-line">
        {t.process.steps.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 90}
            variant="right"
            className="group grid gap-3 border-b border-line py-8 transition-colors duration-500 ease-editorial sm:grid-cols-[auto_1fr_1.4fr] sm:items-baseline sm:gap-10"
          >
            <span
              dir="ltr"
              className="font-display text-2xl font-light tabular-nums text-muted/50 transition-colors duration-500 group-hover:text-accent"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-light text-fg">{s.title}</h3>
            <p className="font-body text-sm leading-8 text-muted">{s.desc}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

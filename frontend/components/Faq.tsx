"use client";

import { useState } from "react";
import { Section } from "./ui";
import Reveal from "./Reveal";
import { FAQS } from "@/lib/faqs";
import { useLang } from "./LanguageProvider";

export default function Faq() {
  const { lang, t } = useLang();
  const faqs = FAQS[lang];
  // Native <details> would be simpler, but controlling it lets only one panel
  // stay open, which keeps the section from becoming a wall of text.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      eyebrow={t.faq.eyebrow}
      title={t.faq.title}
      lede={t.faq.lede}
      tone="surface"
    >
      <div className="mx-auto mt-16 max-w-3xl border-t border-line">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 60} className="border-b border-line">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-start justify-between gap-6 py-6 text-start transition-colors duration-300 hover:text-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <span
                    className={`text-lg font-light leading-8 transition-colors duration-300 ${
                      isOpen ? "text-accent" : "text-fg"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-2.5 shrink-0 transition-transform duration-500 ease-editorial ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                data-open={isOpen}
                aria-hidden={!isOpen}
                className="collapse font-body text-sm leading-8 text-muted"
              >
                <div>
                  <p className="pb-7">{f.a}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

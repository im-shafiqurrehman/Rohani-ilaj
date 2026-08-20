"use client";

import PageShell from "./PageShell";
import { useLang } from "./LanguageProvider";
import { POLICIES, PolicyKey } from "@/lib/policies";

export default function PolicyPage({ policy }: { policy: PolicyKey }) {
  const { lang } = useLang();
  const doc = POLICIES[lang][policy];

  return (
    <PageShell>
      <article className="mx-auto max-w-measure px-6 py-24 font-body">
        <p className="eyebrow">{doc.eyebrow}</p>
        <span className="rule-accent mt-4 block" />
        <h1 className="mt-6 text-title font-light text-fg">{doc.title}</h1>
        <p className="mt-4 text-xs text-muted">
          {lang === "ur" ? "آخری تبدیلی: " : "Last updated: "}
          {doc.updated}
        </p>

        <div className="policy mt-12 text-sm leading-8 text-muted">
          {doc.blocks.map((b, i) => (
            <section key={i}>
              {b.h && <h2>{b.h}</h2>}
              {b.p?.map((t, j) => (
                <p key={j}>{t}</p>
              ))}
              {b.ul && (
                <ul>
                  {b.ul.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}

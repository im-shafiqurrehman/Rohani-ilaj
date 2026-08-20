"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Section } from "./ui";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { ABOUT } from "@/lib/about";

/** An eight-point star, the quietest Islamic motif that still reads as one. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none">
      <path
        d="M16 2.5 19.4 12.6 29.5 16 19.4 19.4 16 29.5 12.6 19.4 2.5 16 12.6 12.6Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect
        x="7.5" y="7.5" width="17" height="17"
        stroke="currentColor" strokeWidth="0.75"
        transform="rotate(45 16 16)"
      />
    </svg>
  );
}

export default function About() {
  const { lang } = useLang();
  const a = ABOUT[lang];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div className="grid-bg grid-fade absolute inset-0 -z-10" />
        <div className="vignette absolute inset-0 -z-10" />

        <div className="mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
          <Reveal as="p" className="eyebrow font-body">
            {a.eyebrow}
          </Reveal>
          <Reveal delay={80} variant="left">
            <span className="rule-accent mx-auto mt-5 block" />
          </Reveal>
          <Reveal
            as="h1"
            delay={140}
            className="mt-7 text-[clamp(1.9rem,4.6vw,3rem)] font-light leading-[1.25] text-fg"
          >
            {a.title}
          </Reveal>
          <Reveal
            as="p"
            delay={220}
            className="mx-auto mt-6 max-w-measure font-body text-base leading-9 text-muted"
          >
            {a.lede}
          </Reveal>
        </div>
      </section>

      {/* ── Practitioner profile ─────────────────────────────────────── */}
      <Section tone="surface" className="!py-20 sm:!py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal variant="scale">
            <div className="lift-hover relative overflow-hidden rounded-lg border border-line bg-ink p-8 sm:p-12">
              <Star className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-accent/10" />

              <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-8 sm:text-start">
                {/* No photograph was supplied, so the mark stands in rather
                    than a stock face or an invented portrait. */}
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-accent/40 bg-surface">
                  <Image
                    src="/asset/logo-mark.png"
                    alt=""
                    width={421}
                    height={541}
                    className="h-14 w-auto"
                  />
                </span>

                <div>
                  <p className="eyebrow font-body">{a.profileHeading}</p>
                  <p className="mt-3 font-display text-3xl font-light text-fg sm:text-4xl">
                    {a.fields[0].value}
                  </p>
                </div>
              </div>

              <dl className="relative mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                {a.fields.map((f) => (
                  <div key={f.label} className="bg-surface px-6 py-5">
                    <dt className="font-body text-[11px] tracking-[0.18em] text-muted">
                      {f.label}
                    </dt>
                    <dd className="mt-2 font-body text-base text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Intro, experience, trust ─────────────────────────────────── */}
      <Section className="!py-20 sm:!py-28">
        <div className="mx-auto max-w-measure space-y-16">
          <Reveal>
            <div className="space-y-5 font-body text-sm leading-8 text-muted">
              {a.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="border-t border-line pt-10">
              <h2 className="flex items-center gap-3 text-xl font-light text-fg">
                <Star className="h-4 w-4 shrink-0 text-accent" />
                {a.approachHeading}
              </h2>
              <div className="mt-5 space-y-5 font-body text-sm leading-8 text-muted">
                {a.approach.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="rounded-lg border border-line bg-surface p-8">
              <h2 className="flex items-center gap-3 text-xl font-light text-fg">
                <Star className="h-4 w-4 shrink-0 text-accent" />
                {a.trustHeading}
              </h2>
              <p className="mt-5 font-body text-sm leading-8 text-muted">
                {a.trust}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Section tone="surface" className="!py-20 sm:!py-24">
        <Reveal className="mx-auto max-w-measure text-center">
          <Star className="mx-auto h-6 w-6 text-accent/60" />
          <h2 className="mt-6 text-2xl font-light text-fg">{a.ctaHeading}</h2>
          <p className="mx-auto mt-4 max-w-sm font-body text-sm leading-8 text-muted">
            {a.ctaBody}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button as={Link} href="/booking">
              {a.cta}
            </Button>
            <Button as={Link} href="/services" variant="outline">
              {a.ctaSecondary}
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}

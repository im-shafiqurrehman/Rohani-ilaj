"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button, Field, Alert, Section } from "./ui";
import Reveal from "./Reveal";
import { useLang } from "./LanguageProvider";
import { ContactError, submitReview } from "@/lib/api";
import { SITE } from "@/lib/site";

const SERVICES = ["call", "physical"] as const;

export default function ReviewForm() {
  const { t } = useLang();
  const [service, setService] = useState<(typeof SERVICES)[number] | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const review = String(f.get("review") || "").trim();

    if (name.length < 2) return setError(t.feedback.errName);
    if (!service) return setError(t.feedback.errService);
    if (rating < 1) return setError(t.feedback.errRating);
    if (review.length < 15) return setError(t.feedback.errReview);
    if (!consent) return setError(t.feedback.errConsent);

    setStatus("loading");
    setError("");
    setErrorEmail("");

    try {
      await submitReview({
        name,
        city: String(f.get("city") || "").trim() || undefined,
        service,
        rating,
        review,
        contact: String(f.get("contact") || "").trim() || undefined,
        consent: true,
        website: String(f.get("website") || ""),
      });
      setStatus("done");
    } catch (err: any) {
      setStatus("idle");
      if (err instanceof ContactError && err.code) {
        const to = err.contactEmail || SITE.email;
        setError(err.message);
        if (to) setErrorEmail(to);
        return;
      }
      setError(err.message || t.feedback.errGeneric);
    }
  }

  if (status === "done") {
    return (
      <Section eyebrow={t.feedback.eyebrow} title={t.feedback.doneTitle}>
        <div className="mx-auto mt-10 max-w-measure text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/50 text-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="mt-6 font-body text-sm leading-8 text-muted">
            {t.feedback.doneBody}
          </p>
          <Button as={Link} href="/" className="mt-9">
            {t.feedback.backHome}
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section
      eyebrow={t.feedback.eyebrow}
      title={t.feedback.title}
      lede={t.feedback.lede}
    >
      <Reveal className="mx-auto mt-14 max-w-xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-lg border border-line bg-surface p-8 sm:p-10"
        >
          <div className="grid gap-8 sm:grid-cols-2">
            <Field label={t.feedback.name} hint={t.feedback.nameHint} name="name" required />
            <Field label={t.feedback.city} name="city" />
          </div>

          <fieldset>
            <legend className="font-body text-xs tracking-wide text-muted">
              {t.feedback.service}
            </legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setService(s);
                    setError("");
                  }}
                  aria-pressed={service === s}
                  className={`rounded-full border px-4 py-2 font-body text-xs transition-colors ${
                    service === s
                      ? "border-accent text-accent"
                      : "border-line text-muted hover:text-fg"
                  }`}
                >
                  {s === "call"
                    ? t.reviews.serviceCall
                    : t.reviews.servicePhysical}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-body text-xs tracking-wide text-muted">
              {t.feedback.rating}
            </legend>
            <div className="mt-3 flex items-center gap-1.5" dir="ltr" onMouseLeave={() => setHovered(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setRating(n);
                    setError("");
                  }}
                  onMouseEnter={() => setHovered(n)}
                  aria-label={`${n} / 5`}
                  aria-pressed={rating === n}
                  className="rounded p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <svg
                    width="26" height="26" viewBox="0 0 24 24" fill="currentColor"
                    className={n <= (hovered || rating) ? "text-accent" : "text-muted/25"}
                  >
                    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.35l-5.81 3.05 1.11-6.47L2.6 9.35l6.5-.95L12 2.5z" />
                  </svg>
                </button>
              ))}
            </div>
            <p className="mt-2 font-body text-[11px] text-muted/70">
              {t.feedback.ratingHint}
            </p>
          </fieldset>

          <Field label={t.feedback.review} name="review" as="textarea" rows={5} required />
          <Field label={t.feedback.contact} hint={t.feedback.contactHint} name="contact" />

          {/* Nothing is published without this, so it is a hard requirement
              rather than a pre-ticked convenience. */}
          <div className="rounded-md border border-line bg-ink p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  setError("");
                }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]"
              />
              <span className="font-body text-sm leading-7 text-fg">
                {t.feedback.consent}
              </span>
            </label>
            <p className="mt-2 font-body text-[11px] leading-6 text-muted/70">
              {t.feedback.consentHint}
            </p>
          </div>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0" />

          {error && (
            <Alert>
              {error}
              {errorEmail && (
                <>
                  {" "}
                  <a href={`mailto:${errorEmail}`} dir="ltr" className="underline underline-offset-2">
                    {errorEmail}
                  </a>
                </>
              )}
            </Alert>
          )}

          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" ? t.feedback.sending : t.feedback.submit}
          </Button>
        </form>
      </Reveal>
    </Section>
  );
}

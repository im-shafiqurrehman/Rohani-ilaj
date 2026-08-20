"use client";

import { FormEvent, useState } from "react";
import { Section, Field, Button, Alert } from "./ui";
import Reveal from "./Reveal";
import SocialIcons from "./SocialIcons";
import { ContactError, ContactTopic, submitContact } from "@/lib/api";
import { SITE } from "@/lib/site";
import { useLang } from "./LanguageProvider";

const TOPIC_KEYS: ContactTopic[] = ["sawal", "booking", "tassur", "deegar"];

export default function ContactForm() {
  const { t } = useLang();
  const [topic, setTopic] = useState<ContactTopic>("sawal");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  // Rendered as a mailto link, so the reader never has to retype an address.
  const [errorEmail, setErrorEmail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 3) return setError(t.contact.errName);
    if (phone.replace(/\D/g, "").length < 10)
      return setError(t.contact.errPhone);
    if (message.length < 10)
      return setError(t.contact.errMessage);

    setStatus("loading");
    setError("");
    setErrorEmail("");

    try {
      await submitContact({
        name,
        phone,
        email: String(data.get("email") || "").trim(),
        topic,
        message,
        website: String(data.get("website") || ""),
      });
      setStatus("done");
    } catch (err: any) {
      setStatus("idle");
      setErrorEmail("");

      if (err instanceof ContactError && err.code) {
        const to = err.contactEmail || SITE.email;
        if (to) {
          setError(t.contact.errUnavailable);
          setErrorEmail(to);
        } else {
          setError(t.contact.errUnavailablePlain);
        }
        return;
      }
      setError(err.message || t.contact.errGeneric);
    }
  }

  return (
    <Section
      id="contact"
      eyebrow={t.contact.eyebrow}
      title={t.contact.title}
      align="start"
    >
      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.25fr]">
        <Reveal variant="left">
          <p className="max-w-measure font-body text-sm leading-8 text-muted">
{t.contact.lede}
          </p>

          <dl className="mt-10 space-y-7" dir="ltr">
            {SITE.email && (
              <div>
                <dt className="font-body text-[11px] tracking-[0.22em] text-muted/70">
                  {t.contact.emailLabel}
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${SITE.email}`}
                    className="break-all font-body text-sm text-fg transition-colors duration-300 hover:text-accent"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="font-body text-[11px] tracking-[0.22em] text-muted/70">
                {t.contact.addressLabel}
              </dt>
              <dd className="mt-2 max-w-xs font-body text-sm leading-7 text-fg">
                {SITE.address}
              </dd>
            </div>
          </dl>

          <SocialIcons className="mt-10" />
        </Reveal>

        <Reveal variant="right" delay={120} className="rounded-lg border border-line bg-surface p-8 sm:p-10">
          {status === "done" ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/50 text-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="mt-6 text-xl font-light text-fg">
                {t.contact.doneTitle}
              </p>
              <p className="mx-auto mt-3 max-w-xs font-body text-sm leading-8 text-muted">
{t.contact.doneBody}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <fieldset>
                <legend className="font-body text-xs tracking-wide text-muted">
                  {t.contact.topicLabel}
                </legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {TOPIC_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTopic(key)}
                      aria-pressed={topic === key}
                      className={`rounded-full border px-4 py-2 font-body text-xs transition-all duration-500 ease-editorial focus:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                        topic === key
                          ? "border-accent text-accent"
                          : "border-line text-muted hover:text-fg"
                      }`}
                    >
                      {t.contact.topics[key]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <Field label={t.contact.name} name="name" required />
              <Field
                label={t.contact.phone}
                name="phone"
                type="tel"
                inputMode="numeric"
                placeholder="03XX-XXXXXXX"
                required
              />
              <Field
                label={t.contact.email}
                hint={t.contact.emailHint}
                name="email"
                type="email"
              />
              <Field
                label={t.contact.message}
                name="message"
                as="textarea"
                rows={5}
                required
              />

              {/* Honeypot — invisible to people, tempting to bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {error && (
                <Alert>
                  {error}
                  {errorEmail && (
                    <>
                      {" "}
                      <a
                        href={`mailto:${errorEmail}`}
                        dir="ltr"
                        className="underline underline-offset-2"
                      >
                        {errorEmail}
                      </a>
                    </>
                  )}
                </Alert>
              )}

              <Button type="submit" disabled={status === "loading"} className="w-full">
                {status === "loading" ? t.contact.sending : t.contact.submit}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

"use client";

import { FormEvent, useState } from "react";
import ArchCard from "./ArchCard";
import PatternDivider from "./PatternDivider";
import { ContactTopic, submitContact } from "@/lib/api";

const WA = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923173810763").replace(/\D/g, "");
const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "";

const TOPICS: { value: ContactTopic; label: string }[] = [
  { value: "sawal", label: "کوئی سوال" },
  { value: "booking", label: "بکنگ میں مدد" },
  { value: "tassur", label: "اپنا تاثر بھیجیں" },
  { value: "deegar", label: "دیگر" },
];

/**
 * The one public form on the site that isn't tied to a booking. Whatever a
 * visitor sends here is emailed straight to the business inbox, so questions,
 * booking problems, and client feedback all arrive in one place without the
 * practitioner's phone number being exposed.
 */
export default function ContactForm() {
  const [topic, setTopic] = useState<ContactTopic>("sawal");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (name.length < 3) {
      setErrorMsg("براہِ کرم اپنا پورا نام لکھیں۔");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("براہِ کرم درست فون نمبر لکھیں۔");
      return;
    }
    if (message.length < 10) {
      setErrorMsg("براہِ کرم اپنی بات تھوڑی تفصیل سے لکھیں۔");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

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
      setStatus("error");
      setErrorMsg(err.message || "پیغام نہیں بھیجا جا سکا، دوبارہ کوشش کریں۔");
    }
  }

  return (
    <section id="rabta" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl text-navy">
          ہم سے <span className="text-gold-gradient">رابطہ</span>
        </h2>
        <PatternDivider />
        <p className="mx-auto mt-4 max-w-lg font-body text-base leading-8 text-navy/75">
          سوال، بکنگ میں مدد یا اپنا تاثر — نیچے لکھ کر بھیج دیں۔ آپ کا پیغام
          براہِ راست ہمارے ای میل پر پہنچے گا۔
        </p>
        {EMAIL && (
          <a
            href={`mailto:${EMAIL}`}
            dir="ltr"
            className="mt-3 inline-block font-body text-sm font-semibold text-gold-dark transition hover:text-navy"
          >
            {EMAIL}
          </a>
        )}

        <div className="mt-10 text-right">
          <ArchCard archHeight={44} className="p-7 pt-11 sm:p-9 sm:pt-14">
            {status === "done" ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-2xl text-gold">
                  ✓
                </div>
                <p className="mt-5 text-xl text-navy">آپ کا پیغام موصول ہو گیا</p>
                <p className="mt-3 font-body text-sm leading-7 text-navy/75">
                  ہم جلد آپ سے رابطہ کریں گے۔ فوری ضرورت ہو تو واٹس ایپ کریں۔
                </p>
                <a
                  href={`https://wa.me/${WA}`}
                  className="mt-6 inline-block rounded-full border border-gold-deep bg-gold-soft px-6 py-2.5 font-body text-sm font-semibold text-navy transition hover:bg-gold"
                >
                  واٹس ایپ کریں
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <span className="mb-2 block font-body text-sm text-navy/80">
                    آپ کس بارے میں رابطہ کر رہے ہیں؟
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTopic(t.value)}
                        aria-pressed={topic === t.value}
                        className={`rounded-full border px-4 py-2 font-body text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep ${
                          topic === t.value
                            ? "border-navy bg-navy text-white"
                            : "border-gold text-navy/70 hover:bg-gold-soft"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <TextField label="آپ کا نام" name="name" required />
                <TextField
                  label="واٹس ایپ نمبر"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="03XX-XXXXXXX"
                  required
                />
                <TextField
                  label="ای میل (اختیاری)"
                  hint="اگر ای میل پر جواب چاہیے تو لکھیں"
                  name="email"
                  type="email"
                />

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-body text-sm text-navy/80"
                  >
                    آپ کا پیغام
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm leading-7 text-navy placeholder-navy/30 outline-none focus:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold-deep/40"
                  />
                </div>

                {/* Honeypot — hidden from people, tempting to bots. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                {errorMsg && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 font-body text-sm text-red-700"
                  >
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-navy py-3.5 font-body text-base font-semibold text-white shadow-card transition hover:bg-navy-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep disabled:opacity-60"
                >
                  {status === "loading" ? "بھیجا جا رہا ہے..." : "پیغام بھیجیں"}
                </button>
              </form>
            )}
          </ArchCard>
        </div>
      </div>
    </section>
  );
}

function TextField({
  label,
  hint,
  name,
  type = "text",
  inputMode,
  placeholder,
  required,
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  inputMode?: "numeric" | "text" | "email";
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block font-body text-sm text-navy/80">
        {label}
      </label>
      {hint && <p className="mb-2 font-body text-xs text-navy/50">{hint}</p>}
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        required={required}
        className="mt-1 w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm text-navy placeholder-navy/30 outline-none focus:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold-deep/40"
      />
    </div>
  );
}

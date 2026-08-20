"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { submitBooking } from "@/lib/api";
import { compressImage, MAX_UPLOAD_BYTES, MAX_UPLOAD_MB } from "@/lib/upload";
import { useAuth } from "./AuthProvider";
import { useLang } from "./LanguageProvider";
import CopyField from "./CopyField";
import { Field, Button, Alert } from "./ui";
import { CONTACT_LINK } from "@/lib/site";

const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME || "",
  title: process.env.NEXT_PUBLIC_ACCOUNT_TITLE || "",
  number: process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || "",
  iban: process.env.NEXT_PUBLIC_IBAN || "",
};

const PRICES = { call: 2000, physical: 5000 };

export default function PaymentForm({
  serviceType,
  customerName,
  customerPhone,
  customerEmail,
  slotTime,
  calendlyEventUri,
}: {
  serviceType: "call" | "physical";
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  slotTime?: string;
  calendlyEventUri?: string;
}) {
  const { user } = useAuth();
  const { t } = useLang();
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [thirdParty, setThirdParty] = useState(false);
  const [payerName, setPayerName] = useState("");

  async function handleFile(input: File | null) {
    setError("");
    if (preview) URL.revokeObjectURL(preview);

    if (!input) {
      setScreenshot(null);
      setPreview(null);
      return;
    }

    // Downscale before it ever reaches the network. A phone screenshot is
    setCompressing(true);
    const file = await compressImage(input);
    setCompressing(false);

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!screenshot) {
      return setError(t.booking.errScreenshot);
    }
    // Only reachable if compression could not get it under the cap.
    if (screenshot.size > MAX_UPLOAD_BYTES) {
      return setError(t.booking.errTooBig);
    }
    if (thirdParty && payerName.trim().length < 3) {
      return setError(t.booking.errPayer);
    }

    setStatus("loading");
    setError("");

    try {
      await submitBooking({
        serviceType,
        customerName,
        customerPhone,
        customerEmail,
        slotTime,
        calendlyEventUri,
        paymentMethod: "card",
        screenshot,
        paidByThirdParty: thirdParty,
        accountTitle: thirdParty ? payerName.trim() : undefined,
      });
      setStatus("done");
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || t.booking.errGeneric);
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-line bg-surface p-10 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-accent/50 text-accent">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="mt-7 text-2xl font-light text-fg">{t.booking.doneTitle}</p>
        <p className="mx-auto mt-4 max-w-sm font-body text-sm leading-8 text-muted">
{t.booking.doneBody}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          {user ? (
            <Button as={Link} href="/account">
              {t.booking.viewBooking}
            </Button>
          ) : (
            <>
              <Button as={Link} href="/account/signup">
                {t.booking.createAccount}
              </Button>
              <p className="max-w-xs font-body text-[11px] leading-6 text-muted/70">
{t.booking.createAccountNote}
              </p>
            </>
          )}
          <a
            href={CONTACT_LINK}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-2 border-b border-line pb-0.5 font-body text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {t.booking.question}
          </a>
        </div>
      </div>
    );
  }

  const hasBankDetails = Boolean(BANK.number || BANK.iban);

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="rounded-lg border border-line bg-surface p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="font-body text-[11px] tracking-[0.22em] text-muted" dir="ltr">
              {t.booking.amountDue}
            </p>
            <p className="mt-3 font-display text-4xl font-light text-accent">
              {PRICES[serviceType].toLocaleString()}{" "}
              <span className="font-body text-base text-muted">
              {t.services.currency}
            </span>
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-body text-[11px] tracking-wide text-muted">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2.5" />
              <path d="M2 10h20" />
            </svg>
            {t.booking.payMethod}
          </span>
        </div>

        <p className="mt-7 font-body text-sm leading-8 text-muted">
{t.booking.payIntro}
        </p>

        {hasBankDetails ? (
          <div className="mt-8 border-t border-line">
            {BANK.name && <CopyField label={t.booking.bank} value={BANK.name} />}
            {BANK.title && <CopyField label={t.booking.accountTitle} value={BANK.title} />}
            {BANK.number && <CopyField label={t.booking.accountNumber} value={BANK.number} />}
            {BANK.iban && <CopyField label={t.booking.iban} value={BANK.iban} />}
          </div>
        ) : (
          <div className="mt-8">
            <Alert tone="accent">
{t.booking.bankMissing}
            </Alert>
          </div>
        )}
      </div>

      {/* One field. The receipt already shows the account title, the amount
          and the reference number, so asking the customer to retype any of it
          only created a place to make a mistake. */}
      <div>
        <label
          htmlFor="screenshot"
          className="block font-body text-xs tracking-wide text-muted"
        >
          {t.booking.receiptLabel}
        </label>
        <p className="mt-2 font-body text-[11px] leading-6 text-muted/70">
          {t.booking.receiptHint}
        </p>

        <label
          htmlFor="screenshot"
          className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-500 ease-editorial ${
            screenshot
              ? "border-accent/50 bg-surface"
              : "border-line hover:border-accent/50 hover:bg-surface"
          }`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10 5-5 5 5" />
            <path d="M12 5v12" />
          </svg>
          <span className="font-body text-sm text-fg">
            {compressing
              ? t.booking.optimising
              : screenshot
              ? screenshot.name
              : t.booking.choose}
          </span>
          <span className="font-body text-[11px] text-muted/70">
            {t.booking.fileLimit.replace("{max}", String(MAX_UPLOAD_MB))}
          </span>
        </label>

        <input
          id="screenshot"
          type="file"
          accept="image/*"
          required
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
        />

        {preview && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={preview}
            alt=""
            className="mt-5 max-h-64 w-full rounded-lg border border-line object-contain"
          />
        )}

        {/* Asked only when it matters. If the customer paid from their own
            account the name is already on the receipt, so making everyone type
            it is just a field to get wrong. */}
        <div className="mt-8 border-t border-line pt-7">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={thirdParty}
              onChange={(e) => {
                setThirdParty(e.target.checked);
                setError("");
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--accent))]"
            />
            <span className="font-body text-sm leading-7 text-fg">
              {t.booking.thirdParty}
            </span>
          </label>

          {thirdParty && (
            <div className="mt-5">
              <Field
                label={t.booking.payerName}
                hint={t.booking.payerHint}
                name="accountTitle"
                value={payerName}
                onChange={(e: any) => {
                  setPayerName(e.target.value);
                  setError("");
                }}
                required
              />
            </div>
          )}
        </div>
      </div>

      {error && <Alert>{error}</Alert>}

      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? t.booking.submitting : t.booking.submit}
      </Button>
    </form>
  );
}

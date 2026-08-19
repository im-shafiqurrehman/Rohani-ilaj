"use client";

import { useState, FormEvent } from "react";
import { submitBooking } from "@/lib/api";
import CopyField from "./CopyField";

/*
 * Card is the only payment method on offer. The customer pays from their own
 * debit/credit card into the business bank account below, then uploads the
 * receipt here for manual review — Stripe and card-gateway APIs aren't
 * available to this business yet, so verification stays human.
 */
const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME || "";
const ACCOUNT_TITLE = process.env.NEXT_PUBLIC_ACCOUNT_TITLE || "";
const ACCOUNT_NUMBER = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER || "";
const IBAN = process.env.NEXT_PUBLIC_IBAN || "";
const WA = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923173810763").replace(/\D/g, "");

const PRICES = { call: 2000, physical: 5000 };

export default function PaymentForm({
  serviceType,
  customerName,
  customerPhone,
  slotTime,
  calendlyEventUri,
}: {
  serviceType: "call" | "physical";
  customerName: string;
  customerPhone: string;
  slotTime?: string;
  calendlyEventUri?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File | null) {
    setScreenshot(file);
    setErrorMsg("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!screenshot) {
      setErrorMsg("براہِ کرم ادائیگی کا اسکرین شاٹ منسلک کریں۔");
      return;
    }
    if (screenshot.size > 5 * 1024 * 1024) {
      setErrorMsg("اسکرین شاٹ بہت بڑا ہے۔ 5MB سے کم ہونا چاہیے۔");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    const data = new FormData(e.currentTarget);

    try {
      await submitBooking({
        serviceType,
        customerName,
        customerPhone,
        slotTime,
        calendlyEventUri,
        paymentMethod: "card",
        accountTitle: String(data.get("accountTitle")),
        transactionId: String(data.get("transactionId")),
        screenshot,
      });
      setStatus("done");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "کچھ مسئلہ ہو گیا، دوبارہ کوشش کریں۔");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold bg-gold-soft p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy text-2xl text-gold">
          ✓
        </div>
        <p className="mt-5 text-xl text-navy">درخواست موصول ہو گئی ہے</p>
        <p className="mt-3 font-body text-sm leading-7 text-navy/80">
          آپ کی ادائیگی کی تصدیق کے بعد واٹس ایپ پر بکنگ کی مکمل تفصیلات بھیج دی
          جائیں گی۔
        </p>
        <a
          href={`https://wa.me/${WA}`}
          className="mt-6 inline-block rounded-full bg-navy px-6 py-2.5 font-body text-sm text-white transition hover:bg-navy-light"
        >
          کوئی سوال ہے؟ واٹس ایپ کریں
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right">
      <div className="rounded-2xl border border-gold bg-white p-6 shadow-card">
        <p className="font-body text-sm text-navy/60">ادائیگی کی رقم</p>
        <p className="mt-1 text-3xl font-semibold text-navy">
          {PRICES[serviceType].toLocaleString()} روپے
        </p>

        <div className="mt-5 flex items-center gap-2 rounded-full border border-gold-deep bg-gradient-to-b from-gold-light to-gold px-4 py-2.5 font-body text-sm font-semibold text-navy">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="2" y="5" width="20" height="14" rx="2.5" />
            <path d="M2 10h20" />
          </svg>
          کارڈ / بینک ٹرانسفر
        </div>

        <p className="mt-4 font-body text-sm leading-7 text-navy/75">
          اپنے ڈیبٹ یا کریڈٹ کارڈ سے (موبائل بینکنگ ایپ، اے ٹی ایم یا آن لائن
          بینکنگ کے ذریعے) نیچے دیے گئے اکاؤنٹ میں رقم منتقل کریں، پھر رسید کی
          تفصیل درج کریں۔
        </p>

        <div className="mt-5 space-y-3">
          {BANK_NAME && <CopyField label="بینک" value={BANK_NAME} />}
          {ACCOUNT_TITLE && <CopyField label="اکاؤنٹ ٹائٹل" value={ACCOUNT_TITLE} />}
          {ACCOUNT_NUMBER && <CopyField label="اکاؤنٹ نمبر" value={ACCOUNT_NUMBER} />}
          {IBAN && <CopyField label="آئی بین (IBAN)" value={IBAN} />}
        </div>

        {!ACCOUNT_NUMBER && !IBAN && (
          <p className="mt-4 rounded-xl border border-gold-deep bg-gold-soft px-4 py-3 font-body text-sm leading-7 text-gold-dark">
            بینک کی تفصیلات ابھی ترتیب نہیں دی گئیں۔ براہِ کرم واٹس ایپ پر رابطہ
            کریں۔
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Field
          label="ادائیگی بھیجنے والے اکاؤنٹ کا ٹائٹل"
          hint="جس اکاؤنٹ یا کارڈ سے پیسے بھیجے، اُس پر لکھا نام"
          name="accountTitle"
          required
        />
        <Field
          label="ٹرانزیکشن آئی ڈی (TID)"
          hint="رسید پر لکھا نمبر"
          name="transactionId"
          required
        />

        <div>
          <label
            htmlFor="screenshot"
            className="mb-1 block font-body text-sm text-navy/80"
          >
            ادائیگی کی تصدیقی اسکرین شاٹ
          </label>
          <p className="mb-2 font-body text-xs text-navy/50">
            ایک ہی تصویر کافی ہے
          </p>
          <input
            id="screenshot"
            type="file"
            accept="image/*"
            required
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm text-navy/80 file:mr-3 file:rounded-full file:border-0 file:bg-navy file:px-4 file:py-1.5 file:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
          />
          {preview && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview}
              alt="منتخب کردہ اسکرین شاٹ"
              className="mt-3 max-h-52 rounded-lg border border-gold object-contain"
            />
          )}
        </div>
      </div>

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
        {status === "loading" ? "بھیجا جا رہا ہے..." : "تصدیق کے لیے بھیجیں"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  name,
  type = "text",
  required,
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
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
        type={type}
        name={name}
        required={required}
        className="w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm text-navy placeholder-navy/30 outline-none focus:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold-deep/40"
      />
    </div>
  );
}

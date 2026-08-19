"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import PatternDivider from "@/components/PatternDivider";
import StepIndicator from "@/components/StepIndicator";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import PaymentForm from "@/components/PaymentForm";

const CALENDLY_URLS = {
  call: process.env.NEXT_PUBLIC_CALENDLY_CALL_URL || "",
  physical: process.env.NEXT_PUBLIC_CALENDLY_PHYSICAL_URL || "",
};

const SERVICE_LABELS = {
  call: "ابتدائی کال — 2,000 روپے",
  physical: "فزیکل سیشن — 5,000 روپے",
};

const STEP_LABELS = ["سروس", "تفصیل", "وقت", "ادائیگی"];

type ServiceType = "call" | "physical";

function BookingFlow() {
  const params = useSearchParams();
  const preselected = params.get("service");
  const initialService: ServiceType | null =
    preselected === "call" || preselected === "physical" ? preselected : null;

  const [service, setService] = useState<ServiceType | null>(initialService);
  const [contact, setContact] = useState<{ name: string; phone: string } | null>(null);
  const [scheduled, setScheduled] = useState<{ calendlyEventUri?: string } | null>(null);

  const step = !service ? 1 : !contact ? 2 : !scheduled ? 3 : 4;

  return (
    <main>
      <Navbar />
      <WhatsAppFab />

      <section className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-center text-4xl text-navy">
          <span className="text-gold-gradient">بکنگ</span>
        </h1>
        <PatternDivider />

        <div className="mt-10">
          <StepIndicator current={step} labels={STEP_LABELS} />
        </div>

        {/* Step 1 — pick a service */}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(["call", "physical"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setService(s)}
                className="rounded-2xl border border-gold bg-white px-6 py-8 font-body text-navy shadow-card transition hover:border-gold-deep hover:bg-gold-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
              >
                {SERVICE_LABELS[s]}
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — name and phone, which then pre-fill Calendly */}
        {step === 2 && service && (
          <ContactStep
            onBack={() => setService(null)}
            onNext={(name, phone) => setContact({ name, phone })}
          />
        )}

        {/* Step 3 — pick a slot */}
        {step === 3 && service && contact && (
          <div>
            <p className="mb-4 text-center font-body text-sm text-navy/70">
              اپنی پسند کا وقت منتخب کریں
            </p>
            <CalendlyEmbed
              url={CALENDLY_URLS[service]}
              name={contact.name}
              phone={contact.phone}
              onScheduled={(e) => setScheduled({ calendlyEventUri: e.eventUri })}
            />
          </div>
        )}

        {/* Step 4 — pay and upload proof */}
        {step === 4 && service && contact && scheduled && (
          <PaymentForm
            serviceType={service}
            customerName={contact.name}
            customerPhone={contact.phone}
            calendlyEventUri={scheduled.calendlyEventUri}
          />
        )}
      </section>

      <Footer />
    </main>
  );
}

function ContactStep({
  onNext,
  onBack,
}: {
  onNext: (name: string, phone: string) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleContinue() {
    if (name.trim().length < 3) {
      setError("براہِ کرم اپنا پورا نام لکھیں۔");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setError("براہِ کرم درست فون نمبر لکھیں۔");
      return;
    }
    onNext(name.trim(), phone.trim());
  }

  return (
    <div className="space-y-5 text-right">
      <div>
        <label htmlFor="name" className="mb-2 block font-body text-sm text-navy/80">
          آپ کا نام
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          className="w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm text-navy outline-none focus:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold-deep/40"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block font-body text-sm text-navy/80">
          واٹس ایپ نمبر
        </label>
        <p className="mb-2 font-body text-xs text-navy/50">
          اسی نمبر پر بکنگ کی تصدیق بھیجی جائے گی
        </p>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="03XX-XXXXXXX"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          className="w-full rounded-lg border border-gold bg-white px-3 py-2.5 font-body text-sm text-navy placeholder-navy/30 outline-none focus:border-gold-deep focus-visible:ring-2 focus-visible:ring-gold-deep/40"
        />
      </div>

      {error && (
        <p role="alert" className="font-body text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-gold px-6 py-3 font-body text-sm text-navy/70 transition hover:bg-gold-soft hover:text-navy"
        >
          واپس
        </button>
        <button
          onClick={handleContinue}
          className="flex-1 rounded-full bg-navy py-3 font-body font-semibold text-white shadow-card transition hover:bg-navy-light"
        >
          آگے بڑھیں
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingFlow />
    </Suspense>
  );
}

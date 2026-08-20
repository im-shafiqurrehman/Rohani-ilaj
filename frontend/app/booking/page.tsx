"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import PageShell from "@/components/PageShell";
import StepIndicator from "@/components/StepIndicator";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import PaymentForm from "@/components/PaymentForm";
import { Field, Button, Alert } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import { isValidPkMobile } from "@/lib/phone";
import { useLang } from "@/components/LanguageProvider";

const CALENDLY_URLS = {
  call: process.env.NEXT_PUBLIC_CALENDLY_CALL_URL || "",
  physical: process.env.NEXT_PUBLIC_CALENDLY_PHYSICAL_URL || "",
};

const PRICES = { call: "2,000", physical: "5,000" } as const;
const SERVICE_KEYS = ["call", "physical"] as const;

type ServiceType = (typeof SERVICE_KEYS)[number];

function BookingFlow() {
  const { t } = useLang();
  const params = useSearchParams();
  const preselected = params.get("service");
  const initialService: ServiceType | null =
    preselected === "call" || preselected === "physical" ? preselected : null;

  const [service, setService] = useState<ServiceType | null>(initialService);
  const [contact, setContact] = useState<{
    name: string;
    phone: string;
    email: string;
  } | null>(null);
  const [scheduled, setScheduled] = useState<{ calendlyEventUri?: string } | null>(null);

  const step = !service ? 1 : !contact ? 2 : !scheduled ? 3 : 4;

  return (
    <>
      <div className="mt-14">
        <StepIndicator current={step} labels={t.booking.steps} />
      </div>

      <div className="mt-14">
        {/* Step 1 — pick a service */}
        {step === 1 && (
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
              {SERVICE_KEYS.map((key) => {
                const svc = t.services[key];
                return (
                  <button
                    key={key}
                    onClick={() => setService(key)}
                    className="group bg-surface p-8 text-start transition-colors duration-500 ease-editorial hover:bg-surface-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                  >
                    <p className="eyebrow font-body" dir="ltr">
                      {key === "call" ? "Initial Consultation" : "In-Person Session"}
                    </p>
                    <h2 className="mt-5 text-2xl font-light text-fg">
                      {svc.title}
                    </h2>
                    <p className="mt-4 font-display text-3xl font-light text-accent">
                      {PRICES[key]}{" "}
                      <span className="font-body text-sm text-muted">
                        {t.services.currency}
                      </span>
                    </p>
                    <p className="mt-4 font-body text-xs leading-6 text-muted">
                      {`${svc.durationValue} · ${svc.note}`}
                    </p>
                    <span className="glow-button mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-body text-sm tracking-wide text-accent-fg transition-all duration-500 ease-editorial group-hover:brightness-110">
                      {t.booking.select} <span aria-hidden="true">←</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

        {/* Step 2 — name, phone and email, which then pre-fill Calendly */}
        {step === 2 && service && (
          <ContactStep
            onBack={() => setService(null)}
            onNext={(name, phone, email) => setContact({ name, phone, email })}
          />
        )}

        {/* Step 3 — pick a slot */}
        {step === 3 && service && contact && (
          <div>
            <p className="mb-6 text-center font-body text-sm text-muted">
              {t.booking.pickTime}
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
            customerEmail={contact.email}
            calendlyEventUri={scheduled.calendlyEventUri}
          />
        )}
      </div>
    </>
  );
}

function ContactStep({
  onNext,
  onBack,
}: {
  onNext: (name: string, phone: string, email: string) => void;
  onBack: () => void;
}) {
  const { t } = useLang();
  const { user } = useAuth();
  // Signed-in customers shouldn't retype what the account already knows.
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState("");

  function handleContinue() {
    if (name.trim().length < 3) {
      return setError(t.contact.errName);
    }
    if (!isValidPkMobile(phone)) {
      return setError(t.contact.errPhone);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return setError(t.booking.errEmail);
    }
    onNext(name.trim(), phone.trim(), email.trim());
  }

  return (
    <div className="space-y-8">
      <Field
        label={t.booking.name}
        name="name"
        value={name}
        onChange={(e: any) => {
          setName(e.target.value);
          setError("");
        }}
        required
      />
      <Field
        label={t.booking.phone}
        hint={t.booking.phoneHint}
        name="phone"
        type="tel"
        inputMode="numeric"
        placeholder="03XX-XXXXXXX"
        value={phone}
        onChange={(e: any) => {
          setPhone(e.target.value);
          setError("");
        }}
        required
      />

      <Field
        label={t.booking.email}
        hint={t.booking.emailHint}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e: any) => {
          setEmail(e.target.value);
          setError("");
        }}
      />

      {error && <Alert>{error}</Alert>}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} type="button">
          {t.booking.back}
        </Button>
        <Button onClick={handleContinue} type="button" className="flex-1">
          {t.booking.next}
        </Button>
      </div>
    </div>
  );
}

function BookingSkeleton() {
  const { t } = useLang();

  return (
    <>
      <div className="mt-14">
        <StepIndicator current={1} labels={t.booking.steps} />
      </div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="min-h-[19rem] bg-surface p-8" aria-hidden="true" />
        ))}
      </div>
    </>
  );
}

export default function BookingPage() {
  const { t } = useLang();

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-20">
        <header className="text-center">
          <p className="eyebrow font-body" dir="ltr">
            {t.booking.eyebrow}
          </p>
          <h1 className="mt-5 text-title font-light text-fg">{t.booking.title}</h1>
        </header>

        {/* Only this subtree reads ?service=, so only this subtree defers to
            the client — the header, title and footer still pre-render. */}
        <Suspense fallback={<BookingSkeleton />}>
          <BookingFlow />
        </Suspense>
      </div>
    </PageShell>
  );
}

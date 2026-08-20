"use client";

import { FormEvent, useState } from "react";
import { Button, Alert } from "./ui";
import { createAdminBooking } from "@/lib/adminApi";

const PRICES = { call: 2000, physical: 5000 } as const;

/**
 * Records a booking the practitioner took over WhatsApp.
 *
 * Some customers are not comfortable with the online flow, so they send a
 * receipt on WhatsApp instead. No screenshot is asked for here because the
 * receipt has already been seen, which is why these are created approved.
 */
export default function AdminNewBooking({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<"call" | "physical">("call");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("customerName") || "").trim();
    const phone = String(f.get("customerPhone") || "").trim();

    if (name.length < 3) return setError("Enter the customer's full name.");
    if (phone.replace(/\D/g, "").length < 10)
      return setError("Enter a valid phone number.");

    setBusy(true);
    setError("");
    setNotice("");

    try {
      const slotRaw = String(f.get("slotTime") || "");
      const created = await createAdminBooking({
        serviceType: service,
        customerName: name,
        customerPhone: phone,
        customerEmail: String(f.get("customerEmail") || "").trim() || undefined,
        slotTime: slotRaw ? new Date(slotRaw).toISOString() : undefined,
        amount: Number(f.get("amount")) || undefined,
        adminNote: String(f.get("adminNote") || "").trim() || undefined,
      });

      setNotice(
        created.notified?.sent
          ? `Booked. Reference ${created.slotReference}. Customer emailed.`
          : `Booked. Reference ${created.slotReference}. No email on file, so tell them on WhatsApp.`
      );
      (e.target as HTMLFormElement).reset();
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div className="mt-10">
        <Button variant="outline" onClick={() => setOpen(true)} className="px-6 py-2.5 text-xs">
          + Add a booking taken on WhatsApp
        </Button>
        {notice && (
          <p className="mt-4 rounded-md border border-accent/40 px-3 py-2 font-body text-xs text-accent">
            {notice}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow font-body">Manual entry</p>
          <h2 className="mt-2 font-display text-xl font-light text-fg">
            Add a booking
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-body text-xs text-muted hover:text-fg"
        >
          Close
        </button>
      </div>

      <p className="mt-3 font-body text-xs leading-6 text-muted">
        For customers who sent their receipt on WhatsApp. No screenshot needed,
        and the booking is saved as approved.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex gap-2">
          {(["call", "physical"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setService(s)}
              aria-pressed={service === s}
              className={`rounded-full border px-4 py-2 font-body text-xs transition-colors ${
                service === s
                  ? "border-accent text-accent"
                  : "border-line text-muted hover:text-fg"
              }`}
            >
              {s === "call" ? "Initial Consultation" : "In-Person Session"} · Rs{" "}
              {PRICES[s].toLocaleString()}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer name" name="customerName" required />
          <Field label="Phone number" name="customerPhone" type="tel" placeholder="03XX-XXXXXXX" required />
          <Field label="Email (optional)" name="customerEmail" type="email" hint="If given, they get the confirmation email" />
          <Field label="Appointment time" name="slotTime" type="datetime-local" />
          <Field label="Amount (optional)" name="amount" type="number" hint={`Defaults to Rs ${PRICES[service].toLocaleString()}`} />
          <Field label="Note (optional)" name="adminNote" hint="Shown to the customer" />
        </div>

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={busy} className="px-7 py-2.5 text-xs">
          {busy ? "Saving…" : "Save as approved booking"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  name,
  type = "text",
  ...rest
}: {
  label: string;
  hint?: string;
  name: string;
  type?: string;
  [key: string]: any;
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-body text-xs tracking-wide text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-2 w-full border-b border-line bg-transparent py-2 font-body text-sm text-fg placeholder:text-muted/50 outline-none focus:border-accent"
        {...rest}
      />
      {hint && <p className="mt-1.5 font-body text-[11px] text-muted/70">{hint}</p>}
    </div>
  );
}

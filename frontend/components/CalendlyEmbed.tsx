"use client";

import { useEffect } from "react";
import Script from "next/script";

type ScheduledEvent = {
  eventUri: string;
  inviteeUri: string;
};

export default function CalendlyEmbed({
  url,
  name,
  phone,
  onScheduled,
}: {
  url: string;
  name?: string;
  phone?: string;
  onScheduled: (e: ScheduledEvent) => void;
}) {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (typeof e.origin === "string" && !e.origin.includes("calendly.com")) return;
      if (e.data?.event === "calendly.event_scheduled") {
        onScheduled({
          eventUri: e.data.payload?.event?.uri ?? "",
          inviteeUri: e.data.payload?.invitee?.uri ?? "",
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onScheduled]);

  // If the Calendly link hasn't been configured yet, say so plainly instead of
  // rendering an empty white box the visitor can't act on.
  if (!url) {
    return (
      <div className="rounded-2xl border border-gold bg-gold-soft p-8 text-center">
        <p className="font-body text-sm leading-7 text-navy/80">
          بکنگ کیلنڈر ابھی ترتیب نہیں دیا گیا۔ براہِ کرم واٹس ایپ پر رابطہ کریں۔
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923173810763"}`}
          className="mt-4 inline-block rounded-full bg-navy px-6 py-2.5 font-body text-sm text-white"
        >
          واٹس ایپ پر رابطہ کریں
        </a>
      </div>
    );
  }

  // Pre-fills Calendly's own name/phone fields from what the visitor already
  // typed, so they never enter the same details twice.
  const prefilled = new URL(url);
  if (name) prefilled.searchParams.set("name", name);
  if (phone) prefilled.searchParams.set("a1", phone);
  prefilled.searchParams.set("hide_gdpr_banner", "1");

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div
        className="calendly-inline-widget overflow-hidden rounded-2xl border border-gold bg-white"
        data-url={prefilled.toString()}
        style={{ minWidth: "280px", height: "700px" }}
      />
    </>
  );
}

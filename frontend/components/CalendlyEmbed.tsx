"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useTheme } from "./ThemeProvider";
import { PALETTES } from "@/lib/palettes";
import { useLang } from "./LanguageProvider";
import { CONTACT_LINK } from "@/lib/site";

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
  const { theme, palette } = useTheme();
  const { t } = useLang();

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
  // rendering an empty box the visitor can't act on.
  if (!url) {
    return (
      <div className="rounded-lg border border-line bg-surface p-10 text-center">
        <p className="font-body text-sm leading-8 text-muted">
          {t.booking.calendarMissing}
        </p>
        <a
          href={CONTACT_LINK}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-block rounded-full border border-line px-6 py-2.5 font-body text-sm text-fg transition-colors hover:border-accent/60 hover:text-accent"
        >
          {t.booking.messageUs}
        </a>
      </div>
    );
  }

  // Pre-fills Calendly's own name/phone fields from what the visitor already
  // typed, and hands Calendly our palette so the iframe doesn't punch a bright
  // white hole through the dark theme.
  const prefilled = new URL(url);
  if (name) prefilled.searchParams.set("name", name);
  if (phone) prefilled.searchParams.set("a1", phone);
  prefilled.searchParams.set("hide_gdpr_banner", "1");
  prefilled.searchParams.set("hide_landing_page_details", "1");

  const tokens = (PALETTES.find((p) => p.id === palette) ?? PALETTES[0])[theme];
  const bare = (hex: string) => hex.replace("#", "");
  prefilled.searchParams.set("background_color", bare(tokens.surface));
  prefilled.searchParams.set("text_color", bare(tokens.fg));
  prefilled.searchParams.set("primary_color", bare(tokens.accent));

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      <div
        // Remounts on theme/palette change so Calendly re-reads the colour params.
        key={`${palette}-${theme}`}
        className="calendly-inline-widget overflow-hidden rounded-lg border border-line"
        data-url={prefilled.toString()}
        style={{ minWidth: "280px", height: "700px" }}
      />
    </>
  );
}

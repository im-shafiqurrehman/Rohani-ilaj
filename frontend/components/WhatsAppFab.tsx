"use client";

import { useLang } from "./LanguageProvider";
import { CONTACT_LINK, WHATSAPP_LINK } from "@/lib/site";

export default function WhatsAppFab() {
  const { t } = useLang();
  const isWhatsApp = Boolean(WHATSAPP_LINK);
  // Pre-fills the chat so the first message isn't a blank "hi" the
  // practitioner has to chase for context.
  const href = isWhatsApp
    ? `${WHATSAPP_LINK}?text=${encodeURIComponent(t.whatsappPrefill)}`
    : CONTACT_LINK;

  return (
    <a
      href={href}
      target={isWhatsApp ? "_blank" : undefined}
      rel={isWhatsApp ? "noreferrer noopener" : undefined}
      aria-label={isWhatsApp ? t.whatsappAria : t.fab}
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/90 px-5 py-3 font-body text-xs tracking-wide text-fg shadow-lift backdrop-blur-xl transition-all duration-500 ease-editorial hover:border-accent/60 hover:text-accent focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
    >
      {isWhatsApp ? (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" className="text-accent">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.88 2.35 1 2.51c.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-accent">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
      )}
      {isWhatsApp ? t.whatsapp : t.fab}
    </a>
  );
}

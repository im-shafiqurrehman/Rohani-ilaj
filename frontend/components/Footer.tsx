"use client";

import Image from "next/image";
import Link from "next/link";
import SocialIcons from "./SocialIcons";
import { FOOTER_NAV, POLICY_NAV, SITE, WHATSAPP_LINK } from "@/lib/site";
import { useLang } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-line bg-ink px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div dir="ltr" className="flex items-center gap-3">
              <Image
                src="/asset/logo-mark.png"
                alt=""
                width={421}
                height={541}
                className="h-10 w-auto"
              />
              <span className="font-display text-lg font-medium tracking-wide text-fg">
                Rohani Ilaj Center
              </span>
            </div>
            <p className="mt-6 max-w-sm font-body text-sm leading-7 text-muted">
{t.footer.tagline}
            </p>
            <SocialIcons className="mt-7" />
          </div>

          <nav>
            <h3 className="font-body text-[11px] tracking-[0.22em] text-fg">
              {t.footer.explore}
            </h3>
            <ul className="mt-5 space-y-3">
              {FOOTER_NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-body text-sm text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/booking"
                  className="font-body text-sm text-muted transition-colors duration-300 hover:text-accent"
                >
                  Book a session
                </Link>
              </li>
            </ul>
          </nav>

          <nav>
            <h3 className="font-body text-[11px] tracking-[0.22em] text-fg">
              {t.footer.policies}
            </h3>
            <ul className="mt-5 space-y-3">
              {POLICY_NAV.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm text-muted transition-colors duration-300 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-body text-[11px] tracking-[0.22em] text-fg">
              {t.footer.contactHeading}
            </h3>
            <ul className="mt-5 space-y-4 font-body text-sm text-muted">
              {WHATSAPP_LINK && (
                <li>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors duration-300 hover:text-accent"
                  >
                    {SITE.whatsapp}
                  </a>
                  <span className="mt-0.5 block text-[11px] text-muted/60">
                    WhatsApp
                  </span>
                </li>
              )}
              {SITE.email && (
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="break-all transition-colors duration-300 hover:text-accent"
                  >
                    {SITE.email}
                  </a>
                </li>
              )}
              <li className="leading-6">{SITE.address}</li>
            </ul>
          </div>
        </div>

        <p className="mt-16 rounded-lg border border-line bg-surface/60 px-5 py-4 font-body text-xs leading-6 text-muted/80">
          <strong className="text-fg">{t.footer.disclaimerLead}</strong> {t.footer.disclaimer}
        </p>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="font-body text-xs text-muted/70">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted/70">
            {t.footer.noPromises}
          </p>
        </div>
      </div>
    </footer>
  );
}

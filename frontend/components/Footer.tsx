"use client";

import Image from "next/image";
import Link from "next/link";
import SocialIcons from "./SocialIcons";
import { NAV, SITE } from "@/lib/site";
import { useLang } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer dir="ltr" className="border-t border-line bg-ink px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/asset/logo-mark.png"
                alt=""
                width={421}
                height={541}
                className="h-10 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-medium tracking-wide text-fg">
                  Rohani Ilaj
                </span>
                <span className="mt-1 font-body text-[9px] tracking-[0.28em] text-muted">
                  CENTER
                </span>
              </span>
            </div>
            <p className="mt-6 max-w-sm font-body text-sm leading-7 text-muted">
{t.footer.tagline}
            </p>
            <SocialIcons className="mt-7" />
          </div>

          <nav>
            <h3 className="font-body text-[11px] tracking-[0.22em] text-fg">
              EXPLORE
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV.map((l) => (
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

          <div>
            <h3 className="font-body text-[11px] tracking-[0.22em] text-fg">
              CONTACT
            </h3>
            <ul className="mt-5 space-y-4 font-body text-sm text-muted">
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

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="font-body text-xs text-muted/70">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-body text-xs text-muted/70">
            Guidance offered strictly within the bounds of Shariah.
          </p>
        </div>
      </div>
    </footer>
  );
}

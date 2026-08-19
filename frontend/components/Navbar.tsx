"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/#khidmaat", label: "خدمات" },
  { href: "/#tareeqa", label: "طریقہ کار" },
  { href: "/#tassurat", label: "تاثرات" },
  { href: "/#rabta", label: "رابطہ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
        >
          <Image
            src="/asset/logo-mark.png"
            alt=""
            width={421}
            height={541}
            priority
            className="h-10 w-auto"
          />
          <span className="font-display text-lg tracking-wide text-navy">
            روحانی علاج
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-navy/75 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-gold-dark"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/booking"
            className="rounded-full bg-navy px-5 py-2 font-body text-sm text-white transition hover:bg-navy-light focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep"
          >
            بکنگ کریں
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="مینو"
            className="rounded-lg border border-navy/25 p-2 text-navy md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/30 px-6 pb-4 pt-2 font-body text-sm text-navy/75 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 transition hover:text-gold-dark"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

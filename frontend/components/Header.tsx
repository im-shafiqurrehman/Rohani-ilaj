"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import PalettePicker from "./PalettePicker";
import LanguageToggle from "./LanguageToggle";
import { useAuth } from "./AuthProvider";
import { NAV, SITE } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      dir="ltr"
      className={`sticky top-0 z-50 transition-all duration-500 ease-editorial ${
        scrolled
          ? "border-b border-line bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          aria-label={`${SITE.name} home`}
        >
          <Image
            src="/asset/logo-mark.png"
            alt=""
            width={421}
            height={541}
            priority
            className="h-9 w-auto"
          />
          <span className="text-glow font-display text-[17px] font-medium tracking-wide">
            Rohani Ilaj Center
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="link-underline font-body text-[13px] tracking-wide text-muted transition-colors duration-300 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageToggle />
          <PalettePicker />
          <ThemeToggle />

          {!loading &&
            (user ? (
              <Link
                href="/account"
                className="hidden rounded-full border border-line px-4 py-2 font-body text-[13px] text-fg transition-colors duration-300 hover:border-accent/60 hover:text-accent sm:inline-flex"
              >
                {user.name.split(" ")[0]}
              </Link>
            ) : (
              <Link
                href="/account/login"
                className="hidden font-body text-[13px] text-muted transition-colors duration-300 hover:text-fg sm:inline-flex"
              >
                Sign in
              </Link>
            ))}

          <Link
            href="/booking"
            className="glow-button hidden rounded-full bg-accent px-5 py-2 font-body text-[13px] tracking-wide text-accent-fg sm:inline-flex"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-fg lg:hidden"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 7h18M3 12h18M3 17h18" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-ink/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col">
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 font-body text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>
          {/* No Book button here: it floats on every screen, at every scroll
              position. The switchers moved up into the header row. */}
          <div className="mt-5">
            <Link
              href={user ? "/account" : "/account/login"}
              onClick={() => setOpen(false)}
              className="btn-outline inline-flex w-full justify-center rounded-full px-5 py-2.5 font-body text-sm"
            >
              {user ? "Account" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

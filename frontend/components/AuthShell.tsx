import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
import WhatsAppFab from "./WhatsAppFab";
import PalettePicker from "./PalettePicker";

/** Centred, chrome-free frame shared by sign in and sign up. */
export default function AuthShell({
  eyebrow,
  title,
  lede,
  children,
  footer,
  lang = "ur",
  staff = false,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  children: ReactNode;
  footer?: ReactNode;
  lang?: "ur" | "en";
  staff?: boolean;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center px-6 py-16">
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="absolute right-6 top-6 flex items-center gap-2.5">
        <PalettePicker />
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center justify-center gap-3"
          aria-label="Rohani Ilaj Center — home"
          dir="ltr"
        >
          <Image
            src="/asset/logo-mark.png"
            alt=""
            width={421}
            height={541}
            priority
            className="h-11 w-auto"
          />
        </Link>

        <div className="mt-10 text-center">
          <p className="eyebrow font-body" dir="ltr">
            {eyebrow}
          </p>
          <h1
            className={`mt-5 text-3xl font-light text-fg ${
              lang === "en" ? "font-display" : ""
            }`}
          >
            {title}
          </h1>
          {lede && (
            <p className="mx-auto mt-4 max-w-xs font-body text-sm leading-7 text-muted">
              {lede}
            </p>
          )}
        </div>

        <div className="mt-10 rounded-lg border border-line bg-surface p-8">
          {children}
        </div>

        {footer && (
          <div className="mt-7 text-center font-body text-sm text-muted">
            {footer}
          </div>
        )}
      </div>
      {!staff && <WhatsAppFab />}
    </main>
  );
}

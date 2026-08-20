"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { useLang } from "@/components/LanguageProvider";
import WhatsAppFab from "@/components/WhatsAppFab";

export default function NotFound() {
  const { t } = useLang();

  return (
    <main className="relative grid min-h-screen place-items-center px-6 text-center">
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="relative">
        <p className="eyebrow font-body" dir="ltr">
          404
        </p>
        <h1 className="mt-6 text-title font-light text-fg">{t.account.notFound}</h1>
        <p className="mx-auto mt-5 max-w-xs font-body text-sm leading-8 text-muted">
          {t.account.notFoundBody}
        </p>
        <Button as={Link} href="/" className="mt-10">
          {t.account.backHome}
        </Button>
      </div>
      <WhatsAppFab />
    </main>
  );
}

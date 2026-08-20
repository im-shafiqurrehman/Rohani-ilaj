"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { Field, Button, Alert } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import { login } from "@/lib/auth";
import { useLang } from "@/components/LanguageProvider";

/**
 * Reads ?next= without useSearchParams.
 *
 * useSearchParams() forces the whole route out of pre-rendering, which left
 * this page server-rendering to an empty body — a blank white screen until JS
 * arrived. The redirect target is only needed at submit time, so reading it
 * from location directly keeps the page statically rendered.
 *
 * Only same-origin relative paths are honoured, so a crafted
 * ?next=https://evil.example can't turn the login into an open redirect.
 */
function safeNextUrl() {
  if (typeof window === "undefined") return "/account";
  const raw = new URLSearchParams(window.location.search).get("next");
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/account";
  return raw;
}

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { t } = useLang();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError("");

    try {
      await login({
        phone: String(data.get("phone") || ""),
        password: String(data.get("password") || ""),
      });
      await refresh();
      router.push(safeNextUrl());
    } catch (err: any) {
      setError(err.message || t.auth.errSignIn);
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow={t.auth.signInEyebrow}
      title={t.auth.signInTitle}
      lede={t.auth.signInLede}
      footer={
        <>
          {t.auth.noAccount}{" "}
          <Link href="/account/signup" className="text-accent hover:underline">
            {t.auth.createOne}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <Field
          label={t.booking.phone}
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="03XX-XXXXXXX"
          autoComplete="tel"
          required
        />
        <Field
          label={t.auth.password}
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "…" : t.auth.signInCta}
        </Button>
      </form>

      <p className="mt-7 border-t border-line pt-6 text-center font-body text-xs leading-6 text-muted/70">
        {t.auth.guestNote}{" "}
        <Link href="/booking" className="text-accent hover:underline">
          {t.auth.bookAsGuest}
        </Link>
      </p>
    </AuthShell>
  );
}

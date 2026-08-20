"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { Field, Button, Alert } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import { signup } from "@/lib/auth";
import { isValidPkMobile } from "@/lib/phone";
import { useLang } from "@/components/LanguageProvider";

export default function SignupPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const { t } = useLang();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const password = String(data.get("password") || "");
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "");

    if (!isValidPkMobile(phone)) return setError(t.contact.errPhone);

    // Required: booking updates and the post-approval contact number are both
    // delivered by email, so an account without one cannot be notified.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError(t.booking.errEmail);
    }
    if (password.length < 6) {
      return setError(t.auth.errPassword);
    }

    setLoading(true);
    setError("");

    try {
      await signup({
        name: String(data.get("name") || "").trim(),
        phone: String(data.get("phone") || ""),
        email,
        password,
      });
      await refresh();
      router.push("/account");
    } catch (err: any) {
      setError(err.message || t.auth.errSignUp);
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow={t.auth.signUpEyebrow}
      title={t.auth.signUpTitle}
      lede={t.auth.signUpLede}
      footer={
        <>
          {t.auth.haveAccount}{" "}
          <Link href="/account/login" className="text-accent hover:underline">
            {t.auth.signInCta}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <Field label={t.booking.name} name="name" autoComplete="name" required />
        <Field
          label={t.booking.phone}
          hint={t.auth.phoneIdentity}
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="03XX-XXXXXXX"
          autoComplete="tel"
          required
        />
        <Field
          label={t.booking.email}
          hint={t.auth.emailHint}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
        />
        <Field
          label={t.auth.password}
          hint={t.auth.passwordHint}
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "…" : t.auth.signUpCta}
        </Button>
      </form>

      <p className="mt-7 border-t border-line pt-6 text-center font-body text-xs leading-6 text-muted/70">
{t.auth.claimNote}
      </p>
    </AuthShell>
  );
}

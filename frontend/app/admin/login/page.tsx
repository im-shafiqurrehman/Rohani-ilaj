"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthShell from "@/components/AuthShell";
import { Field, Button, Alert } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    setError("");

    try {
      // Rejects with "no admin access" if the credentials are valid but the
      // account's role isn't admin — so a customer typing this URL gets a
      // clear answer rather than a token that fails on every request after.
      await adminLogin(
        String(data.get("phone") || ""),
        String(data.get("password") || "")
      );
      // Shared session, so the rest of the app sees the sign-in too.
      await refresh();
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login nahi ho saka.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      lang="en"
      staff
      eyebrow="Administration"
      title="Admin sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="03XX-XXXXXXX"
          autoComplete="tel"
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && <Alert>{error}</Alert>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

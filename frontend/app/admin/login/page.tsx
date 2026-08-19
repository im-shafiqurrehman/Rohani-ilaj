"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);

    try {
      await adminLogin(String(data.get("username")), String(data.get("password")));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-soft px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-gold bg-white p-8 shadow-card"
      >
        <h1 className="text-center font-display text-2xl text-navy">
          Admin Login
        </h1>

        <div className="mt-6 space-y-4">
          <input
            name="username"
            placeholder="Username"
            required
            className="w-full rounded-lg border border-gold bg-white px-3 py-2 font-body text-sm text-navy placeholder-navy/40 outline-none focus:border-gold-deep"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border border-gold bg-white px-3 py-2 font-body text-sm text-navy placeholder-navy/40 outline-none focus:border-gold-deep"
          />
        </div>

        {error && <p className="mt-3 font-body text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-navy py-2.5 font-body font-semibold text-white transition hover:bg-navy-light disabled:opacity-60"
        >
          {loading ? "..." : "Login"}
        </button>
      </form>
    </main>
  );
}

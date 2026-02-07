"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
          Check your email
        </h1>
        <p className="mb-6 text-center text-sm leading-relaxed text-espresso-500">
          If an account with <span className="font-medium text-espresso-700">{email}</span> exists, we&apos;ve sent a password reset link. It will expire in 1 hour.
        </p>
        <Link
          href="/sign-in"
          className="block text-center text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
        >
          Back to sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
        Forgot your password?
      </h1>
      <p className="mb-8 text-center text-sm text-espresso-500">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-espresso-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-500">
        Remember your password?{" "}
        <Link href="/sign-in" className="font-medium text-terracotta-600 hover:text-terracotta-700">
          Sign in
        </Link>
      </p>
    </>
  );
}

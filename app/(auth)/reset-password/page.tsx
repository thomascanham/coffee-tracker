"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <>
        <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
          Invalid reset link
        </h1>
        <p className="mb-6 text-center text-sm text-espresso-500">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-medium text-terracotta-600 hover:text-terracotta-700"
        >
          Request a new reset link
        </Link>
      </>
    );
  }

  if (success) {
    return (
      <>
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sage-600">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
          Password reset
        </h1>
        <p className="mb-6 text-center text-sm text-espresso-500">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link
          href="/sign-in"
          className="block w-full rounded-full bg-terracotta-600 px-6 py-2.5 text-center text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700"
        >
          Sign In
        </Link>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
        Set a new password
      </h1>
      <p className="mb-8 text-center text-sm text-espresso-500">
        Choose a new password for your account
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-espresso-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-espresso-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            placeholder="Confirm your new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but could not sign in. Please try signing in manually.");
        setLoading(false);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="mb-2 text-center font-heading text-2xl font-bold text-espresso-900">
        Create your account
      </h1>
      <p className="mb-8 text-center text-sm text-espresso-500">
        Join Bean Log to track your coffee journey
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-medium text-espresso-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            placeholder="Choose a username"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-espresso-700">
            Password
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
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-terracotta-600 hover:text-terracotta-700">
          Sign in
        </Link>
      </p>
    </>
  );
}

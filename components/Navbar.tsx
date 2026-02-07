"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-bold text-espresso-900">
          Bean Log
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-terracotta-600"
                : "text-espresso-600 hover:text-espresso-900"
            }`}
          >
            Home
          </Link>
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors ${
              pathname === "/explore"
                ? "text-terracotta-600"
                : "text-espresso-600 hover:text-espresso-900"
            }`}
          >
            Explore
          </Link>
          {session ? (
            <UserMenu />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-terracotta-600 px-5 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

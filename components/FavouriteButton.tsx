"use client";

import { useState } from "react";

interface FavouriteButtonProps {
  shopSlug: string;
  favourited: boolean;
  onToggle?: (slug: string, favourited: boolean) => void;
}

export default function FavouriteButton({ shopSlug, favourited, onToggle }: FavouriteButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopSlug }),
      });

      if (res.ok) {
        const { favourited: newState } = await res.json();
        onToggle?.(shopSlug, newState);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/90 backdrop-blur-sm transition-colors hover:bg-cream-100"
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={favourited ? "#ef4444" : "none"}
        stroke={favourited ? "#ef4444" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={favourited ? "" : "text-espresso-500"}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

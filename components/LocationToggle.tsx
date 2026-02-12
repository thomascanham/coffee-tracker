"use client";

import { LocationStatus } from "@/hooks/useUserLocation";

interface LocationToggleProps {
  status: LocationStatus;
  onEnable: () => void;
  onDisable: () => void;
}

export default function LocationToggle({ status, onEnable, onDisable }: LocationToggleProps) {
  const isActive = status === "granted";
  const isLoading = status === "requesting";

  const handleClick = () => {
    if (isActive) {
      onDisable();
    } else {
      onEnable();
    }
  };

  let label = "Near me";
  if (isLoading) label = "Locating...";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        isActive
          ? "bg-sage-600 text-cream-50 hover:bg-sage-700"
          : "border border-cream-300 bg-white text-espresso-700 hover:bg-cream-50"
      } ${isLoading ? "cursor-wait opacity-75" : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
      </svg>
      {label}
    </button>
  );
}

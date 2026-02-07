"use client";

interface ViewToggleProps {
  view: "list" | "map";
  onToggle: (view: "list" | "map") => void;
}

export default function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-cream-200 bg-cream-100 p-1">
      <button
        onClick={() => onToggle("list")}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          view === "list"
            ? "bg-white text-espresso-900 shadow-sm"
            : "text-espresso-500 hover:text-espresso-700"
        }`}
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
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
        List
      </button>
      <button
        onClick={() => onToggle("map")}
        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          view === "map"
            ? "bg-white text-espresso-900 shadow-sm"
            : "text-espresso-500 hover:text-espresso-700"
        }`}
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
          <path d="m3 7 5-3 8 4 5-3v13l-5 3-8-4-5 3V7z" />
          <path d="m8 4v13" />
          <path d="m16 8v13" />
        </svg>
        Map
      </button>
    </div>
  );
}

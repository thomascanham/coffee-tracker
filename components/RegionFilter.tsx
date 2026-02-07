"use client";

import { Region } from "@/lib/types";

interface RegionFilterProps {
  regions: Region[];
  selected: Region | "All";
  onSelect: (region: Region | "All") => void;
}

export default function RegionFilter({
  regions,
  selected,
  onSelect,
}: RegionFilterProps) {
  const options: (Region | "All")[] = ["All", ...regions];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {options.map((region) => (
        <button
          key={region}
          onClick={() => onSelect(region)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
            selected === region
              ? "bg-espresso-900 text-cream-50 shadow-sm"
              : "bg-cream-100 text-espresso-600 hover:bg-cream-200"
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
}

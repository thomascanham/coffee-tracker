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
  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value as Region | "All")}
      className="rounded-full border border-cream-200 bg-white px-4 py-2 text-sm font-medium text-espresso-700 shadow-sm transition-colors hover:border-cream-300 focus:border-espresso-400 focus:outline-none focus:ring-1 focus:ring-espresso-400"
    >
      <option value="All">All Regions</option>
      {regions.map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  );
}

"use client";

const BREW_METHODS = [
  "Espresso",
  "V60",
  "AeroPress",
  "Batch Brew",
  "Filter",
  "French Press",
  "Chemex",
  "Syphon",
  "Kalita Wave",
  "Cold Brew",
] as const;

interface BrewMethodSelectProps {
  selected: string[];
  onChange: (methods: string[]) => void;
  disabled?: boolean;
}

export default function BrewMethodSelect({
  selected,
  onChange,
  disabled = false,
}: BrewMethodSelectProps) {
  function toggle(method: string) {
    if (disabled) return;
    if (selected.includes(method)) {
      onChange(selected.filter((m) => m !== method));
    } else {
      onChange([...selected, method]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {BREW_METHODS.map((method) => {
        const isSelected = selected.includes(method);
        return (
          <button
            key={method}
            type="button"
            onClick={() => toggle(method)}
            disabled={disabled}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isSelected
                ? "bg-terracotta-600 text-cream-50"
                : "bg-cream-100 text-espresso-600 hover:bg-cream-200"
            } ${disabled ? "cursor-default opacity-75" : "cursor-pointer"}`}
          >
            {method}
          </button>
        );
      })}
    </div>
  );
}

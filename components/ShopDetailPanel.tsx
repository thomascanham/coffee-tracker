"use client";

import Image from "next/image";
import { CoffeeShop } from "@/lib/types";
import RatingStars from "./RatingStars";
import { useEffect } from "react";

interface ShopDetailPanelProps {
  shop: CoffeeShop | null;
  onClose: () => void;
}

export default function ShopDetailPanel({ shop, onClose }: ShopDetailPanelProps) {
  useEffect(() => {
    if (!shop) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [shop, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-espresso-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          shop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel — bottom sheet on mobile, side panel on desktop */}
      <div
        className={`fixed z-50 overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out
          /* Mobile: bottom sheet */
          inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl
          /* Desktop: side panel */
          md:inset-y-0 md:right-0 md:left-auto md:w-[480px] md:max-h-none md:rounded-t-none md:rounded-l-3xl
          ${shop ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}
        `}
      >
        {shop && (
          <>
            {/* Mobile drag handle */}
            <div className="flex justify-center pt-3 md:hidden">
              <div className="h-1.5 w-12 rounded-full bg-cream-300" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/90 text-espresso-600 backdrop-blur-sm transition-colors hover:bg-cream-100 hover:text-espresso-900"
              aria-label="Close panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* Image */}
            <div className="relative h-56 w-full md:h-72">
              <Image
                src={shop.imageUrl}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
                  {shop.region}
                </span>
                <span className="text-sm text-espresso-400">{shop.city}</span>
              </div>

              <h2 className="mb-2 font-heading text-2xl font-bold text-espresso-900">
                {shop.name}
              </h2>

              <RatingStars rating={shop.rating} />

              <p className="mt-4 text-sm leading-relaxed text-espresso-600">
                {shop.description}
              </p>

              {/* Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso-400">
                    Address
                  </h4>
                  <p className="mt-1 text-sm text-espresso-700">
                    {shop.address}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso-400">
                    Roaster
                  </h4>
                  <p className="mt-1 text-sm text-espresso-700">
                    {shop.roaster}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso-400">
                    Brew Methods
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {shop.brewMethods.map((method) => (
                      <span
                        key={method}
                        className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-espresso-600"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-espresso-400">
                    Notes
                  </h4>
                  <p className="mt-1 text-sm italic leading-relaxed text-espresso-600">
                    &ldquo;{shop.notes}&rdquo;
                  </p>
                </div>
              </div>

              {/* Website link */}
              <a
                href={shop.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-espresso-900 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-espresso-800"
              >
                Visit Website
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}

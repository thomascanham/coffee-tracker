"use client";

import { CoffeeShop } from "@/lib/types";
import CoffeeShopCard from "./CoffeeShopCard";
import ShopDetailPanel from "./ShopDetailPanel";
import { useState } from "react";

interface FeaturedShopsProps {
  shops: CoffeeShop[];
}

export default function FeaturedShops({ shops }: FeaturedShopsProps) {
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-terracotta-500">
          Top Rated
        </p>
        <h2 className="text-3xl font-bold text-espresso-900 sm:text-4xl">
          Featured Shops
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-espresso-500">
          Our highest-rated coffee shops — each one a destination worth
          travelling for.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <CoffeeShopCard
            key={shop.slug}
            shop={shop}
            onSelect={setSelectedShop}
          />
        ))}
      </div>
      <ShopDetailPanel
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
      />
    </section>
  );
}

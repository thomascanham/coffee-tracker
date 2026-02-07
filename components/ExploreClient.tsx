"use client";

import { useState, useMemo } from "react";
import { CoffeeShop, Region } from "@/lib/types";
import RegionFilter from "@/components/RegionFilter";
import ViewToggle from "@/components/ViewToggle";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import MapView from "@/components/MapView";
import ShopDetailPanel from "@/components/ShopDetailPanel";

interface ExploreClientProps {
  shops: CoffeeShop[];
  regions: Region[];
}

export default function ExploreClient({ shops, regions }: ExploreClientProps) {
  const [view, setView] = useState<"list" | "map">("list");
  const [regionFilter, setRegionFilter] = useState<Region | "All">("All");
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);

  const filteredShops = useMemo(() => {
    if (regionFilter === "All") return shops;
    return shops.filter((shop) => shop.region === regionFilter);
  }, [regionFilter, shops]);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-espresso-900 sm:text-4xl">
          Explore
        </h1>
        <p className="mt-2 text-espresso-500">
          Discover {shops.length} specialty coffee shops across the UK.
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RegionFilter
          regions={regions}
          selected={regionFilter}
          onSelect={setRegionFilter}
        />
        <ViewToggle view={view} onToggle={setView} />
      </div>

      {/* Content */}
      {view === "list" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShops.map((shop) => (
            <CoffeeShopCard
              key={shop.slug}
              shop={shop}
              onSelect={setSelectedShop}
            />
          ))}
          {filteredShops.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg text-espresso-400">
                No shops found for this region.
              </p>
            </div>
          )}
        </div>
      ) : (
        <MapView shops={filteredShops} onSelectShop={setSelectedShop} />
      )}

      {/* Detail Panel */}
      <ShopDetailPanel
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
      />
    </>
  );
}

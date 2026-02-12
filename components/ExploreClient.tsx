"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CoffeeShop, Region } from "@/lib/types";
import { distanceInMiles } from "@/lib/geo";
import { useUserLocation } from "@/hooks/useUserLocation";
import RegionFilter from "@/components/RegionFilter";
import ViewToggle from "@/components/ViewToggle";
import LocationToggle from "@/components/LocationToggle";
import CoffeeShopCard from "@/components/CoffeeShopCard";
import MapView from "@/components/MapView";
import ShopDetailPanel from "@/components/ShopDetailPanel";

interface ExploreClientProps {
  shops: CoffeeShop[];
  regions: Region[];
}

const LS_KEY = "locationEnabled";

export default function ExploreClient({ shops, regions }: ExploreClientProps) {
  const { data: session } = useSession();
  const [view, setView] = useState<"list" | "map">("list");
  const [regionFilter, setRegionFilter] = useState<Region | "All">("All");
  const [selectedShop, setSelectedShop] = useState<CoffeeShop | null>(null);
  const { location, status, error, requestLocation, clearLocation } = useUserLocation();

  // Auto-request location if preference is saved
  useEffect(() => {
    let cancelled = false;

    async function checkPreference() {
      if (session?.user?.id) {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const profile = await res.json();
            if (!cancelled && profile.locationEnabled) {
              requestLocation();
            }
          }
        } catch {
          // Silently fail — user can still tap "Near me" manually
        }
      } else {
        const stored = localStorage.getItem(LS_KEY);
        if (stored === "true") {
          requestLocation();
        }
      }
    }

    checkPreference();
    return () => { cancelled = true; };
  }, [session?.user?.id, requestLocation]);

  const persistPreference = useCallback(
    async (enabled: boolean) => {
      if (session?.user?.id) {
        try {
          await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locationEnabled: enabled }),
          });
        } catch {
          // Silently fail
        }
      } else {
        localStorage.setItem(LS_KEY, String(enabled));
      }
    },
    [session?.user?.id]
  );

  const handleEnable = useCallback(() => {
    requestLocation();
    persistPreference(true);
  }, [requestLocation, persistPreference]);

  const handleDisable = useCallback(() => {
    clearLocation();
    persistPreference(false);
  }, [clearLocation, persistPreference]);

  const filteredShops = useMemo(() => {
    if (regionFilter === "All") return shops;
    return shops.filter((shop) => shop.region === regionFilter);
  }, [regionFilter, shops]);

  const shopsWithDistance = useMemo(() => {
    if (!location) return filteredShops.map((shop) => ({ shop, distance: null }));

    const withDist = filteredShops.map((shop) => ({
      shop,
      distance: distanceInMiles(location, shop.coordinates),
    }));

    withDist.sort((a, b) => a.distance - b.distance);
    return withDist;
  }, [filteredShops, location]);

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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <LocationToggle
          status={status}
          onEnable={handleEnable}
          onDisable={handleDisable}
        />
        <RegionFilter
          regions={regions}
          selected={regionFilter}
          onSelect={setRegionFilter}
        />
        <ViewToggle view={view} onToggle={setView} />
        {session && (
          <Link
            href="/explore/add"
            className="rounded-full bg-terracotta-600 px-5 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 sm:ml-auto"
          >
            Add Shop
          </Link>
        )}
      </div>

      {/* Location error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Content */}
      {view === "list" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopsWithDistance.map(({ shop, distance }) => (
            <CoffeeShopCard
              key={shop.slug}
              shop={shop}
              distance={distance}
              onSelect={setSelectedShop}
            />
          ))}
          {shopsWithDistance.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg text-espresso-400">
                No shops found for this region.
              </p>
            </div>
          )}
        </div>
      ) : (
        <MapView
          shops={filteredShops}
          onSelectShop={setSelectedShop}
          userLocation={location}
        />
      )}

      {/* Detail Panel */}
      <ShopDetailPanel
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
        currentUserId={session?.user?.id}
        userLocation={location}
      />
    </>
  );
}

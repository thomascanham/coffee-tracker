"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  MapRef,
} from "react-map-gl/mapbox";
import useSupercluster from "use-supercluster";
import "mapbox-gl/dist/mapbox-gl.css";
import { CoffeeShop } from "@/lib/types";
import { LatLng } from "@/lib/geo";
import { shopsToGeoJSON } from "@/lib/utils";
import MapMarker from "./MapMarker";
import MapPopup from "./MapPopup";
import UserMarker from "./UserMarker";

interface MapViewProps {
  shops: CoffeeShop[];
  onSelectShop: (shop: CoffeeShop) => void;
  userLocation?: LatLng | null;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Centre of the UK
const INITIAL_VIEW = {
  longitude: -2.5,
  latitude: 54.0,
  zoom: 5.5,
};

export default function MapView({ shops, onSelectShop, userLocation }: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const [popupShop, setPopupShop] = useState<CoffeeShop | null>(null);
  const hasFlewToUser = useRef(false);
  const [bounds, setBounds] = useState<
    [number, number, number, number] | undefined
  >(undefined);
  const [zoom, setZoom] = useState(INITIAL_VIEW.zoom);

  const geojson = shopsToGeoJSON(shops);

  const onMapMove = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const b = map.getMap().getBounds();
    if (!b) return;
    setBounds([
      b.getWest(),
      b.getSouth(),
      b.getEast(),
      b.getNorth(),
    ]);
    setZoom(map.getMap().getZoom());
  }, []);

  const { clusters, supercluster } = useSupercluster({
    points: geojson.features as Array<
      GeoJSON.Feature<GeoJSON.Point, Record<string, unknown>>
    >,
    bounds: bounds,
    zoom: zoom,
    options: { radius: 75, maxZoom: 16 },
  });

  const handleClusterClick = (
    clusterId: number,
    longitude: number,
    latitude: number
  ) => {
    if (!supercluster) return;
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      20
    );
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 500,
    });
  };

  // Fly to user's location on first fix
  useEffect(() => {
    if (userLocation && !hasFlewToUser.current && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 10,
        duration: 1000,
      });
      hasFlewToUser.current = true;
    }
  }, [userLocation]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "your_mapbox_token_here") {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center rounded-2xl border-2 border-dashed border-cream-300 bg-cream-100">
        <div className="text-center">
          <p className="text-lg font-semibold text-espresso-700">
            Mapbox Token Required
          </p>
          <p className="mt-2 max-w-sm text-sm text-espresso-500">
            Add your Mapbox access token to{" "}
            <code className="rounded bg-cream-200 px-1.5 py-0.5 text-xs">
              .env.local
            </code>{" "}
            as{" "}
            <code className="rounded bg-cream-200 px-1.5 py-0.5 text-xs">
              NEXT_PUBLIC_MAPBOX_TOKEN
            </code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] overflow-hidden rounded-2xl border border-cream-200 shadow-sm">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onMove={onMapMove}
        onLoad={onMapMove}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const properties = cluster.properties || {};
          const isCluster = properties.cluster === true;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${properties.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="center"
              >
                <button
                  onClick={() =>
                    handleClusterClick(
                      properties.cluster_id as number,
                      longitude,
                      latitude
                    )
                  }
                >
                  <MapMarker
                    isCluster
                    pointCount={properties.point_count as number}
                  />
                </button>
              </Marker>
            );
          }

          return (
            <Marker
              key={`shop-${properties.slug}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const shop = shops.find(
                    (s) => s.slug === properties.slug
                  );
                  if (shop) setPopupShop(shop);
                }}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <MapMarker />
              </button>
            </Marker>
          );
        })}

        {userLocation && <UserMarker location={userLocation} />}

        {popupShop && (
          <Popup
            longitude={popupShop.coordinates.lng}
            latitude={popupShop.coordinates.lat}
            anchor="bottom"
            offset={[0, -45] as [number, number]}
            onClose={() => setPopupShop(null)}
            closeOnClick={false}
          >
            <MapPopup
              shop={popupShop}
              onViewDetails={(shop) => {
                setPopupShop(null);
                onSelectShop(shop);
              }}
            />
          </Popup>
        )}
      </Map>
    </div>
  );
}

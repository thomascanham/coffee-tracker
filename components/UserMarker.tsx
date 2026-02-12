"use client";

import { Marker } from "react-map-gl/mapbox";
import { LatLng } from "@/lib/geo";

interface UserMarkerProps {
  location: LatLng;
}

export default function UserMarker({ location }: UserMarkerProps) {
  return (
    <Marker longitude={location.lng} latitude={location.lat} anchor="center">
      <div className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow-md" />
      </div>
    </Marker>
  );
}

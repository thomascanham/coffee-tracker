"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LatLng } from "@/lib/geo";

export type LocationStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "error";

interface UseUserLocationReturn {
  location: LatLng | null;
  status: LocationStatus;
  error: string | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

export function useUserLocation(): UseUserLocationReturn {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const clearLocation = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setLocation(null);
    setStatus("idle");
    setError(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setStatus("unavailable");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    if (!window.isSecureContext) {
      setStatus("unavailable");
      setError("Geolocation requires a secure (HTTPS) connection.");
      return;
    }

    setStatus("requesting");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setStatus("granted");
        setError(null);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setStatus("denied");
            setError("Location permission was denied.");
            break;
          case err.POSITION_UNAVAILABLE:
            setStatus("unavailable");
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setStatus("error");
            setError("Location request timed out.");
            break;
          default:
            setStatus("error");
            setError("An unknown error occurred.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return { location, status, error, requestLocation, clearLocation };
}

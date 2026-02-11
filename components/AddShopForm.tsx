"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrewMethodSelect from "@/components/BrewMethodSelect";
import { CoffeeShop } from "@/lib/types";

const REGIONS = {
  England: [
    "North East",
    "North West",
    "Yorkshire and the Humber",
    "East Midlands",
    "West Midlands",
    "East of England",
    "London",
    "South East",
    "South West",
  ],
  Scotland: [
    "Highlands & Islands",
    "North East Scotland",
    "Central Belt",
    "South Scotland",
  ],
  Wales: [
    "North Wales",
    "Mid Wales",
    "South West Wales",
    "South East Wales",
  ],
  "Northern Ireland": [
    "Northern Ireland",
  ],
} as const;

interface AddShopFormProps {
  initialData?: CoffeeShop;
  shopSlug?: string;
}

export default function AddShopForm({ initialData, shopSlug }: AddShopFormProps) {
  const isEditing = Boolean(shopSlug);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData?.name ?? "");
  const [region, setRegion] = useState(initialData?.region ?? "");
  const [city, setCity] = useState(initialData?.city ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [lat, setLat] = useState(initialData ? String(initialData.coordinates.lat) : "");
  const [lng, setLng] = useState(initialData ? String(initialData.coordinates.lng) : "");
  const [rating, setRating] = useState(initialData ? String(initialData.rating) : "");
  const [roaster, setRoaster] = useState(initialData?.roaster ?? "");
  const [brewMethods, setBrewMethods] = useState<string[]>(initialData?.brewMethods ?? []);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [website, setWebsite] = useState(initialData?.website ?? "");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (brewMethods.length === 0) {
      setError("Please select at least one brew method.");
      return;
    }

    setSubmitting(true);

    try {
      const url = isEditing ? `/api/shops/${shopSlug}` : "/api/shops";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          region,
          city,
          address,
          lat,
          lng,
          rating,
          roaster,
          brewMethods,
          description,
          notes,
          imageUrl,
          website,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }

      router.push("/explore");
    } catch {
      setError("Something went wrong.");
      setSubmitting(false);
    }
  }

  async function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    if (!window.isSecureContext) {
      setLocationError(
        "Location requires a secure (HTTPS) connection. On mobile, try accessing the site over HTTPS."
      );
      return;
    }

    // Check permission state before requesting to give better feedback
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        if (status.state === "denied") {
          setLocationError(
            "Location access is blocked. Please enable it in your browser or device settings and try again."
          );
          return;
        }
      } catch {
        // permissions.query not supported for geolocation in some browsers — continue anyway
      }
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError(
              "Location permission denied. Please allow location access in your browser settings and try again."
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable. Make sure location services are enabled on your device.");
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Try again or enter coordinates manually.");
            break;
          default:
            setLocationError("Could not get location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const inputClass =
    "w-full rounded-lg border border-cream-300 px-4 py-2.5 text-espresso-900 placeholder:text-espresso-300 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-espresso-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl rounded-2xl border border-cream-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="mb-6 text-2xl font-bold text-espresso-900">
        {isEditing ? "Edit Coffee Shop" : "Add a Coffee Shop"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Origin Coffee"
        />
      </div>

      {/* Region */}
      <div className="mb-4">
        <label htmlFor="region" className={labelClass}>
          Region
        </label>
        <select
          id="region"
          required
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a region</option>
          {Object.entries(REGIONS).map(([country, regions]) => (
            <optgroup key={country} label={country}>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="mb-4">
        <label htmlFor="city" className={labelClass}>
          City
        </label>
        <input
          id="city"
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClass}
          placeholder="e.g. Bristol"
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label htmlFor="address" className={labelClass}>
          Address
        </label>
        <input
          id="address"
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
          placeholder="e.g. 33 Broad Street, Bristol BS1 2EP"
        />
      </div>

      {/* Latitude / Longitude */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className={labelClass}>Latitude / Longitude</span>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={locating}
            className="inline-flex items-center gap-1.5 rounded-full border border-cream-300 px-3 py-1 text-xs font-medium text-espresso-600 transition-colors hover:bg-cream-50 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                clipRule="evenodd"
              />
            </svg>
            {locating ? "Locating..." : "Use my location"}
          </button>
        </div>
        {locationError && (
          <p className="mb-2 text-xs text-red-500">{locationError}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="sr-only">
              Latitude
            </label>
            <input
              id="lat"
              type="number"
              step="any"
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className={inputClass}
              placeholder="e.g. 51.4545"
            />
          </div>
          <div>
            <label htmlFor="lng" className="sr-only">
              Longitude
            </label>
            <input
              id="lng"
              type="number"
              step="any"
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className={inputClass}
              placeholder="e.g. -2.5879"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label htmlFor="rating" className={labelClass}>
          Rating
        </label>
        <select
          id="rating"
          required
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Roaster */}
      <div className="mb-4">
        <label htmlFor="roaster" className={labelClass}>
          Roaster
        </label>
        <input
          id="roaster"
          type="text"
          required
          value={roaster}
          onChange={(e) => setRoaster(e.target.value)}
          className={inputClass}
          placeholder="e.g. Origin Coffee Roasters"
        />
      </div>

      {/* Brew Methods */}
      <div className="mb-4">
        <label className={labelClass}>Brew Methods</label>
        <BrewMethodSelect selected={brewMethods} onChange={setBrewMethods} />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Tell us about this coffee shop..."
        />
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label htmlFor="notes" className={labelClass}>
          Notes
        </label>
        <textarea
          id="notes"
          required
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
          placeholder="Any additional notes..."
        />
      </div>

      {/* Image URL (optional) */}
      <div className="mb-4">
        <label htmlFor="imageUrl" className={labelClass}>
          Image URL <span className="font-normal text-espresso-400">(optional)</span>
        </label>
        <input
          id="imageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={inputClass}
          placeholder="https://example.com/image.jpg"
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="mt-2 h-40 w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/* Website */}
      <div className="mb-6">
        <label htmlFor="website" className={labelClass}>
          Website
        </label>
        <input
          id="website"
          type="url"
          required
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className={inputClass}
          placeholder="https://example.com"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-terracotta-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 disabled:opacity-50"
      >
        {submitting
          ? (isEditing ? "Saving..." : "Adding...")
          : (isEditing ? "Save Changes" : "Add Coffee Shop")}
      </button>
    </form>
  );
}

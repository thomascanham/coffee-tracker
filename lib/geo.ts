export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_MILES = 3958.8;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function distanceInMiles(from: LatLng, to: LatLng): number {
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

export function formatDistance(miles: number): string {
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

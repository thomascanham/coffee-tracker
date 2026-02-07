import { CoffeeShop } from "./types";

export function shopsToGeoJSON(
  shops: CoffeeShop[]
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: shops.map((shop) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [shop.coordinates.lng, shop.coordinates.lat],
      },
      properties: {
        slug: shop.slug,
        name: shop.name,
        region: shop.region,
        city: shop.city,
        rating: shop.rating,
        roaster: shop.roaster,
        imageUrl: shop.imageUrl,
      },
    })),
  };
}

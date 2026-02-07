import { prisma } from "./db";
import { CoffeeShop, Region } from "./types";

function toShop(row: {
  slug: string;
  name: string;
  region: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  roaster: string;
  brewMethods: unknown;
  description: string;
  notes: string;
  imageUrl: string;
  website: string;
}): CoffeeShop {
  return {
    slug: row.slug,
    name: row.name,
    region: row.region as Region,
    city: row.city,
    address: row.address,
    coordinates: { lat: row.lat, lng: row.lng },
    rating: row.rating,
    roaster: row.roaster,
    brewMethods: row.brewMethods as string[],
    description: row.description,
    notes: row.notes,
    imageUrl: row.imageUrl,
    website: row.website,
  };
}

export async function getCoffeeShops(): Promise<CoffeeShop[]> {
  const rows = await prisma.coffeeShop.findMany({
    orderBy: { name: "asc" },
  });
  return rows.map(toShop);
}

export async function getShopBySlug(
  slug: string
): Promise<CoffeeShop | null> {
  const row = await prisma.coffeeShop.findUnique({ where: { slug } });
  return row ? toShop(row) : null;
}

export async function getRegions(): Promise<Region[]> {
  const rows = await prisma.coffeeShop.findMany({
    select: { region: true },
    distinct: ["region"],
    orderBy: { region: "asc" },
  });
  return rows.map((r) => r.region as Region);
}

export async function getFeaturedShops(): Promise<CoffeeShop[]> {
  const rows = await prisma.coffeeShop.findMany({
    where: { rating: 5 },
    orderBy: { name: "asc" },
  });
  return rows.map(toShop);
}

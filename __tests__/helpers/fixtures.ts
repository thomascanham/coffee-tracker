import type { CoffeeShop } from "@/lib/types";

export const mockShop: CoffeeShop = {
  slug: "test-coffee-shop",
  name: "Test Coffee Shop",
  region: "London",
  city: "London",
  address: "123 Test Street, London",
  coordinates: { lat: 51.5074, lng: -0.1278 },
  rating: 4,
  roaster: "Test Roaster",
  brewMethods: ["Espresso", "V60", "AeroPress"],
  description: "A lovely test coffee shop.",
  notes: "Great single origin options.",
  imageUrl: "https://example.com/shop.jpg",
  website: "https://testcoffee.com",
  addedByUserId: "user-1",
};

export const mockShop2: CoffeeShop = {
  slug: "another-coffee-shop",
  name: "Another Coffee Shop",
  region: "North West",
  city: "Manchester",
  address: "456 Other Street, Manchester",
  coordinates: { lat: 53.4808, lng: -2.2426 },
  rating: 5,
  roaster: "Another Roaster",
  brewMethods: ["Espresso", "Chemex"],
  description: "Another lovely coffee shop.",
  notes: "Amazing flat whites.",
  imageUrl: "https://example.com/shop2.jpg",
  website: "https://anothercoffee.com",
  addedByUserId: "user-2",
};

export const mockSession = {
  user: { id: "user-1", name: "Test User", email: "test@example.com" },
  expires: "2099-01-01T00:00:00.000Z",
};

export const mockSessionData = {
  data: mockSession,
  status: "authenticated" as const,
  update: vi.fn(),
};

export const mockUnauthenticatedSession = {
  data: null,
  status: "unauthenticated" as const,
  update: vi.fn(),
};

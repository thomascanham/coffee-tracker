import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../page";
import { createMockPrisma, type MockPrisma } from "@/__tests__/helpers/mock-prisma";

let mockPrisma: MockPrisma;

vi.mock("@/lib/db", () => ({
  get prisma() {
    return mockPrisma;
  },
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => {
    mockRedirect(...args);
    throw new Error("NEXT_REDIRECT");
  },
}));

// Mock ProfileForm since it has its own state/effects
vi.mock("@/components/ProfileForm", () => ({
  default: () => <div data-testid="profile-form" />,
}));

vi.mock("@/components/RatingStars", () => ({
  default: ({ rating }: { rating: number }) => <div data-testid="rating-stars">{rating}</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma = createMockPrisma();
});

const mockUser = {
  id: "user-1",
  username: "testuser",
  email: "test@example.com",
  profilePictureUrl: null,
  favouriteBrewMethods: ["Espresso"],
};

const mockFavouriteShop = {
  slug: "fav-shop",
  name: "Fav Coffee",
  city: "London",
  region: "London",
  rating: 5,
  roaster: "Fav Roaster",
  imageUrl: "",
};

describe("ProfilePage", () => {
  it("redirects when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);

    await expect(ProfilePage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects when user is not found in database", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.coffeeShop.findMany.mockResolvedValue([]);
    mockPrisma.favourite.findMany.mockResolvedValue([]);

    await expect(ProfilePage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/sign-in");
  });

  it("renders 'Your Favourite Shops' heading", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.coffeeShop.findMany.mockResolvedValue([]);
    mockPrisma.favourite.findMany.mockResolvedValue([]);

    const jsx = await ProfilePage();
    render(jsx);
    expect(screen.getByText("Your Favourite Shops")).toBeInTheDocument();
  });

  it("shows empty state when no favourites", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.coffeeShop.findMany.mockResolvedValue([]);
    mockPrisma.favourite.findMany.mockResolvedValue([]);

    const jsx = await ProfilePage();
    render(jsx);
    expect(screen.getByText(/haven't favourited any coffee shops/)).toBeInTheDocument();
  });

  it("renders favourite shop cards with links", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.coffeeShop.findMany.mockResolvedValue([]);
    mockPrisma.favourite.findMany.mockResolvedValue([
      { coffeeShop: mockFavouriteShop },
    ]);

    const jsx = await ProfilePage();
    render(jsx);
    expect(screen.getByText("Fav Coffee")).toBeInTheDocument();
    expect(screen.getByText(/Fav Roaster/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Fav Coffee/i });
    expect(link).toHaveAttribute("href", "/explore?shop=fav-shop");
  });

  it("renders profile form", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);
    mockPrisma.coffeeShop.findMany.mockResolvedValue([]);
    mockPrisma.favourite.findMany.mockResolvedValue([]);

    const jsx = await ProfilePage();
    render(jsx);
    expect(screen.getByTestId("profile-form")).toBeInTheDocument();
  });
});

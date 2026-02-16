import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExploreClient from "../ExploreClient";
import { mockShop, mockShop2 } from "@/__tests__/helpers/fixtures";
import type { Region } from "@/lib/types";

// Mock useSession
const mockUseSession = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

// Mock useUserLocation
vi.mock("@/hooks/useUserLocation", () => ({
  useUserLocation: () => ({
    location: null,
    status: "idle",
    error: null,
    requestLocation: vi.fn(),
    clearLocation: vi.fn(),
  }),
}));

// Mock child components
vi.mock("../RegionFilter", () => ({
  default: () => <div data-testid="region-filter" />,
}));

vi.mock("../ViewToggle", () => ({
  default: () => <div data-testid="view-toggle" />,
}));

vi.mock("../LocationToggle", () => ({
  default: () => <div data-testid="location-toggle" />,
}));

vi.mock("../MapView", () => ({
  default: () => <div data-testid="map-view" />,
}));

vi.mock("../RatingStars", () => ({
  default: () => <div data-testid="rating-stars" />,
}));

vi.mock("../FavouriteButton", () => ({
  default: ({ shopSlug, favourited, onToggle }: { shopSlug: string; favourited: boolean; onToggle?: (slug: string, fav: boolean) => void }) => (
    <button
      data-testid={`fav-btn-${shopSlug}`}
      data-favourited={String(favourited)}
      onClick={(e) => {
        e.stopPropagation();
        onToggle?.(shopSlug, !favourited);
      }}
    >
      Fav
    </button>
  ),
}));

vi.mock("../ShopDetailPanel", () => ({
  default: () => <div data-testid="shop-detail-panel" />,
}));

const shops = [mockShop, mockShop2];
const regions: Region[] = ["London", "North West"];

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = vi.fn();
});

describe("ExploreClient", () => {
  it("fetches /api/favourites on mount when authenticated", async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    vi.mocked(globalThis.fetch).mockImplementation(async (url) => {
      if (String(url).includes("/api/favourites")) {
        return new Response(JSON.stringify({ favourites: ["test-coffee-shop"] }), { status: 200 });
      }
      if (String(url).includes("/api/profile")) {
        return new Response(JSON.stringify({ locationEnabled: false }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    });

    render(<ExploreClient shops={shops} regions={regions} />);

    await waitFor(() => {
      const calls = vi.mocked(globalThis.fetch).mock.calls;
      expect(calls.some((c) => String(c[0]).includes("/api/favourites"))).toBe(true);
    });
  });

  it("does not fetch /api/favourites when unauthenticated", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<ExploreClient shops={shops} regions={regions} />);

    const calls = vi.mocked(globalThis.fetch).mock.calls;
    expect(calls.some((c) => String(c[0]).includes("/api/favourites"))).toBe(false);
  });

  it("renders shop cards", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<ExploreClient shops={shops} regions={regions} />);
    expect(screen.getByText("Test Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("Another Coffee Shop")).toBeInTheDocument();
  });

  it("shows filled hearts for favourited shops", async () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    vi.mocked(globalThis.fetch).mockImplementation(async (url) => {
      if (String(url).includes("/api/favourites")) {
        return new Response(JSON.stringify({ favourites: ["test-coffee-shop"] }), { status: 200 });
      }
      if (String(url).includes("/api/profile")) {
        return new Response(JSON.stringify({ locationEnabled: false }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    });

    render(<ExploreClient shops={shops} regions={regions} />);

    await waitFor(() => {
      const favBtn = screen.getByTestId("fav-btn-test-coffee-shop");
      expect(favBtn).toHaveAttribute("data-favourited", "true");
    });

    const otherBtn = screen.getByTestId("fav-btn-another-coffee-shop");
    expect(otherBtn).toHaveAttribute("data-favourited", "false");
  });

  it("toggle click updates favourite state", async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    vi.mocked(globalThis.fetch).mockImplementation(async (url) => {
      if (String(url).includes("/api/favourites")) {
        return new Response(JSON.stringify({ favourites: [] }), { status: 200 });
      }
      if (String(url).includes("/api/profile")) {
        return new Response(JSON.stringify({ locationEnabled: false }), { status: 200 });
      }
      return new Response("{}", { status: 200 });
    });

    render(<ExploreClient shops={shops} regions={regions} />);

    // Wait for initial fetch
    await waitFor(() => {
      expect(screen.getByTestId("fav-btn-test-coffee-shop")).toHaveAttribute("data-favourited", "false");
    });

    // Click to toggle
    await user.click(screen.getByTestId("fav-btn-test-coffee-shop"));

    await waitFor(() => {
      expect(screen.getByTestId("fav-btn-test-coffee-shop")).toHaveAttribute("data-favourited", "true");
    });
  });

  it("shows Add Shop link when session exists", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "user-1" } }, status: "authenticated" });
    vi.mocked(globalThis.fetch).mockResolvedValue(new Response(JSON.stringify({ favourites: [] }), { status: 200 }));

    render(<ExploreClient shops={shops} regions={regions} />);
    expect(screen.getByText("Add Shop")).toBeInTheDocument();
  });

  it("does not show Add Shop link when no session", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<ExploreClient shops={shops} regions={regions} />);
    expect(screen.queryByText("Add Shop")).not.toBeInTheDocument();
  });

  it("displays correct shop count in subtitle", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<ExploreClient shops={shops} regions={regions} />);
    expect(screen.getByText(/Discover 2 specialty coffee shops/)).toBeInTheDocument();
  });
});

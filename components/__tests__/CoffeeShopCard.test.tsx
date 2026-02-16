import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoffeeShopCard from "../CoffeeShopCard";
import { mockShop } from "@/__tests__/helpers/fixtures";

// Mock child components that are not the focus of these tests
vi.mock("../RatingStars", () => ({
  default: ({ rating }: { rating: number }) => <div data-testid="rating-stars">{rating} stars</div>,
}));

vi.mock("../FavouriteButton", () => ({
  default: ({ shopSlug, favourited }: { shopSlug: string; favourited: boolean }) => (
    <button data-testid="fav-btn" data-slug={shopSlug} data-favourited={String(favourited)}>
      Fav
    </button>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CoffeeShopCard", () => {
  const defaultProps = {
    shop: mockShop,
    onSelect: vi.fn(),
    isLoggedIn: false,
  };

  it("renders shop name, city, region, and roaster", () => {
    render(<CoffeeShopCard {...defaultProps} />);
    expect(screen.getByText("Test Coffee Shop")).toBeInTheDocument();
    expect(screen.getAllByText("London")).toHaveLength(2); // city + region
    expect(screen.getByText(/Test Roaster/)).toBeInTheDocument();
  });

  it("renders rating stars", () => {
    render(<CoffeeShopCard {...defaultProps} />);
    expect(screen.getByTestId("rating-stars")).toHaveTextContent("4 stars");
  });

  it("does not render FavouriteButton when isLoggedIn is false", () => {
    render(<CoffeeShopCard {...defaultProps} isLoggedIn={false} />);
    expect(screen.queryByTestId("fav-btn")).not.toBeInTheDocument();
  });

  it("renders FavouriteButton when isLoggedIn is true", () => {
    render(<CoffeeShopCard {...defaultProps} isLoggedIn={true} isFavourited={true} />);
    const btn = screen.getByTestId("fav-btn");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("data-favourited", "true");
  });

  it("passes correct slug to FavouriteButton", () => {
    render(<CoffeeShopCard {...defaultProps} isLoggedIn={true} />);
    expect(screen.getByTestId("fav-btn")).toHaveAttribute("data-slug", "test-coffee-shop");
  });

  it("calls onSelect when card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CoffeeShopCard {...defaultProps} onSelect={onSelect} />);
    await user.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(mockShop);
  });

  it("calls onSelect when Enter key is pressed", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CoffeeShopCard {...defaultProps} onSelect={onSelect} />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith(mockShop);
  });
});

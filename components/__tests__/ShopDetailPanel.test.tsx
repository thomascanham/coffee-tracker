import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ShopDetailPanel from "../ShopDetailPanel";
import { mockShop } from "@/__tests__/helpers/fixtures";

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

describe("ShopDetailPanel", () => {
  const defaultProps = {
    shop: mockShop,
    onClose: vi.fn(),
  };

  it("does not render shop content when shop is null", () => {
    render(<ShopDetailPanel shop={null} onClose={vi.fn()} />);
    expect(screen.queryByText("Test Coffee Shop")).not.toBeInTheDocument();
  });

  it("renders shop details when shop is provided", () => {
    render(<ShopDetailPanel {...defaultProps} />);
    expect(screen.getByText("Test Coffee Shop")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street, London")).toBeInTheDocument();
    expect(screen.getByText("Test Roaster")).toBeInTheDocument();
    expect(screen.getByText("A lovely test coffee shop.")).toBeInTheDocument();
  });

  it("renders brew methods", () => {
    render(<ShopDetailPanel {...defaultProps} />);
    expect(screen.getByText("Espresso")).toBeInTheDocument();
    expect(screen.getByText("V60")).toBeInTheDocument();
    expect(screen.getByText("AeroPress")).toBeInTheDocument();
  });

  it("does not render FavouriteButton when currentUserId is not set", () => {
    render(<ShopDetailPanel {...defaultProps} />);
    expect(screen.queryByTestId("fav-btn")).not.toBeInTheDocument();
  });

  it("renders FavouriteButton when currentUserId is set", () => {
    render(<ShopDetailPanel {...defaultProps} currentUserId="user-1" isFavourited={true} />);
    const btn = screen.getByTestId("fav-btn");
    expect(btn).toHaveAttribute("data-favourited", "true");
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<ShopDetailPanel {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(<ShopDetailPanel {...defaultProps} onClose={onClose} />);
    // The backdrop is the first child div with fixed positioning
    const backdrop = container.querySelector(".fixed.inset-0") as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows Edit link only when user owns the shop", () => {
    // Not the owner
    const { rerender } = render(<ShopDetailPanel {...defaultProps} currentUserId="user-2" />);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    // Is the owner (shop.addedByUserId is "user-1")
    rerender(<ShopDetailPanel {...defaultProps} currentUserId="user-1" />);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
});

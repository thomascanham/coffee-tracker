import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FavouriteButton from "../FavouriteButton";

beforeEach(() => {
  vi.clearAllMocks();
  globalThis.fetch = vi.fn();
});

describe("FavouriteButton", () => {
  it("renders 'Add to favourites' label when not favourited", () => {
    render(<FavouriteButton shopSlug="test" favourited={false} />);
    expect(screen.getByLabelText("Add to favourites")).toBeInTheDocument();
  });

  it("renders 'Remove from favourites' label when favourited", () => {
    render(<FavouriteButton shopSlug="test" favourited={true} />);
    expect(screen.getByLabelText("Remove from favourites")).toBeInTheDocument();
  });

  it("renders filled heart when favourited", () => {
    const { container } = render(<FavouriteButton shopSlug="test" favourited={true} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "#ef4444");
  });

  it("renders outline heart when not favourited", () => {
    const { container } = render(<FavouriteButton shopSlug="test" favourited={false} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("fill", "none");
  });

  it("calls POST with correct slug on click and invokes onToggle on success", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ favourited: true }), { status: 200 }),
    );

    render(<FavouriteButton shopSlug="my-shop" favourited={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("button"));

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: "my-shop" }),
    });
    expect(onToggle).toHaveBeenCalledWith("my-shop", true);
  });

  it("does not call onToggle on fetch failure", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "fail" }), { status: 500 }),
    );

    render(<FavouriteButton shopSlug="my-shop" favourited={false} onToggle={onToggle} />);
    await user.click(screen.getByRole("button"));

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("prevents event propagation on click", async () => {
    const user = userEvent.setup();
    const parentClick = vi.fn();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ favourited: true }), { status: 200 }),
    );

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentClick}>
        <FavouriteButton shopSlug="test" favourited={false} />
      </div>,
    );

    await user.click(screen.getByRole("button"));
    expect(parentClick).not.toHaveBeenCalled();
  });
});

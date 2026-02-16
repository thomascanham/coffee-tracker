import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { createMockPrisma, type MockPrisma } from "@/__tests__/helpers/mock-prisma";
import { mockSession } from "@/__tests__/helpers/fixtures";

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

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma = createMockPrisma();
});

describe("GET /api/favourites", () => {
  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("returns slugs array for authenticated user", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.favourite.findMany.mockResolvedValue([
      { coffeeShop: { slug: "shop-a" } },
      { coffeeShop: { slug: "shop-b" } },
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.favourites).toEqual(["shop-a", "shop-b"]);
  });

  it("returns empty array when no favourites", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.favourite.findMany.mockResolvedValue([]);

    const res = await GET();
    const body = await res.json();
    expect(body.favourites).toEqual([]);
  });
});

describe("POST /api/favourites", () => {
  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: "some-shop" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when shopSlug is missing", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("shopSlug is required");
  });

  it("returns 400 when shopSlug is not a string", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: 123 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when shop not found", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.coffeeShop.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: "nonexistent" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("Shop not found");
  });

  it("creates a favourite when not already favourited", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.coffeeShop.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.favourite.findUnique.mockResolvedValue(null);
    mockPrisma.favourite.create.mockResolvedValue({});

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: "test-shop" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.favourited).toBe(true);
    expect(mockPrisma.favourite.create).toHaveBeenCalledWith({
      data: { userId: "user-1", coffeeShopId: 1 },
    });
  });

  it("deletes a favourite when already favourited", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrisma.coffeeShop.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.favourite.findUnique.mockResolvedValue({ id: "fav-1" });
    mockPrisma.favourite.delete.mockResolvedValue({});

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopSlug: "test-shop" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.favourited).toBe(false);
    expect(mockPrisma.favourite.delete).toHaveBeenCalledWith({
      where: { id: "fav-1" },
    });
  });

  it("returns 500 on unexpected error", async () => {
    mockAuth.mockResolvedValue(mockSession);

    const req = new Request("http://localhost/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("Something went wrong");
  });
});

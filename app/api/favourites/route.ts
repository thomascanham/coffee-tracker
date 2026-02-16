import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favourites = await prisma.favourite.findMany({
    where: { userId: session.user.id },
    include: { coffeeShop: { select: { slug: true } } },
  });

  return NextResponse.json({
    favourites: favourites.map((f) => f.coffeeShop.slug),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { shopSlug } = await req.json();

    if (!shopSlug || typeof shopSlug !== "string") {
      return NextResponse.json({ error: "shopSlug is required" }, { status: 400 });
    }

    const shop = await prisma.coffeeShop.findUnique({
      where: { slug: shopSlug },
      select: { id: true },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // Check if already favourited
    const existing = await prisma.favourite.findUnique({
      where: {
        userId_coffeeShopId: {
          userId: session.user.id,
          coffeeShopId: shop.id,
        },
      },
    });

    if (existing) {
      // Remove favourite
      await prisma.favourite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favourited: false });
    } else {
      // Add favourite
      await prisma.favourite.create({
        data: {
          userId: session.user.id,
          coffeeShopId: shop.id,
        },
      });
      return NextResponse.json({ favourited: true });
    }
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

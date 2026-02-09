import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      name,
      region,
      city,
      address,
      lat,
      lng,
      rating,
      roaster,
      brewMethods,
      description,
      notes,
      imageUrl,
      website,
    } = body;

    // Validate required fields
    if (
      !name ||
      !region ||
      !city ||
      !address ||
      lat == null ||
      lng == null ||
      !rating ||
      !roaster ||
      !brewMethods ||
      !Array.isArray(brewMethods) ||
      brewMethods.length === 0 ||
      !description ||
      !notes ||
      !website
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists, append random suffix if so
    const existing = await prisma.coffeeShop.findUnique({ where: { slug } });
    if (existing) {
      const suffix = Math.random().toString(36).substring(2, 8);
      slug = `${slug}-${suffix}`;
    }

    const shop = await prisma.coffeeShop.create({
      data: {
        slug,
        name,
        region,
        city,
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        rating: parseInt(rating, 10),
        roaster,
        brewMethods,
        description,
        notes,
        imageUrl: imageUrl || "",
        website,
        addedByUserId: session.user.id,
      },
    });

    return NextResponse.json(shop, { status: 201 });
  } catch (error) {
    console.error("POST /api/shops error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

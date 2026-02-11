import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isValidRating, isValidLatitude, isValidLongitude, isValidRegion, isValidUrl } from "@/lib/validation";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const shop = await prisma.coffeeShop.findUnique({ where: { slug } });
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    if (shop.addedByUserId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRating = parseInt(rating, 10);

    if (!isValidRegion(region)) {
      return NextResponse.json({ error: "Invalid region" }, { status: 400 });
    }
    if (!isValidLatitude(parsedLat)) {
      return NextResponse.json({ error: "Latitude must be between -90 and 90" }, { status: 400 });
    }
    if (!isValidLongitude(parsedLng)) {
      return NextResponse.json({ error: "Longitude must be between -180 and 180" }, { status: 400 });
    }
    if (!isValidRating(parsedRating)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (website && !isValidUrl(website)) {
      return NextResponse.json({ error: "Website must be a valid URL" }, { status: 400 });
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      return NextResponse.json({ error: "Image URL must be a valid URL" }, { status: 400 });
    }

    const updated = await prisma.coffeeShop.update({
      where: { slug },
      data: {
        name,
        region,
        city,
        address,
        lat: parsedLat,
        lng: parsedLng,
        rating: parsedRating,
        roaster,
        brewMethods,
        description,
        notes,
        imageUrl: imageUrl || "",
        website,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT /api/shops/[slug] error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

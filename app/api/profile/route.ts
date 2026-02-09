import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isValidUsername, isValidUrl } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      profilePictureUrl: true,
      favouriteBrewMethods: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, profilePictureUrl, favouriteBrewMethods } = await req.json();

    if (username !== undefined && username !== "" && !isValidUsername(username)) {
      return NextResponse.json(
        { error: "Username must be 2-30 characters and contain only letters, numbers, hyphens and underscores" },
        { status: 400 }
      );
    }

    if (profilePictureUrl !== undefined && profilePictureUrl !== "" && !isValidUrl(profilePictureUrl)) {
      return NextResponse.json(
        { error: "Profile picture must be a valid URL" },
        { status: 400 }
      );
    }

    if (favouriteBrewMethods !== undefined && !Array.isArray(favouriteBrewMethods)) {
      return NextResponse.json(
        { error: "Brew methods must be an array" },
        { status: 400 }
      );
    }

    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          { error: "This username is already taken" },
          { status: 409 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(username !== undefined && { username, name: username }),
        ...(profilePictureUrl !== undefined && { profilePictureUrl }),
        ...(favouriteBrewMethods !== undefined && { favouriteBrewMethods }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        favouriteBrewMethods: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

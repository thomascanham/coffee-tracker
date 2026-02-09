import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProfileForm from "@/components/ProfileForm";
import RatingStars from "@/components/RatingStars";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const [user, addedShops] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        profilePictureUrl: true,
        favouriteBrewMethods: true,
      },
    }),
    prisma.coffeeShop.findMany({
      where: { addedByUserId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-espresso-900">
        Your Profile
      </h1>
      <ProfileForm
        initialData={{
          username: user.username || "",
          email: user.email,
          profilePictureUrl: user.profilePictureUrl || "",
          favouriteBrewMethods: (user.favouriteBrewMethods as string[]) || [],
        }}
      />

      {/* Added Coffee Shops */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-espresso-900">
            Your Added Shops
          </h2>
          <Link
            href="/explore/add"
            className="rounded-full bg-terracotta-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700"
          >
            Add Shop
          </Link>
        </div>

        {addedShops.length === 0 ? (
          <div className="rounded-2xl border border-cream-200 bg-white p-8 text-center shadow-sm">
            <p className="text-espresso-400">
              You haven&apos;t added any coffee shops yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addedShops.map((shop) => (
              <Link
                key={shop.slug}
                href={`/explore?shop=${shop.slug}`}
                className="flex overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition-all hover:border-cream-300 hover:shadow-md"
              >
                <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                  {shop.imageUrl ? (
                    <Image
                      src={shop.imageUrl}
                      alt={shop.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cream-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-cream-300">
                        <path d="M2 21V19H20V21H2ZM4 18C3.45 18 2.97917 17.8042 2.5875 17.4125C2.19583 17.0208 2 16.55 2 16V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V7H20C20.55 7 21.0208 7.19583 21.4125 7.5875C21.8042 7.97917 22 8.45 22 9V13C22 13.55 21.8042 14.0208 21.4125 14.4125C21.0208 14.8042 20.55 15 20 15H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H4ZM18 13H20V9H18V13Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 p-4">
                  <h3 className="font-heading text-base font-semibold text-espresso-900">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-espresso-500">
                    {shop.city}, {shop.region}
                  </p>
                  <RatingStars rating={shop.rating} />
                  <p className="text-xs text-espresso-400">
                    Roaster: {shop.roaster}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

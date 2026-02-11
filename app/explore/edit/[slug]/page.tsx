import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Region } from "@/lib/types";
import AddShopForm from "@/components/AddShopForm";

export default async function EditShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const { slug } = await params;

  const row = await prisma.coffeeShop.findUnique({ where: { slug } });

  if (!row || row.addedByUserId !== session.user.id) {
    redirect("/explore");
  }

  const shop = {
    slug: row.slug,
    name: row.name,
    region: row.region as Region,
    city: row.city,
    address: row.address,
    coordinates: { lat: row.lat, lng: row.lng },
    rating: row.rating,
    roaster: row.roaster,
    brewMethods: row.brewMethods as string[],
    description: row.description,
    notes: row.notes,
    imageUrl: row.imageUrl,
    website: row.website,
    addedByUserId: row.addedByUserId,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AddShopForm initialData={shop} shopSlug={slug} />
    </main>
  );
}

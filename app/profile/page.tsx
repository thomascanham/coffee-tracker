import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
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
    </div>
  );
}

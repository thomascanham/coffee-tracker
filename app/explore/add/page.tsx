import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddShopForm from "@/components/AddShopForm";

export default async function AddShopPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AddShopForm />
    </main>
  );
}

import { getCoffeeShops, getRegions } from "@/lib/data";
import ExploreClient from "@/components/ExploreClient";

export default async function ExplorePage() {
  const [shops, regions] = await Promise.all([getCoffeeShops(), getRegions()]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ExploreClient shops={shops} regions={regions} />
    </main>
  );
}

import Hero from "@/components/Hero";
import FeaturedShops from "@/components/FeaturedShops";
import { getFeaturedShops } from "@/lib/data";

export default async function Home() {
  const featured = await getFeaturedShops();

  return (
    <main>
      <Hero />
      <FeaturedShops shops={featured} />
    </main>
  );
}

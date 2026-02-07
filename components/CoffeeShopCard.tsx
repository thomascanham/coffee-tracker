import Image from "next/image";
import { CoffeeShop } from "@/lib/types";
import RatingStars from "./RatingStars";

interface CoffeeShopCardProps {
  shop: CoffeeShop;
  onSelect: (shop: CoffeeShop) => void;
}

export default function CoffeeShopCard({ shop, onSelect }: CoffeeShopCardProps) {
  return (
    <button
      onClick={() => onSelect(shop)}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white text-left shadow-sm transition-all hover:shadow-md hover:border-cream-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={shop.imageUrl}
          alt={shop.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <span className="absolute right-3 top-3 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-medium text-espresso-700 backdrop-blur-sm">
          {shop.region}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold text-espresso-900">
          {shop.name}
        </h3>
        <p className="text-sm text-espresso-500">{shop.city}</p>
        <RatingStars rating={shop.rating} />
        <p className="text-xs text-espresso-400">
          Roaster: {shop.roaster}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-espresso-600">
          {shop.notes}
        </p>
      </div>
    </button>
  );
}

import Image from "next/image";
import { CoffeeShop } from "@/lib/types";
import { formatDistance } from "@/lib/geo";
import RatingStars from "./RatingStars";

interface CoffeeShopCardProps {
  shop: CoffeeShop;
  distance?: number | null;
  onSelect: (shop: CoffeeShop) => void;
}

export default function CoffeeShopCard({ shop, distance, onSelect }: CoffeeShopCardProps) {
  return (
    <button
      onClick={() => onSelect(shop)}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white text-left shadow-sm transition-all hover:shadow-md hover:border-cream-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {shop.imageUrl ? (
          <Image
            src={shop.imageUrl}
            alt={shop.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-cream-300">
              <path d="M2 21V19H20V21H2ZM4 18C3.45 18 2.97917 17.8042 2.5875 17.4125C2.19583 17.0208 2 16.55 2 16V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V7H20C20.55 7 21.0208 7.19583 21.4125 7.5875C21.8042 7.97917 22 8.45 22 9V13C22 13.55 21.8042 14.0208 21.4125 14.4125C21.0208 14.8042 20.55 15 20 15H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H4ZM18 13H20V9H18V13Z" />
            </svg>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-cream-50/90 px-3 py-1 text-xs font-medium text-espresso-700 backdrop-blur-sm">
          {shop.region}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-heading text-lg font-semibold text-espresso-900">
          {shop.name}
        </h3>
        <p className="text-sm text-espresso-500">
          {shop.city}
          {distance != null && (
            <span className="ml-2 text-sage-600">&middot; {formatDistance(distance)} away</span>
          )}
        </p>
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

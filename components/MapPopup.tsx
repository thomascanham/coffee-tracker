import Image from "next/image";
import { CoffeeShop } from "@/lib/types";
import RatingStars from "./RatingStars";

interface MapPopupProps {
  shop: CoffeeShop;
  onViewDetails: (shop: CoffeeShop) => void;
}

export default function MapPopup({ shop, onViewDetails }: MapPopupProps) {
  return (
    <div className="w-64">
      <div className="relative h-32 w-full">
        {shop.imageUrl ? (
          <Image
            src={shop.imageUrl}
            alt={shop.name}
            fill
            className="object-cover"
            sizes="256px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-cream-300">
              <path d="M2 21V19H20V21H2ZM4 18C3.45 18 2.97917 17.8042 2.5875 17.4125C2.19583 17.0208 2 16.55 2 16V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H16C16.55 4 17.0208 4.19583 17.4125 4.5875C17.8042 4.97917 18 5.45 18 6V7H20C20.55 7 21.0208 7.19583 21.4125 7.5875C21.8042 7.97917 22 8.45 22 9V13C22 13.55 21.8042 14.0208 21.4125 14.4125C21.0208 14.8042 20.55 15 20 15H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H4ZM18 13H20V9H18V13Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-heading text-sm font-semibold text-espresso-900">
          {shop.name}
        </h3>
        <p className="mt-0.5 text-xs text-espresso-500">{shop.city}</p>
        <div className="mt-1">
          <RatingStars rating={shop.rating} />
        </div>
        <button
          onClick={() => onViewDetails(shop)}
          className="mt-2 w-full rounded-lg bg-espresso-900 px-3 py-1.5 text-xs font-semibold text-cream-50 transition-colors hover:bg-espresso-800"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

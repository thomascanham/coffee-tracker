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
        <Image
          src={shop.imageUrl}
          alt={shop.name}
          fill
          className="object-cover"
          sizes="256px"
        />
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

export type Region =
  | "London"
  | "South West"
  | "Scotland"
  | "North West"
  | "Yorkshire"
  | "Wales"
  | "South East";

export interface CoffeeShop {
  slug: string;
  name: string;
  region: Region;
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  roaster: string;
  brewMethods: string[];
  description: string;
  notes: string;
  imageUrl: string;
  website: string;
}

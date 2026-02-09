export type Region =
  // England
  | "North East"
  | "North West"
  | "Yorkshire and the Humber"
  | "East Midlands"
  | "West Midlands"
  | "East of England"
  | "London"
  | "South East"
  | "South West"
  // Scotland
  | "Highlands & Islands"
  | "North East Scotland"
  | "Central Belt"
  | "South Scotland"
  // Wales
  | "North Wales"
  | "Mid Wales"
  | "South West Wales"
  | "South East Wales"
  // Northern Ireland
  | "Northern Ireland";

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

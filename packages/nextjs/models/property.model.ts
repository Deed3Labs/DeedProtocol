export interface PropertyModel {
  id: string;
  name: string;
  price: number;
  type: PropertyType;
  photos: string[];
  description: string;
  address: string;
  latitude: number;
  longitude: number;
}

export type ListingType = "Sale" | "Lease";
export type PropertyType = "Appartement" | "House" | "Condo" | "Bachelor" | "Land";

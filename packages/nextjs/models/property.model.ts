import { IMarker } from "./marker.model";

export interface PropertyModel extends IMarker {
  id: number;
  name: string;
  price: number;
  type: PropertyType;
  photos: string[];
  description: string;
  address: string;
}

export type ListingType = "Sale" | "Lease";
export type PropertyType = "Appartement" | "House" | "Condo" | "Bachelor" | "Land";

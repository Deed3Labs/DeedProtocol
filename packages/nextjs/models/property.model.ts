import { PropertyType } from "./deed-info.model";
import { MarkerModel } from "./marker.model";

export interface PropertyModel extends MarkerModel {
  id: string;
  price: number;
  type: PropertyType;
  pictures?: string[];
  address: string;
  validated?: boolean;
}

export type ListingType = "Sale" | "Lease";

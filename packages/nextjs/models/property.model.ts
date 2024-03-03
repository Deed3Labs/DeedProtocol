import { PropertyType } from "./deed-info.model";
import { IMarker } from "./marker.model";

export interface PropertyModel extends IMarker {
  id: number;
  price: number;
  type: PropertyType;
  pictures: string[];
  address: string;
}

export type ListingType = "Sale" | "Lease";

import { PropertyType } from "./deed-info.model";
import { IMarker } from "./marker.model";

export interface PropertyModel extends IMarker {
  id: string;
  price: number;
  type: PropertyType;
  pictures?: string[];
  address: string;
  validated?: boolean;
}

export type ListingType = "Sale" | "Lease";

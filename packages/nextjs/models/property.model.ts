import { PropertyType } from "./deed-info.model";
import { MarkerModel } from "./marker.model";
import { Address } from "viem";

export interface PropertyModel extends MarkerModel {
  id: string;
  price: number;
  type: PropertyType;
  pictures?: string[];
  address: string;
  validated?: boolean;
  owner: Address;
}

export type ListingType = "Sale" | "Lease";

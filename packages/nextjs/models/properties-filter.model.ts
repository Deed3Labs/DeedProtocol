import { PropertyType } from "./deed-info.model";
import { ListingType } from "./property.model";

export interface PropertiesFilterModel {
  propertyType?: PropertyType | "All";
  featured?: boolean;
  search?: string;
  listingType?: ListingType | "All";
  validated?: "true" | "false" | "all";
  propertySize?: string;
  ownerWallet?: string;
}

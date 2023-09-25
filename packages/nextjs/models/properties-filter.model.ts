import { ListingType, PropertyType } from "./property.model";

export type PropertiesFilterModel = {
  propertyType?: PropertyType | "All";
  featured?: boolean;
  search?: string;
  listingType?: ListingType | "All";
};

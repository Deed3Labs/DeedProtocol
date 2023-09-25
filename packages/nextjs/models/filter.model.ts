export type FilterModel = {
  propertyType?: string;
  featured?: boolean;
  search?: string;
  listingType?: ListingType;
};

export type ListingType = "sale" | "lease" | "all";

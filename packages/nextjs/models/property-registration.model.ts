import {
  BlockchainOptions,
  EntityTypeOptions,
  OwnerTypeOptions,
  PropertySubtypeOptions,
  PropertyTypeOptions,
  PropertyZoningOptions,
  StateOptions,
  WrapperOptions,
} from "~~/constants";
import { ValueExtractor } from "~~/utils/extract-values";

export interface OwnerInformationModel {
  ownerType: ValueExtractor<typeof OwnerTypeOptions>;

  ownerName: string;
  ownerSuffix?: string;

  // -- Coorporation only --
  entityName: string;
  ownerPosition: string;
  ownerState: ValueExtractor<typeof StateOptions>;
  ownerEntityType?: ValueExtractor<typeof EntityTypeOptions>;

  ids: File;
  proofBill?: File;
  articleIncorporation: File;
  operatingAgreement?: File;
  supportingDoc?: File[];
}

export interface PropertyDetailsModel {
  propertyType: ValueExtractor<typeof PropertyTypeOptions>;
  propertySubType?: ValueExtractor<typeof PropertySubtypeOptions>;
  propertyAddress: string;
  propertyCity: string;
  propertyState: ValueExtractor<typeof StateOptions>;
  propertySize?: string;
  propertyZoning?: ValueExtractor<typeof PropertyZoningOptions>;

  propertyImages?: File;
  propertyDeedOrTitle: File;
  propertyPurchaseContract?: File;
}

export interface OtherInformationModel {
  blockchain: ValueExtractor<typeof BlockchainOptions>;
  wrapper: ValueExtractor<typeof WrapperOptions>;
}

export interface PropertyRegistrationModel {
  // 1. Owner Information
  ownerInformation: OwnerInformationModel;

  // 2. Property Details
  propertyDetails: PropertyDetailsModel;

  // 3. Other information
  otherInformation: OtherInformationModel;
}

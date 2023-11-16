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

export default interface PropertyRegistrationModel {
  // 1. Owner Information
  ownerType: ValueExtractor<typeof OwnerTypeOptions>;

  ownerName: string;
  ownerSuffix?: string;

  // -- Coorporation only --
  entityName: string;
  ownerPosition: string;
  ownerState: ValueExtractor<typeof StateOptions>;
  ownerEntityType?: ValueExtractor<typeof EntityTypeOptions>;

  ids: File;
  proofBill: File;
  articleIncorporation: File;
  operatingAgreement: File;
  supportingDoc: File[];

  // 2. Property Details
  propertyType: ValueExtractor<typeof PropertyTypeOptions>;
  propertySubType: ValueExtractor<typeof PropertySubtypeOptions>;
  propertyAddress: string;
  propertyCity: string;
  propertyState: ValueExtractor<typeof StateOptions>;
  propertySize: string;
  propertyZoning?: ValueExtractor<typeof PropertyZoningOptions>;

  // 3. Other information
  blockchain: ValueExtractor<typeof BlockchainOptions>;
  wrapper: ValueExtractor<typeof WrapperOptions>;
}

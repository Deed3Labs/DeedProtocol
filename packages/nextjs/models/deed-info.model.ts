import { FileModel } from "./file.model";
import { Address } from "viem";
import {
  BlockchainOptions,
  EntityTypeOptions,
  OwnerTypeOptions,
  PaymentOptions,
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

  ids: FileModel;
  proofBill?: FileModel;
  articleIncorporation: FileModel;
  operatingAgreement?: FileModel;
  supportingDoc?: FileModel[];
}

export type PropertyType = ValueExtractor<typeof PropertyTypeOptions>;

export interface PropertyDetailsModel {
  propertyType: PropertyType;
  propertySubType?: ValueExtractor<typeof PropertySubtypeOptions>;
  propertyAddress: string;
  propertyCity: string;
  propertyState: ValueExtractor<typeof StateOptions>;
  propertySize?: string;
  propertyZoning?: ValueExtractor<typeof PropertyZoningOptions>;

  propertyImages?: FileModel[];
  propertyDeedOrTitle: FileModel;
  propertyPurchaseContract?: FileModel;
}

export interface OtherInformationModel {
  wrapper: ValueExtractor<typeof WrapperOptions>;
}

export interface PaymentInformationModel {
  paymentType: ValueExtractor<typeof PaymentOptions>;
  promoCode?: string;
  receipt?: string;

  // -- Fiat only --
  cardNumber?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardholderName?: string;
  suffix?: string;
  billingAddress?: string;
  city?: string;
  state?: string;
  zip?: string;

  // -- Crypto only --
  stableCoin?: Address;
}

export interface DeedInfoModel {
  id?: string;
  owner?: Address;
  isValidated?: boolean;
  timestamp?: number;

  // 1. Owner Information
  ownerInformation: OwnerInformationModel;

  // 2. Property Details
  propertyDetails: PropertyDetailsModel;

  // 3. Other Information
  otherInformation: OtherInformationModel;

  //4. Payment Information
  paymentInformation: PaymentInformationModel;
}
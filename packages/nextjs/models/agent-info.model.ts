import { FileModel } from "./file.model";
import { TokenModel } from "./token.model";
import { Address } from "viem";
import {
  AgentTypeOptions,
  EntityTypeOptions,
  OwnerTypeOptions,
  PaymentOptions,
  PropertySubtypeOptions,
  PropertyTypeOptions,
  PropertyZoningOptions,
  StateOptions,
  VehicleMakesAndModels,
  WrapperOptions,
} from "~~/constants";
import { ValueExtractor } from "~~/utils/extract-values";

export interface OwnerInformationModel {
  ownerType: ValueExtractor<typeof OwnerTypeOptions>;

  ownerName: string;
  ownerSuffix?: string;

  walletAddress: Address;

  // -- Corporation Only --
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
export type AgentType = ValueExtractor<typeof AgentTypeOptions>;

export interface PropertyDetailsModel {
  propertyDescription: string;
  propertyType: PropertyType;
  propertySubType?: ValueExtractor<typeof PropertySubtypeOptions>;
  propertyAddress: string;
  propertyCity: string;
  propertyState: ValueExtractor<typeof StateOptions>;
  propertySize?: string;
  propertyZoning?: ValueExtractor<typeof PropertyZoningOptions>;
  propertyBedrooms?: string;
  propertyBathrooms?: string;
  propertyBuildYear?: string;
  propertyHouseType?: string;
  propertySquareFootage?: string;
  propertyLatitude?: number;
  propertyLongitude?: number;

  // -- Vehicles Only --
  vehicleIdentificationNumber: string;
  currentMileage: string;
  yearOfManufacture: string;
  vehicleMake: keyof typeof VehicleMakesAndModels;
  vehicleModel: string;

  propertyImages?: FileModel[];
  propertyDeedOrTitle: FileModel;
  propertyPurchaseContract?: FileModel;

  stateFillings?: FileModel[];
}

export interface OtherInformationModel {
  wrapper: ValueExtractor<ReturnType<typeof WrapperOptions>>;
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
  stableCoin?: TokenModel;
}

export interface DeedDetailsModel {
  deedType: string;
  parcelNumber: string;
  taxAssessedValue: string;
}

export interface DeedInfoModel {
  id?: string;
  mintedId?: number;
  isValidated?: boolean;
  timestamp?: number;

  // 1. Owner Information
  ownerInformation: OwnerInformationModel;

  // 2. Property Details
  propertyDetails: PropertyDetailsModel;

  // 3. Other Information
  otherInformation: OtherInformationModel;

  // 4. Payment Information
  paymentInformation: PaymentInformationModel;

  // 5. Deed info
  deedDetails: DeedDetailsModel;

  process?: FileModel[];
  agreement?: FileModel[];
  documentNotorization?: FileModel[];

  signatureTx?: string;
}

export interface OpenSeaMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: { trait_type: string; value: string }[];
}

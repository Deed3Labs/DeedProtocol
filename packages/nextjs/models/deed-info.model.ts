import { FileFieldKeyLabel, FileModel, FileValidationState } from "./file.model";
import { Address } from "viem";
import {
  EntityTypeOptions,
  OwnerTypeOptions,
  PaymentOptions,
  PropertySubtypeOptions,
  PropertyTypeOptions,
  PropertyZoningOptions,
  StateOptions,
  WrapperOptions,
  VehicleMakeOptions,
  getVehicleModelsOptions,
} from "~~/constants";
import { ValueExtractor } from "~~/utils/extract-values";

export interface OwnerInformationModel {
  ownerType: ValueExtractor<typeof OwnerTypeOptions>;

  ownerName: string;
  ownerSuffix?: string;

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

export interface PropertyDetailsModel {
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

  // -- Vehicles Only --
  vehicleIdentificationNumber: string;
  currentMileage: string;
  yearOfManufacture: string;
  vehicleMake: ValueExtractor<typeof VehicleMakeOptions>;
  vehicleModel: ValueExtractor<typeof VehicleModelsOptions>;

  propertyImages?: FileModel[];
  propertyDeedOrTitle: FileModel;
  propertyPurchaseContract?: FileModel;

  stateFillings?: FileModel[];
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

  process?: FileModel[];
  agreement?: FileModel[];
  documentNotorization?: FileModel[];

  validations?: [string, FileValidationState][];
  signatureTx?: string;
}

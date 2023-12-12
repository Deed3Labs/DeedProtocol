import { IpfsFileModel } from "./ipfs-file.model";
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
  SupportedStableCoin,
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

  ids: IpfsFileModel;
  proofBill?: IpfsFileModel;
  articleIncorporation: IpfsFileModel;
  operatingAgreement?: IpfsFileModel;
  supportingDoc?: IpfsFileModel[];
}

export interface PropertyDetailsModel {
  propertyType: ValueExtractor<typeof PropertyTypeOptions>;
  propertySubType?: ValueExtractor<typeof PropertySubtypeOptions>;
  propertyAddress: string;
  propertyCity: string;
  propertyState: ValueExtractor<typeof StateOptions>;
  propertySize?: string;
  propertyZoning?: ValueExtractor<typeof PropertyZoningOptions>;

  propertyImages?: IpfsFileModel[];
  propertyDeedOrTitle: IpfsFileModel;
  propertyPurchaseContract?: IpfsFileModel;
}

export interface OtherInformationModel {
  blockchain: ValueExtractor<typeof BlockchainOptions>;
  wrapper: ValueExtractor<typeof WrapperOptions>;
}

export interface PaymentInformationModel {
  paymentType: ValueExtractor<typeof PaymentOptions>;

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
  stabeleCoin?: ValueExtractor<typeof SupportedStableCoin>;
  receipt?: string;
}

export interface DeedInfoModel {
  id?: number;
  owner?: Address;
  isValidated?: boolean;

  // 1. Owner Information
  ownerInformation: OwnerInformationModel;

  // 2. Property Details
  propertyDetails: PropertyDetailsModel;

  // 3. Other Information
  otherInformation: OtherInformationModel;

  //4. Payment Information
  paymentInformation: PaymentInformationModel;
}

// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace Deed3SepoliaTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type Approval = {
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  approved: Scalars['Bytes'];
  tokenId: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type ApprovalForAll = {
  id: Scalars['Bytes'];
  owner: Scalars['Bytes'];
  operator: Scalars['Bytes'];
  approved: Scalars['Boolean'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type ApprovalForAll_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  operator?: InputMaybe<Scalars['Bytes']>;
  operator_not?: InputMaybe<Scalars['Bytes']>;
  operator_gt?: InputMaybe<Scalars['Bytes']>;
  operator_lt?: InputMaybe<Scalars['Bytes']>;
  operator_gte?: InputMaybe<Scalars['Bytes']>;
  operator_lte?: InputMaybe<Scalars['Bytes']>;
  operator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  operator_contains?: InputMaybe<Scalars['Bytes']>;
  operator_not_contains?: InputMaybe<Scalars['Bytes']>;
  approved?: InputMaybe<Scalars['Boolean']>;
  approved_not?: InputMaybe<Scalars['Boolean']>;
  approved_in?: InputMaybe<Array<Scalars['Boolean']>>;
  approved_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ApprovalForAll_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ApprovalForAll_filter>>>;
};

export type ApprovalForAll_orderBy =
  | 'id'
  | 'owner'
  | 'operator'
  | 'approved'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Approval_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  approved?: InputMaybe<Scalars['Bytes']>;
  approved_not?: InputMaybe<Scalars['Bytes']>;
  approved_gt?: InputMaybe<Scalars['Bytes']>;
  approved_lt?: InputMaybe<Scalars['Bytes']>;
  approved_gte?: InputMaybe<Scalars['Bytes']>;
  approved_lte?: InputMaybe<Scalars['Bytes']>;
  approved_in?: InputMaybe<Array<Scalars['Bytes']>>;
  approved_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  approved_contains?: InputMaybe<Scalars['Bytes']>;
  approved_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenId?: InputMaybe<Scalars['BigInt']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Approval_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Approval_filter>>>;
};

export type Approval_orderBy =
  | 'id'
  | 'owner'
  | 'approved'
  | 'tokenId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type DeedEntity = {
  id: Scalars['ID'];
  deedId: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  assetType: Scalars['Int'];
  isValidated: Scalars['Boolean'];
  minter: Scalars['Bytes'];
  uri: Scalars['String'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
  deedMetadata: DeedMetadata;
};

export type DeedEntity_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  deedId?: InputMaybe<Scalars['BigInt']>;
  deedId_not?: InputMaybe<Scalars['BigInt']>;
  deedId_gt?: InputMaybe<Scalars['BigInt']>;
  deedId_lt?: InputMaybe<Scalars['BigInt']>;
  deedId_gte?: InputMaybe<Scalars['BigInt']>;
  deedId_lte?: InputMaybe<Scalars['BigInt']>;
  deedId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  deedId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  assetType?: InputMaybe<Scalars['Int']>;
  assetType_not?: InputMaybe<Scalars['Int']>;
  assetType_gt?: InputMaybe<Scalars['Int']>;
  assetType_lt?: InputMaybe<Scalars['Int']>;
  assetType_gte?: InputMaybe<Scalars['Int']>;
  assetType_lte?: InputMaybe<Scalars['Int']>;
  assetType_in?: InputMaybe<Array<Scalars['Int']>>;
  assetType_not_in?: InputMaybe<Array<Scalars['Int']>>;
  isValidated?: InputMaybe<Scalars['Boolean']>;
  isValidated_not?: InputMaybe<Scalars['Boolean']>;
  isValidated_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isValidated_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  minter?: InputMaybe<Scalars['Bytes']>;
  minter_not?: InputMaybe<Scalars['Bytes']>;
  minter_gt?: InputMaybe<Scalars['Bytes']>;
  minter_lt?: InputMaybe<Scalars['Bytes']>;
  minter_gte?: InputMaybe<Scalars['Bytes']>;
  minter_lte?: InputMaybe<Scalars['Bytes']>;
  minter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  minter_contains?: InputMaybe<Scalars['Bytes']>;
  minter_not_contains?: InputMaybe<Scalars['Bytes']>;
  uri?: InputMaybe<Scalars['String']>;
  uri_not?: InputMaybe<Scalars['String']>;
  uri_gt?: InputMaybe<Scalars['String']>;
  uri_lt?: InputMaybe<Scalars['String']>;
  uri_gte?: InputMaybe<Scalars['String']>;
  uri_lte?: InputMaybe<Scalars['String']>;
  uri_in?: InputMaybe<Array<Scalars['String']>>;
  uri_not_in?: InputMaybe<Array<Scalars['String']>>;
  uri_contains?: InputMaybe<Scalars['String']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']>;
  uri_not_contains?: InputMaybe<Scalars['String']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']>;
  uri_starts_with?: InputMaybe<Scalars['String']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']>;
  uri_not_starts_with?: InputMaybe<Scalars['String']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  uri_ends_with?: InputMaybe<Scalars['String']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  deedMetadata?: InputMaybe<Scalars['String']>;
  deedMetadata_not?: InputMaybe<Scalars['String']>;
  deedMetadata_gt?: InputMaybe<Scalars['String']>;
  deedMetadata_lt?: InputMaybe<Scalars['String']>;
  deedMetadata_gte?: InputMaybe<Scalars['String']>;
  deedMetadata_lte?: InputMaybe<Scalars['String']>;
  deedMetadata_in?: InputMaybe<Array<Scalars['String']>>;
  deedMetadata_not_in?: InputMaybe<Array<Scalars['String']>>;
  deedMetadata_contains?: InputMaybe<Scalars['String']>;
  deedMetadata_contains_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_not_contains?: InputMaybe<Scalars['String']>;
  deedMetadata_not_contains_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_starts_with?: InputMaybe<Scalars['String']>;
  deedMetadata_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_not_starts_with?: InputMaybe<Scalars['String']>;
  deedMetadata_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_ends_with?: InputMaybe<Scalars['String']>;
  deedMetadata_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_not_ends_with?: InputMaybe<Scalars['String']>;
  deedMetadata_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  deedMetadata_?: InputMaybe<DeedMetadata_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DeedEntity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DeedEntity_filter>>>;
};

export type DeedEntity_orderBy =
  | 'id'
  | 'deedId'
  | 'owner'
  | 'assetType'
  | 'isValidated'
  | 'minter'
  | 'uri'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'deedMetadata'
  | 'deedMetadata__id'
  | 'deedMetadata__ownerInformation_type'
  | 'deedMetadata__ownerInformation_name'
  | 'deedMetadata__ownerInformation_position'
  | 'deedMetadata__ownerInformation_entityName'
  | 'deedMetadata__ownerInformation_entityType'
  | 'deedMetadata__propertyDetails_type'
  | 'deedMetadata__propertyDetails_address'
  | 'deedMetadata__propertyDetails_city'
  | 'deedMetadata__propertyDetails_state'
  | 'deedMetadata__propertyDetails_size'
  | 'deedMetadata__propertyDetails_subType'
  | 'deedMetadata__propertyDetails_zoning'
  | 'deedMetadata__otherInformation_blockchain'
  | 'deedMetadata__otherInformation_wrapper';

export type DeedMetadata = {
  id: Scalars['ID'];
  ownerInformation_type: Scalars['String'];
  ownerInformation_name: Scalars['String'];
  ownerInformation_position?: Maybe<Scalars['String']>;
  ownerInformation_entityName?: Maybe<Scalars['String']>;
  ownerInformation_entityType?: Maybe<Scalars['String']>;
  ownerInformation_ids: FileInfo;
  ownerInformation_operatingAgreement?: Maybe<FileInfo>;
  ownerInformation_articleIncorporation: FileInfo;
  ownerInformation_proofBill?: Maybe<FileInfo>;
  ownerInformation_supportingDoc?: Maybe<Array<FileInfo>>;
  propertyDetails_type: Scalars['String'];
  propertyDetails_address: Scalars['String'];
  propertyDetails_city: Scalars['String'];
  propertyDetails_state: Scalars['String'];
  propertyDetails_size?: Maybe<Scalars['String']>;
  propertyDetails_subType?: Maybe<Scalars['String']>;
  propertyDetails_zoning?: Maybe<Scalars['String']>;
  propertyDetails_purchaseContract?: Maybe<FileInfo>;
  propertyDetails_deedOrTitle: FileInfo;
  propertyDetails_images?: Maybe<Array<FileInfo>>;
  otherInformation_blockchain: Scalars['String'];
  otherInformation_wrapper: Scalars['String'];
};


export type DeedMetadataownerInformation_supportingDocArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
};


export type DeedMetadatapropertyDetails_imagesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
};

export type DeedMetadata_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  ownerInformation_type?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not?: InputMaybe<Scalars['String']>;
  ownerInformation_type_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_type_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_type_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_type_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_type_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_type_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_type_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_type_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_type_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_type_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not?: InputMaybe<Scalars['String']>;
  ownerInformation_name_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_name_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_name_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_name_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_name_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_name_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_name_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_name_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not?: InputMaybe<Scalars['String']>;
  ownerInformation_position_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_position_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_position_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_position_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_position_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_position_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_position_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_position_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_position_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_position_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_position_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_entityName_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_entityName_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityName_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_entityType_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_entityType_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_entityType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_ids_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_ids_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_ids_?: InputMaybe<FileInfo_filter>;
  ownerInformation_operatingAgreement?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_operatingAgreement_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_operatingAgreement_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_operatingAgreement_?: InputMaybe<FileInfo_filter>;
  ownerInformation_articleIncorporation?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_articleIncorporation_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_articleIncorporation_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_articleIncorporation_?: InputMaybe<FileInfo_filter>;
  ownerInformation_proofBill?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_gt?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_lt?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_gte?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_lte?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_proofBill_not_in?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_proofBill_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_contains?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_contains_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_starts_with?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_ends_with?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  ownerInformation_proofBill_?: InputMaybe<FileInfo_filter>;
  ownerInformation_supportingDoc?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_not?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_contains?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_not_contains?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  ownerInformation_supportingDoc_?: InputMaybe<FileInfo_filter>;
  propertyDetails_type?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not?: InputMaybe<Scalars['String']>;
  propertyDetails_type_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_type_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_type_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_type_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_type_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_type_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_type_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_type_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_type_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_type_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not?: InputMaybe<Scalars['String']>;
  propertyDetails_address_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_address_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_address_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_address_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_address_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_address_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_address_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_address_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_address_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_address_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_address_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not?: InputMaybe<Scalars['String']>;
  propertyDetails_city_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_city_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_city_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_city_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_city_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_city_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_city_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_city_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_city_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_city_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_city_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not?: InputMaybe<Scalars['String']>;
  propertyDetails_state_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_state_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_state_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_state_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_state_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_state_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_state_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_state_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_state_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_state_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_state_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not?: InputMaybe<Scalars['String']>;
  propertyDetails_size_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_size_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_size_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_size_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_size_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_size_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_size_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_size_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_size_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_size_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_size_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_subType_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_subType_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_subType_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_zoning_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_zoning_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_zoning_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_purchaseContract_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_purchaseContract_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_purchaseContract_?: InputMaybe<FileInfo_filter>;
  propertyDetails_deedOrTitle?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_gt?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_lt?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_gte?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_lte?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_deedOrTitle_not_in?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_deedOrTitle_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_contains?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_contains_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_starts_with?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_ends_with?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  propertyDetails_deedOrTitle_?: InputMaybe<FileInfo_filter>;
  propertyDetails_images?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_not?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_contains?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_not_contains?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  propertyDetails_images_?: InputMaybe<FileInfo_filter>;
  otherInformation_blockchain?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_gt?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_lt?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_gte?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_lte?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_in?: InputMaybe<Array<Scalars['String']>>;
  otherInformation_blockchain_not_in?: InputMaybe<Array<Scalars['String']>>;
  otherInformation_blockchain_contains?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_contains_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_contains?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_contains_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_starts_with?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_starts_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_starts_with?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_ends_with?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_ends_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_ends_with?: InputMaybe<Scalars['String']>;
  otherInformation_blockchain_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_gt?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_lt?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_gte?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_lte?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_in?: InputMaybe<Array<Scalars['String']>>;
  otherInformation_wrapper_not_in?: InputMaybe<Array<Scalars['String']>>;
  otherInformation_wrapper_contains?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_contains_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_contains?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_contains_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_starts_with?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_starts_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_starts_with?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_ends_with?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_ends_with_nocase?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_ends_with?: InputMaybe<Scalars['String']>;
  otherInformation_wrapper_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DeedMetadata_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DeedMetadata_filter>>>;
};

export type DeedMetadata_orderBy =
  | 'id'
  | 'ownerInformation_type'
  | 'ownerInformation_name'
  | 'ownerInformation_position'
  | 'ownerInformation_entityName'
  | 'ownerInformation_entityType'
  | 'ownerInformation_ids'
  | 'ownerInformation_ids__id'
  | 'ownerInformation_ids__name'
  | 'ownerInformation_ids__size'
  | 'ownerInformation_ids__type'
  | 'ownerInformation_ids__timestamp'
  | 'ownerInformation_operatingAgreement'
  | 'ownerInformation_operatingAgreement__id'
  | 'ownerInformation_operatingAgreement__name'
  | 'ownerInformation_operatingAgreement__size'
  | 'ownerInformation_operatingAgreement__type'
  | 'ownerInformation_operatingAgreement__timestamp'
  | 'ownerInformation_articleIncorporation'
  | 'ownerInformation_articleIncorporation__id'
  | 'ownerInformation_articleIncorporation__name'
  | 'ownerInformation_articleIncorporation__size'
  | 'ownerInformation_articleIncorporation__type'
  | 'ownerInformation_articleIncorporation__timestamp'
  | 'ownerInformation_proofBill'
  | 'ownerInformation_proofBill__id'
  | 'ownerInformation_proofBill__name'
  | 'ownerInformation_proofBill__size'
  | 'ownerInformation_proofBill__type'
  | 'ownerInformation_proofBill__timestamp'
  | 'ownerInformation_supportingDoc'
  | 'propertyDetails_type'
  | 'propertyDetails_address'
  | 'propertyDetails_city'
  | 'propertyDetails_state'
  | 'propertyDetails_size'
  | 'propertyDetails_subType'
  | 'propertyDetails_zoning'
  | 'propertyDetails_purchaseContract'
  | 'propertyDetails_purchaseContract__id'
  | 'propertyDetails_purchaseContract__name'
  | 'propertyDetails_purchaseContract__size'
  | 'propertyDetails_purchaseContract__type'
  | 'propertyDetails_purchaseContract__timestamp'
  | 'propertyDetails_deedOrTitle'
  | 'propertyDetails_deedOrTitle__id'
  | 'propertyDetails_deedOrTitle__name'
  | 'propertyDetails_deedOrTitle__size'
  | 'propertyDetails_deedOrTitle__type'
  | 'propertyDetails_deedOrTitle__timestamp'
  | 'propertyDetails_images'
  | 'otherInformation_blockchain'
  | 'otherInformation_wrapper';

export type FileInfo = {
  id: Scalars['ID'];
  name: Scalars['String'];
  size: Scalars['BigInt'];
  type: Scalars['String'];
  timestamp: Scalars['String'];
};

export type FileInfo_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['BigInt']>;
  size_not?: InputMaybe<Scalars['BigInt']>;
  size_gt?: InputMaybe<Scalars['BigInt']>;
  size_lt?: InputMaybe<Scalars['BigInt']>;
  size_gte?: InputMaybe<Scalars['BigInt']>;
  size_lte?: InputMaybe<Scalars['BigInt']>;
  size_in?: InputMaybe<Array<Scalars['BigInt']>>;
  size_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<Scalars['String']>;
  type_not?: InputMaybe<Scalars['String']>;
  type_gt?: InputMaybe<Scalars['String']>;
  type_lt?: InputMaybe<Scalars['String']>;
  type_gte?: InputMaybe<Scalars['String']>;
  type_lte?: InputMaybe<Scalars['String']>;
  type_in?: InputMaybe<Array<Scalars['String']>>;
  type_not_in?: InputMaybe<Array<Scalars['String']>>;
  type_contains?: InputMaybe<Scalars['String']>;
  type_contains_nocase?: InputMaybe<Scalars['String']>;
  type_not_contains?: InputMaybe<Scalars['String']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']>;
  type_starts_with?: InputMaybe<Scalars['String']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_starts_with?: InputMaybe<Scalars['String']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  type_ends_with?: InputMaybe<Scalars['String']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']>;
  type_not_ends_with?: InputMaybe<Scalars['String']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['String']>;
  timestamp_not?: InputMaybe<Scalars['String']>;
  timestamp_gt?: InputMaybe<Scalars['String']>;
  timestamp_lt?: InputMaybe<Scalars['String']>;
  timestamp_gte?: InputMaybe<Scalars['String']>;
  timestamp_lte?: InputMaybe<Scalars['String']>;
  timestamp_in?: InputMaybe<Array<Scalars['String']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['String']>>;
  timestamp_contains?: InputMaybe<Scalars['String']>;
  timestamp_contains_nocase?: InputMaybe<Scalars['String']>;
  timestamp_not_contains?: InputMaybe<Scalars['String']>;
  timestamp_not_contains_nocase?: InputMaybe<Scalars['String']>;
  timestamp_starts_with?: InputMaybe<Scalars['String']>;
  timestamp_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_not_starts_with?: InputMaybe<Scalars['String']>;
  timestamp_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_ends_with?: InputMaybe<Scalars['String']>;
  timestamp_ends_with_nocase?: InputMaybe<Scalars['String']>;
  timestamp_not_ends_with?: InputMaybe<Scalars['String']>;
  timestamp_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FileInfo_filter>>>;
  or?: InputMaybe<Array<InputMaybe<FileInfo_filter>>>;
};

export type FileInfo_orderBy =
  | 'id'
  | 'name'
  | 'size'
  | 'type'
  | 'timestamp';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  deedEntity?: Maybe<DeedEntity>;
  deedEntities: Array<DeedEntity>;
  deedMetadata?: Maybe<DeedMetadata>;
  deedMetadata_collection: Array<DeedMetadata>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  approval?: Maybe<Approval>;
  approvals: Array<Approval>;
  approvalForAll?: Maybe<ApprovalForAll>;
  approvalForAlls: Array<ApprovalForAll>;
  fileInfo?: Maybe<FileInfo>;
  fileInfos: Array<FileInfo>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerydeedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydeedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydeedMetadataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerydeedMetadata_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeedMetadata_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedMetadata_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryapprovalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryapprovalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Approval_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Approval_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryapprovalForAllArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryapprovalForAllsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApprovalForAll_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ApprovalForAll_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfileInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryfileInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  deedEntity?: Maybe<DeedEntity>;
  deedEntities: Array<DeedEntity>;
  deedMetadata?: Maybe<DeedMetadata>;
  deedMetadata_collection: Array<DeedMetadata>;
  transfer?: Maybe<Transfer>;
  transfers: Array<Transfer>;
  approval?: Maybe<Approval>;
  approvals: Array<Approval>;
  approvalForAll?: Maybe<ApprovalForAll>;
  approvalForAlls: Array<ApprovalForAll>;
  fileInfo?: Maybe<FileInfo>;
  fileInfos: Array<FileInfo>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptiondeedEntityArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondeedEntitiesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondeedMetadataArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiondeedMetadata_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DeedMetadata_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedMetadata_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontransfersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionapprovalArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionapprovalsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Approval_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Approval_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionapprovalForAllArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionapprovalForAllsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ApprovalForAll_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ApprovalForAll_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfileInfoArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionfileInfosArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Transfer = {
  id: Scalars['Bytes'];
  from: Scalars['Bytes'];
  to: Scalars['Bytes'];
  tokenId: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Transfer_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_gt?: InputMaybe<Scalars['Bytes']>;
  from_lt?: InputMaybe<Scalars['Bytes']>;
  from_gte?: InputMaybe<Scalars['Bytes']>;
  from_lte?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_gt?: InputMaybe<Scalars['Bytes']>;
  to_lt?: InputMaybe<Scalars['Bytes']>;
  to_gte?: InputMaybe<Scalars['Bytes']>;
  to_lte?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  tokenId?: InputMaybe<Scalars['BigInt']>;
  tokenId_not?: InputMaybe<Scalars['BigInt']>;
  tokenId_gt?: InputMaybe<Scalars['BigInt']>;
  tokenId_lt?: InputMaybe<Scalars['BigInt']>;
  tokenId_gte?: InputMaybe<Scalars['BigInt']>;
  tokenId_lte?: InputMaybe<Scalars['BigInt']>;
  tokenId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
};

export type Transfer_orderBy =
  | 'id'
  | 'from'
  | 'to'
  | 'tokenId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  deedEntity: InContextSdkMethod<Query['deedEntity'], QuerydeedEntityArgs, MeshContext>,
  /** null **/
  deedEntities: InContextSdkMethod<Query['deedEntities'], QuerydeedEntitiesArgs, MeshContext>,
  /** null **/
  deedMetadata: InContextSdkMethod<Query['deedMetadata'], QuerydeedMetadataArgs, MeshContext>,
  /** null **/
  deedMetadata_collection: InContextSdkMethod<Query['deedMetadata_collection'], QuerydeedMetadata_collectionArgs, MeshContext>,
  /** null **/
  transfer: InContextSdkMethod<Query['transfer'], QuerytransferArgs, MeshContext>,
  /** null **/
  transfers: InContextSdkMethod<Query['transfers'], QuerytransfersArgs, MeshContext>,
  /** null **/
  approval: InContextSdkMethod<Query['approval'], QueryapprovalArgs, MeshContext>,
  /** null **/
  approvals: InContextSdkMethod<Query['approvals'], QueryapprovalsArgs, MeshContext>,
  /** null **/
  approvalForAll: InContextSdkMethod<Query['approvalForAll'], QueryapprovalForAllArgs, MeshContext>,
  /** null **/
  approvalForAlls: InContextSdkMethod<Query['approvalForAlls'], QueryapprovalForAllsArgs, MeshContext>,
  /** null **/
  fileInfo: InContextSdkMethod<Query['fileInfo'], QueryfileInfoArgs, MeshContext>,
  /** null **/
  fileInfos: InContextSdkMethod<Query['fileInfos'], QueryfileInfosArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  deedEntity: InContextSdkMethod<Subscription['deedEntity'], SubscriptiondeedEntityArgs, MeshContext>,
  /** null **/
  deedEntities: InContextSdkMethod<Subscription['deedEntities'], SubscriptiondeedEntitiesArgs, MeshContext>,
  /** null **/
  deedMetadata: InContextSdkMethod<Subscription['deedMetadata'], SubscriptiondeedMetadataArgs, MeshContext>,
  /** null **/
  deedMetadata_collection: InContextSdkMethod<Subscription['deedMetadata_collection'], SubscriptiondeedMetadata_collectionArgs, MeshContext>,
  /** null **/
  transfer: InContextSdkMethod<Subscription['transfer'], SubscriptiontransferArgs, MeshContext>,
  /** null **/
  transfers: InContextSdkMethod<Subscription['transfers'], SubscriptiontransfersArgs, MeshContext>,
  /** null **/
  approval: InContextSdkMethod<Subscription['approval'], SubscriptionapprovalArgs, MeshContext>,
  /** null **/
  approvals: InContextSdkMethod<Subscription['approvals'], SubscriptionapprovalsArgs, MeshContext>,
  /** null **/
  approvalForAll: InContextSdkMethod<Subscription['approvalForAll'], SubscriptionapprovalForAllArgs, MeshContext>,
  /** null **/
  approvalForAlls: InContextSdkMethod<Subscription['approvalForAlls'], SubscriptionapprovalForAllsArgs, MeshContext>,
  /** null **/
  fileInfo: InContextSdkMethod<Subscription['fileInfo'], SubscriptionfileInfoArgs, MeshContext>,
  /** null **/
  fileInfos: InContextSdkMethod<Subscription['fileInfos'], SubscriptionfileInfosArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["Deed3-Sepolia"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}

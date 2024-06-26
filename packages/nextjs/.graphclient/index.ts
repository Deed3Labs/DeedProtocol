// @ts-nocheck
import * as importedModule$0 from "./sources/Deed3-Sepolia/introspectionSchema";
import type { Deed3SepoliaTypes } from "./sources/Deed3-Sepolia/types";
import MeshCache from "@graphql-mesh/cache-localforage";
import { path as pathModule } from "@graphql-mesh/cross-helpers";
import GraphqlHandler from "@graphql-mesh/graphql";
import { MeshHTTPHandler, createMeshHTTPHandler } from "@graphql-mesh/http";
import BareMerger from "@graphql-mesh/merger-bare";
import type { GetMeshOptions } from "@graphql-mesh/runtime";
import { MeshResolvedSource } from "@graphql-mesh/runtime";
import {
  MeshContext as BaseMeshContext,
  ExecuteMeshFn,
  MeshInstance,
  SubscribeMeshFn,
  getMesh,
} from "@graphql-mesh/runtime";
import { FsStoreStorageAdapter, MeshStore } from "@graphql-mesh/store";
import type { YamlConfig } from "@graphql-mesh/types";
import { MeshPlugin, MeshTransform } from "@graphql-mesh/types";
import { ImportFn } from "@graphql-mesh/types";
import { PubSub } from "@graphql-mesh/utils";
import { DefaultLogger } from "@graphql-mesh/utils";
import { fileURLToPath } from "@graphql-mesh/utils";
import { fetch as fetchFn } from "@whatwg-node/fetch";
import {
  FieldNode,
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
  SelectionSetNode,
} from "graphql";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

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

export type Aggregation_interval = "hour" | "day";

export type Approval = {
  id: Scalars["Bytes"];
  owner: Scalars["Bytes"];
  approved: Scalars["Bytes"];
  tokenId: Scalars["BigInt"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
};

export type ApprovalForAll = {
  id: Scalars["Bytes"];
  owner: Scalars["Bytes"];
  operator: Scalars["Bytes"];
  approved: Scalars["Boolean"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
};

export type ApprovalForAll_filter = {
  id?: InputMaybe<Scalars["Bytes"]>;
  id_not?: InputMaybe<Scalars["Bytes"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]>;
  id_lt?: InputMaybe<Scalars["Bytes"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_contains?: InputMaybe<Scalars["Bytes"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]>;
  owner_lt?: InputMaybe<Scalars["Bytes"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  operator?: InputMaybe<Scalars["Bytes"]>;
  operator_not?: InputMaybe<Scalars["Bytes"]>;
  operator_gt?: InputMaybe<Scalars["Bytes"]>;
  operator_lt?: InputMaybe<Scalars["Bytes"]>;
  operator_gte?: InputMaybe<Scalars["Bytes"]>;
  operator_lte?: InputMaybe<Scalars["Bytes"]>;
  operator_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  operator_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  operator_contains?: InputMaybe<Scalars["Bytes"]>;
  operator_not_contains?: InputMaybe<Scalars["Bytes"]>;
  approved?: InputMaybe<Scalars["Boolean"]>;
  approved_not?: InputMaybe<Scalars["Boolean"]>;
  approved_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  approved_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ApprovalForAll_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ApprovalForAll_filter>>>;
};

export type ApprovalForAll_orderBy =
  | "id"
  | "owner"
  | "operator"
  | "approved"
  | "blockNumber"
  | "blockTimestamp"
  | "transactionHash";

export type Approval_filter = {
  id?: InputMaybe<Scalars["Bytes"]>;
  id_not?: InputMaybe<Scalars["Bytes"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]>;
  id_lt?: InputMaybe<Scalars["Bytes"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_contains?: InputMaybe<Scalars["Bytes"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]>;
  owner_lt?: InputMaybe<Scalars["Bytes"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  approved?: InputMaybe<Scalars["Bytes"]>;
  approved_not?: InputMaybe<Scalars["Bytes"]>;
  approved_gt?: InputMaybe<Scalars["Bytes"]>;
  approved_lt?: InputMaybe<Scalars["Bytes"]>;
  approved_gte?: InputMaybe<Scalars["Bytes"]>;
  approved_lte?: InputMaybe<Scalars["Bytes"]>;
  approved_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  approved_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  approved_contains?: InputMaybe<Scalars["Bytes"]>;
  approved_not_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenId?: InputMaybe<Scalars["BigInt"]>;
  tokenId_not?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_lt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_lte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Approval_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Approval_filter>>>;
};

export type Approval_orderBy =
  | "id"
  | "owner"
  | "approved"
  | "tokenId"
  | "blockNumber"
  | "blockTimestamp"
  | "transactionHash";

export type BlockChangedFilter = {
  number_gte: Scalars["Int"];
};

export type Block_height = {
  hash?: InputMaybe<Scalars["Bytes"]>;
  number?: InputMaybe<Scalars["Int"]>;
  number_gte?: InputMaybe<Scalars["Int"]>;
};

export type DeedEntity = {
  id: Scalars["ID"];
  deedId: Scalars["BigInt"];
  owner: Scalars["Bytes"];
  assetType: Scalars["Int"];
  isValidated: Scalars["Boolean"];
  minter: Scalars["Bytes"];
  uri: Scalars["String"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
  deedMetadata: DeedMetadata;
};

export type DeedEntity_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  deedId?: InputMaybe<Scalars["BigInt"]>;
  deedId_not?: InputMaybe<Scalars["BigInt"]>;
  deedId_gt?: InputMaybe<Scalars["BigInt"]>;
  deedId_lt?: InputMaybe<Scalars["BigInt"]>;
  deedId_gte?: InputMaybe<Scalars["BigInt"]>;
  deedId_lte?: InputMaybe<Scalars["BigInt"]>;
  deedId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  deedId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  owner?: InputMaybe<Scalars["Bytes"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]>;
  owner_lt?: InputMaybe<Scalars["Bytes"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  owner_contains?: InputMaybe<Scalars["Bytes"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]>;
  assetType?: InputMaybe<Scalars["Int"]>;
  assetType_not?: InputMaybe<Scalars["Int"]>;
  assetType_gt?: InputMaybe<Scalars["Int"]>;
  assetType_lt?: InputMaybe<Scalars["Int"]>;
  assetType_gte?: InputMaybe<Scalars["Int"]>;
  assetType_lte?: InputMaybe<Scalars["Int"]>;
  assetType_in?: InputMaybe<Array<Scalars["Int"]>>;
  assetType_not_in?: InputMaybe<Array<Scalars["Int"]>>;
  isValidated?: InputMaybe<Scalars["Boolean"]>;
  isValidated_not?: InputMaybe<Scalars["Boolean"]>;
  isValidated_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  isValidated_not_in?: InputMaybe<Array<Scalars["Boolean"]>>;
  minter?: InputMaybe<Scalars["Bytes"]>;
  minter_not?: InputMaybe<Scalars["Bytes"]>;
  minter_gt?: InputMaybe<Scalars["Bytes"]>;
  minter_lt?: InputMaybe<Scalars["Bytes"]>;
  minter_gte?: InputMaybe<Scalars["Bytes"]>;
  minter_lte?: InputMaybe<Scalars["Bytes"]>;
  minter_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  minter_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  minter_contains?: InputMaybe<Scalars["Bytes"]>;
  minter_not_contains?: InputMaybe<Scalars["Bytes"]>;
  uri?: InputMaybe<Scalars["String"]>;
  uri_not?: InputMaybe<Scalars["String"]>;
  uri_gt?: InputMaybe<Scalars["String"]>;
  uri_lt?: InputMaybe<Scalars["String"]>;
  uri_gte?: InputMaybe<Scalars["String"]>;
  uri_lte?: InputMaybe<Scalars["String"]>;
  uri_in?: InputMaybe<Array<Scalars["String"]>>;
  uri_not_in?: InputMaybe<Array<Scalars["String"]>>;
  uri_contains?: InputMaybe<Scalars["String"]>;
  uri_contains_nocase?: InputMaybe<Scalars["String"]>;
  uri_not_contains?: InputMaybe<Scalars["String"]>;
  uri_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  uri_starts_with?: InputMaybe<Scalars["String"]>;
  uri_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uri_not_starts_with?: InputMaybe<Scalars["String"]>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  uri_ends_with?: InputMaybe<Scalars["String"]>;
  uri_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  uri_not_ends_with?: InputMaybe<Scalars["String"]>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  blockNumber?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
  deedMetadata?: InputMaybe<Scalars["String"]>;
  deedMetadata_not?: InputMaybe<Scalars["String"]>;
  deedMetadata_gt?: InputMaybe<Scalars["String"]>;
  deedMetadata_lt?: InputMaybe<Scalars["String"]>;
  deedMetadata_gte?: InputMaybe<Scalars["String"]>;
  deedMetadata_lte?: InputMaybe<Scalars["String"]>;
  deedMetadata_in?: InputMaybe<Array<Scalars["String"]>>;
  deedMetadata_not_in?: InputMaybe<Array<Scalars["String"]>>;
  deedMetadata_contains?: InputMaybe<Scalars["String"]>;
  deedMetadata_contains_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_contains?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_starts_with?: InputMaybe<Scalars["String"]>;
  deedMetadata_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_starts_with?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_ends_with?: InputMaybe<Scalars["String"]>;
  deedMetadata_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_ends_with?: InputMaybe<Scalars["String"]>;
  deedMetadata_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  deedMetadata_?: InputMaybe<DeedMetadata_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DeedEntity_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DeedEntity_filter>>>;
};

export type DeedEntity_orderBy =
  | "id"
  | "deedId"
  | "owner"
  | "assetType"
  | "isValidated"
  | "minter"
  | "uri"
  | "blockNumber"
  | "blockTimestamp"
  | "transactionHash"
  | "deedMetadata"
  | "deedMetadata__id"
  | "deedMetadata__ownerInformation_type"
  | "deedMetadata__ownerInformation_name"
  | "deedMetadata__ownerInformation_position"
  | "deedMetadata__ownerInformation_entityName"
  | "deedMetadata__ownerInformation_entityType"
  | "deedMetadata__propertyDetails_type"
  | "deedMetadata__propertyDetails_address"
  | "deedMetadata__propertyDetails_city"
  | "deedMetadata__propertyDetails_state"
  | "deedMetadata__propertyDetails_size"
  | "deedMetadata__propertyDetails_subType"
  | "deedMetadata__propertyDetails_zoning"
  | "deedMetadata__otherInformation_blockchain"
  | "deedMetadata__otherInformation_wrapper";

export type DeedMetadata = {
  id: Scalars["ID"];
  ownerInformation_type: Scalars["String"];
  ownerInformation_name: Scalars["String"];
  ownerInformation_position?: Maybe<Scalars["String"]>;
  ownerInformation_entityName?: Maybe<Scalars["String"]>;
  ownerInformation_entityType?: Maybe<Scalars["String"]>;
  ownerInformation_ids: FileInfo;
  ownerInformation_operatingAgreement?: Maybe<FileInfo>;
  ownerInformation_articleIncorporation: FileInfo;
  ownerInformation_proofBill?: Maybe<FileInfo>;
  ownerInformation_supportingDoc?: Maybe<Array<FileInfo>>;
  propertyDetails_type: Scalars["String"];
  propertyDetails_address: Scalars["String"];
  propertyDetails_latitude: Scalars["String"];
  propertyDetails_longitude: Scalars["String"];
  propertyDetails_city: Scalars["String"];
  propertyDetails_state: Scalars["String"];
  propertyDetails_size?: Maybe<Scalars["String"]>;
  propertyDetails_subType?: Maybe<Scalars["String"]>;
  propertyDetails_zoning?: Maybe<Scalars["String"]>;
  propertyDetails_purchaseContract?: Maybe<FileInfo>;
  propertyDetails_deedOrTitle: FileInfo;
  propertyDetails_images?: Maybe<Array<FileInfo>>;
  otherInformation_blockchain: Scalars["String"];
  otherInformation_wrapper: Scalars["String"];
};

export type DeedMetadataownerInformation_supportingDocArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
};

export type DeedMetadatapropertyDetails_imagesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<FileInfo_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<FileInfo_filter>;
};

export type DeedMetadata_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  ownerInformation_type?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_type_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_type_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_type_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_name_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_position_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_position_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_position_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_entityName_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_entityName_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityName_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_entityType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_entityType_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_entityType_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_ids_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_ids_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_ids_?: InputMaybe<FileInfo_filter>;
  ownerInformation_operatingAgreement?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_operatingAgreement_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_operatingAgreement_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_operatingAgreement_?: InputMaybe<FileInfo_filter>;
  ownerInformation_articleIncorporation?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_articleIncorporation_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_articleIncorporation_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_articleIncorporation_?: InputMaybe<FileInfo_filter>;
  ownerInformation_proofBill?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_gt?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_lt?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_gte?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_lte?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_proofBill_not_in?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_proofBill_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_contains?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_starts_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_ends_with?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  ownerInformation_proofBill_?: InputMaybe<FileInfo_filter>;
  ownerInformation_supportingDoc?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_not?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_contains?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  ownerInformation_supportingDoc_?: InputMaybe<FileInfo_filter>;
  propertyDetails_type?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_type_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_type_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_type_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_address_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_address_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_address_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_city_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_city_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_city_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_state_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_state_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_state_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_size_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_size_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_size_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_subType_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_subType_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_subType_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_zoning_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_zoning_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_zoning_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_purchaseContract_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_purchaseContract_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_purchaseContract_?: InputMaybe<FileInfo_filter>;
  propertyDetails_deedOrTitle?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_gt?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_lt?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_gte?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_lte?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_deedOrTitle_not_in?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_deedOrTitle_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_contains?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_starts_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_ends_with?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  propertyDetails_deedOrTitle_?: InputMaybe<FileInfo_filter>;
  propertyDetails_images?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_not?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_contains?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_not_contains?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_not_contains_nocase?: InputMaybe<Array<Scalars["String"]>>;
  propertyDetails_images_?: InputMaybe<FileInfo_filter>;
  otherInformation_blockchain?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_gt?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_lt?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_gte?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_lte?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_in?: InputMaybe<Array<Scalars["String"]>>;
  otherInformation_blockchain_not_in?: InputMaybe<Array<Scalars["String"]>>;
  otherInformation_blockchain_contains?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_contains_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_contains?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_starts_with?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_starts_with?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_ends_with?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_ends_with?: InputMaybe<Scalars["String"]>;
  otherInformation_blockchain_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_gt?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_lt?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_gte?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_lte?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_in?: InputMaybe<Array<Scalars["String"]>>;
  otherInformation_wrapper_not_in?: InputMaybe<Array<Scalars["String"]>>;
  otherInformation_wrapper_contains?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_contains_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_contains?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_starts_with?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_starts_with?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_ends_with?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_ends_with?: InputMaybe<Scalars["String"]>;
  otherInformation_wrapper_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DeedMetadata_filter>>>;
  or?: InputMaybe<Array<InputMaybe<DeedMetadata_filter>>>;
};

export type DeedMetadata_orderBy =
  | "id"
  | "ownerInformation_type"
  | "ownerInformation_name"
  | "ownerInformation_position"
  | "ownerInformation_entityName"
  | "ownerInformation_entityType"
  | "ownerInformation_ids"
  | "ownerInformation_ids__id"
  | "ownerInformation_ids__name"
  | "ownerInformation_ids__size"
  | "ownerInformation_ids__type"
  | "ownerInformation_ids__timestamp"
  | "ownerInformation_operatingAgreement"
  | "ownerInformation_operatingAgreement__id"
  | "ownerInformation_operatingAgreement__name"
  | "ownerInformation_operatingAgreement__size"
  | "ownerInformation_operatingAgreement__type"
  | "ownerInformation_operatingAgreement__timestamp"
  | "ownerInformation_articleIncorporation"
  | "ownerInformation_articleIncorporation__id"
  | "ownerInformation_articleIncorporation__name"
  | "ownerInformation_articleIncorporation__size"
  | "ownerInformation_articleIncorporation__type"
  | "ownerInformation_articleIncorporation__timestamp"
  | "ownerInformation_proofBill"
  | "ownerInformation_proofBill__id"
  | "ownerInformation_proofBill__name"
  | "ownerInformation_proofBill__size"
  | "ownerInformation_proofBill__type"
  | "ownerInformation_proofBill__timestamp"
  | "ownerInformation_supportingDoc"
  | "propertyDetails_type"
  | "propertyDetails_address"
  | "propertyDetails_city"
  | "propertyDetails_state"
  | "propertyDetails_size"
  | "propertyDetails_subType"
  | "propertyDetails_zoning"
  | "propertyDetails_purchaseContract"
  | "propertyDetails_purchaseContract__id"
  | "propertyDetails_purchaseContract__name"
  | "propertyDetails_purchaseContract__size"
  | "propertyDetails_purchaseContract__type"
  | "propertyDetails_purchaseContract__timestamp"
  | "propertyDetails_deedOrTitle"
  | "propertyDetails_deedOrTitle__id"
  | "propertyDetails_deedOrTitle__name"
  | "propertyDetails_deedOrTitle__size"
  | "propertyDetails_deedOrTitle__type"
  | "propertyDetails_deedOrTitle__timestamp"
  | "propertyDetails_images"
  | "otherInformation_blockchain"
  | "otherInformation_wrapper";

export type FileInfo = {
  id: Scalars["ID"];
  fileId: Scalars["String"];
  name: Scalars["String"];
  size: Scalars["BigInt"];
  type: Scalars["String"];
  timestamp: Scalars["String"];
};

export type FileInfo_filter = {
  id?: InputMaybe<Scalars["ID"]>;
  id_not?: InputMaybe<Scalars["ID"]>;
  id_gt?: InputMaybe<Scalars["ID"]>;
  id_lt?: InputMaybe<Scalars["ID"]>;
  id_gte?: InputMaybe<Scalars["ID"]>;
  id_lte?: InputMaybe<Scalars["ID"]>;
  id_in?: InputMaybe<Array<Scalars["ID"]>>;
  id_not_in?: InputMaybe<Array<Scalars["ID"]>>;
  name?: InputMaybe<Scalars["String"]>;
  name_not?: InputMaybe<Scalars["String"]>;
  name_gt?: InputMaybe<Scalars["String"]>;
  name_lt?: InputMaybe<Scalars["String"]>;
  name_gte?: InputMaybe<Scalars["String"]>;
  name_lte?: InputMaybe<Scalars["String"]>;
  name_in?: InputMaybe<Array<Scalars["String"]>>;
  name_not_in?: InputMaybe<Array<Scalars["String"]>>;
  name_contains?: InputMaybe<Scalars["String"]>;
  name_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_not_contains?: InputMaybe<Scalars["String"]>;
  name_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  name_starts_with?: InputMaybe<Scalars["String"]>;
  name_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_starts_with?: InputMaybe<Scalars["String"]>;
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  name_ends_with?: InputMaybe<Scalars["String"]>;
  name_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  name_not_ends_with?: InputMaybe<Scalars["String"]>;
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  size?: InputMaybe<Scalars["BigInt"]>;
  size_not?: InputMaybe<Scalars["BigInt"]>;
  size_gt?: InputMaybe<Scalars["BigInt"]>;
  size_lt?: InputMaybe<Scalars["BigInt"]>;
  size_gte?: InputMaybe<Scalars["BigInt"]>;
  size_lte?: InputMaybe<Scalars["BigInt"]>;
  size_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  size_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  type?: InputMaybe<Scalars["String"]>;
  type_not?: InputMaybe<Scalars["String"]>;
  type_gt?: InputMaybe<Scalars["String"]>;
  type_lt?: InputMaybe<Scalars["String"]>;
  type_gte?: InputMaybe<Scalars["String"]>;
  type_lte?: InputMaybe<Scalars["String"]>;
  type_in?: InputMaybe<Array<Scalars["String"]>>;
  type_not_in?: InputMaybe<Array<Scalars["String"]>>;
  type_contains?: InputMaybe<Scalars["String"]>;
  type_contains_nocase?: InputMaybe<Scalars["String"]>;
  type_not_contains?: InputMaybe<Scalars["String"]>;
  type_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  type_starts_with?: InputMaybe<Scalars["String"]>;
  type_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type_not_starts_with?: InputMaybe<Scalars["String"]>;
  type_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  type_ends_with?: InputMaybe<Scalars["String"]>;
  type_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  type_not_ends_with?: InputMaybe<Scalars["String"]>;
  type_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp?: InputMaybe<Scalars["String"]>;
  timestamp_not?: InputMaybe<Scalars["String"]>;
  timestamp_gt?: InputMaybe<Scalars["String"]>;
  timestamp_lt?: InputMaybe<Scalars["String"]>;
  timestamp_gte?: InputMaybe<Scalars["String"]>;
  timestamp_lte?: InputMaybe<Scalars["String"]>;
  timestamp_in?: InputMaybe<Array<Scalars["String"]>>;
  timestamp_not_in?: InputMaybe<Array<Scalars["String"]>>;
  timestamp_contains?: InputMaybe<Scalars["String"]>;
  timestamp_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_not_contains?: InputMaybe<Scalars["String"]>;
  timestamp_not_contains_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_starts_with?: InputMaybe<Scalars["String"]>;
  timestamp_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_not_starts_with?: InputMaybe<Scalars["String"]>;
  timestamp_not_starts_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_ends_with?: InputMaybe<Scalars["String"]>;
  timestamp_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  timestamp_not_ends_with?: InputMaybe<Scalars["String"]>;
  timestamp_not_ends_with_nocase?: InputMaybe<Scalars["String"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FileInfo_filter>>>;
  or?: InputMaybe<Array<InputMaybe<FileInfo_filter>>>;
};

export type FileInfo_orderBy = "id" | "name" | "size" | "type" | "timestamp";

/** Defines the order direction, either ascending or descending */
export type OrderDirection = "asc" | "desc";

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
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerydeedEntitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DeedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerydeedMetadataArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerydeedMetadata_collectionArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DeedMetadata_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedMetadata_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytransferArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerytransfersArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryapprovalArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryapprovalsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Approval_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Approval_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryapprovalForAllArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryapprovalForAllsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ApprovalForAll_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ApprovalForAll_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryfileInfoArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryfileInfosArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
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
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiondeedEntitiesArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DeedEntity_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedEntity_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiondeedMetadataArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiondeedMetadata_collectionArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<DeedMetadata_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<DeedMetadata_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontransferArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptiontransfersArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Transfer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Transfer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionapprovalArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionapprovalsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<Approval_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Approval_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionapprovalForAllArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionapprovalForAllsArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
  orderBy?: InputMaybe<ApprovalForAll_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ApprovalForAll_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionfileInfoArgs = {
  id: Scalars["ID"];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionfileInfosArgs = {
  skip?: InputMaybe<Scalars["Int"]>;
  first?: InputMaybe<Scalars["Int"]>;
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
  id: Scalars["Bytes"];
  from: Scalars["Bytes"];
  to: Scalars["Bytes"];
  tokenId: Scalars["BigInt"];
  blockNumber: Scalars["BigInt"];
  blockTimestamp: Scalars["BigInt"];
  transactionHash: Scalars["Bytes"];
};

export type Transfer_filter = {
  id?: InputMaybe<Scalars["Bytes"]>;
  id_not?: InputMaybe<Scalars["Bytes"]>;
  id_gt?: InputMaybe<Scalars["Bytes"]>;
  id_lt?: InputMaybe<Scalars["Bytes"]>;
  id_gte?: InputMaybe<Scalars["Bytes"]>;
  id_lte?: InputMaybe<Scalars["Bytes"]>;
  id_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  id_contains?: InputMaybe<Scalars["Bytes"]>;
  id_not_contains?: InputMaybe<Scalars["Bytes"]>;
  from?: InputMaybe<Scalars["Bytes"]>;
  from_not?: InputMaybe<Scalars["Bytes"]>;
  from_gt?: InputMaybe<Scalars["Bytes"]>;
  from_lt?: InputMaybe<Scalars["Bytes"]>;
  from_gte?: InputMaybe<Scalars["Bytes"]>;
  from_lte?: InputMaybe<Scalars["Bytes"]>;
  from_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  from_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  from_contains?: InputMaybe<Scalars["Bytes"]>;
  from_not_contains?: InputMaybe<Scalars["Bytes"]>;
  to?: InputMaybe<Scalars["Bytes"]>;
  to_not?: InputMaybe<Scalars["Bytes"]>;
  to_gt?: InputMaybe<Scalars["Bytes"]>;
  to_lt?: InputMaybe<Scalars["Bytes"]>;
  to_gte?: InputMaybe<Scalars["Bytes"]>;
  to_lte?: InputMaybe<Scalars["Bytes"]>;
  to_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  to_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  to_contains?: InputMaybe<Scalars["Bytes"]>;
  to_not_contains?: InputMaybe<Scalars["Bytes"]>;
  tokenId?: InputMaybe<Scalars["BigInt"]>;
  tokenId_not?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_lt?: InputMaybe<Scalars["BigInt"]>;
  tokenId_gte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_lte?: InputMaybe<Scalars["BigInt"]>;
  tokenId_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  tokenId_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_not?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]>;
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_not?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lt?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_gte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_lte?: InputMaybe<Scalars["BigInt"]>;
  blockTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]>>;
  transactionHash?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lt?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_gte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_lte?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars["Bytes"]>>;
  transactionHash_contains?: InputMaybe<Scalars["Bytes"]>;
  transactionHash_not_contains?: InputMaybe<Scalars["Bytes"]>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Transfer_filter>>>;
};

export type Transfer_orderBy =
  | "id"
  | "from"
  | "to"
  | "tokenId"
  | "blockNumber"
  | "blockTimestamp"
  | "transactionHash";

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]>;
  /** The block number */
  number: Scalars["Int"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]>;
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
  deployment: Scalars["String"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | "allow"
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | "deny";

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Aggregation_interval: Aggregation_interval;
  Approval: ResolverTypeWrapper<Approval>;
  ApprovalForAll: ResolverTypeWrapper<ApprovalForAll>;
  ApprovalForAll_filter: ApprovalForAll_filter;
  ApprovalForAll_orderBy: ApprovalForAll_orderBy;
  Approval_filter: Approval_filter;
  Approval_orderBy: Approval_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars["BigDecimal"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Bytes: ResolverTypeWrapper<Scalars["Bytes"]>;
  DeedEntity: ResolverTypeWrapper<DeedEntity>;
  DeedEntity_filter: DeedEntity_filter;
  DeedEntity_orderBy: DeedEntity_orderBy;
  DeedMetadata: ResolverTypeWrapper<DeedMetadata>;
  DeedMetadata_filter: DeedMetadata_filter;
  DeedMetadata_orderBy: DeedMetadata_orderBy;
  FileInfo: ResolverTypeWrapper<FileInfo>;
  FileInfo_filter: FileInfo_filter;
  FileInfo_orderBy: FileInfo_orderBy;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Int8: ResolverTypeWrapper<Scalars["Int8"]>;
  OrderDirection: OrderDirection;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Subscription: ResolverTypeWrapper<{}>;
  Transfer: ResolverTypeWrapper<Transfer>;
  Transfer_filter: Transfer_filter;
  Transfer_orderBy: Transfer_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Approval: Approval;
  ApprovalForAll: ApprovalForAll;
  ApprovalForAll_filter: ApprovalForAll_filter;
  Approval_filter: Approval_filter;
  BigDecimal: Scalars["BigDecimal"];
  BigInt: Scalars["BigInt"];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars["Boolean"];
  Bytes: Scalars["Bytes"];
  DeedEntity: DeedEntity;
  DeedEntity_filter: DeedEntity_filter;
  DeedMetadata: DeedMetadata;
  DeedMetadata_filter: DeedMetadata_filter;
  FileInfo: FileInfo;
  FileInfo_filter: FileInfo_filter;
  Float: Scalars["Float"];
  ID: Scalars["ID"];
  Int: Scalars["Int"];
  Int8: Scalars["Int8"];
  Query: {};
  String: Scalars["String"];
  Subscription: {};
  Transfer: Transfer;
  Transfer_filter: Transfer_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = entityDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars["String"];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = subgraphIdDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars["String"];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = derivedFromDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ApprovalResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Approval"] = ResolversParentTypes["Approval"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  approved?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApprovalForAllResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["ApprovalForAll"] = ResolversParentTypes["ApprovalForAll"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  operator?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  approved?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["BigDecimal"], any> {
  name: "BigDecimal";
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Bytes"], any> {
  name: "Bytes";
}

export type DeedEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["DeedEntity"] = ResolversParentTypes["DeedEntity"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  deedId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  assetType?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  isValidated?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  minter?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  deedMetadata?: Resolver<ResolversTypes["DeedMetadata"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeedMetadataResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["DeedMetadata"] = ResolversParentTypes["DeedMetadata"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  ownerInformation_type?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ownerInformation_name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  ownerInformation_position?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ownerInformation_entityName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ownerInformation_entityType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  ownerInformation_ids?: Resolver<ResolversTypes["FileInfo"], ParentType, ContextType>;
  ownerInformation_operatingAgreement?: Resolver<
    Maybe<ResolversTypes["FileInfo"]>,
    ParentType,
    ContextType
  >;
  ownerInformation_articleIncorporation?: Resolver<
    ResolversTypes["FileInfo"],
    ParentType,
    ContextType
  >;
  ownerInformation_proofBill?: Resolver<Maybe<ResolversTypes["FileInfo"]>, ParentType, ContextType>;
  ownerInformation_supportingDoc?: Resolver<
    Maybe<Array<ResolversTypes["FileInfo"]>>,
    ParentType,
    ContextType,
    RequireFields<DeedMetadataownerInformation_supportingDocArgs, "skip" | "first">
  >;
  propertyDetails_type?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  propertyDetails_address?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  propertyDetails_city?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  propertyDetails_state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  propertyDetails_size?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  propertyDetails_subType?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  propertyDetails_zoning?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  propertyDetails_purchaseContract?: Resolver<
    Maybe<ResolversTypes["FileInfo"]>,
    ParentType,
    ContextType
  >;
  propertyDetails_deedOrTitle?: Resolver<ResolversTypes["FileInfo"], ParentType, ContextType>;
  propertyDetails_images?: Resolver<
    Maybe<Array<ResolversTypes["FileInfo"]>>,
    ParentType,
    ContextType,
    RequireFields<DeedMetadatapropertyDetails_imagesArgs, "skip" | "first">
  >;
  otherInformation_blockchain?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  otherInformation_wrapper?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FileInfoResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["FileInfo"] = ResolversParentTypes["FileInfo"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  size?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  type?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes["Int8"], any> {
  name: "Int8";
}

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  deedEntity?: Resolver<
    Maybe<ResolversTypes["DeedEntity"]>,
    ParentType,
    ContextType,
    RequireFields<QuerydeedEntityArgs, "id" | "subgraphError">
  >;
  deedEntities?: Resolver<
    Array<ResolversTypes["DeedEntity"]>,
    ParentType,
    ContextType,
    RequireFields<QuerydeedEntitiesArgs, "skip" | "first" | "subgraphError">
  >;
  deedMetadata?: Resolver<
    Maybe<ResolversTypes["DeedMetadata"]>,
    ParentType,
    ContextType,
    RequireFields<QuerydeedMetadataArgs, "id" | "subgraphError">
  >;
  deedMetadata_collection?: Resolver<
    Array<ResolversTypes["DeedMetadata"]>,
    ParentType,
    ContextType,
    RequireFields<QuerydeedMetadata_collectionArgs, "skip" | "first" | "subgraphError">
  >;
  transfer?: Resolver<
    Maybe<ResolversTypes["Transfer"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytransferArgs, "id" | "subgraphError">
  >;
  transfers?: Resolver<
    Array<ResolversTypes["Transfer"]>,
    ParentType,
    ContextType,
    RequireFields<QuerytransfersArgs, "skip" | "first" | "subgraphError">
  >;
  approval?: Resolver<
    Maybe<ResolversTypes["Approval"]>,
    ParentType,
    ContextType,
    RequireFields<QueryapprovalArgs, "id" | "subgraphError">
  >;
  approvals?: Resolver<
    Array<ResolversTypes["Approval"]>,
    ParentType,
    ContextType,
    RequireFields<QueryapprovalsArgs, "skip" | "first" | "subgraphError">
  >;
  approvalForAll?: Resolver<
    Maybe<ResolversTypes["ApprovalForAll"]>,
    ParentType,
    ContextType,
    RequireFields<QueryapprovalForAllArgs, "id" | "subgraphError">
  >;
  approvalForAlls?: Resolver<
    Array<ResolversTypes["ApprovalForAll"]>,
    ParentType,
    ContextType,
    RequireFields<QueryapprovalForAllsArgs, "skip" | "first" | "subgraphError">
  >;
  fileInfo?: Resolver<
    Maybe<ResolversTypes["FileInfo"]>,
    ParentType,
    ContextType,
    RequireFields<QueryfileInfoArgs, "id" | "subgraphError">
  >;
  fileInfos?: Resolver<
    Array<ResolversTypes["FileInfo"]>,
    ParentType,
    ContextType,
    RequireFields<QueryfileInfosArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: Resolver<
    Maybe<ResolversTypes["_Meta_"]>,
    ParentType,
    ContextType,
    Partial<Query_metaArgs>
  >;
}>;

export type SubscriptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = ResolversObject<{
  deedEntity?: SubscriptionResolver<
    Maybe<ResolversTypes["DeedEntity"]>,
    "deedEntity",
    ParentType,
    ContextType,
    RequireFields<SubscriptiondeedEntityArgs, "id" | "subgraphError">
  >;
  deedEntities?: SubscriptionResolver<
    Array<ResolversTypes["DeedEntity"]>,
    "deedEntities",
    ParentType,
    ContextType,
    RequireFields<SubscriptiondeedEntitiesArgs, "skip" | "first" | "subgraphError">
  >;
  deedMetadata?: SubscriptionResolver<
    Maybe<ResolversTypes["DeedMetadata"]>,
    "deedMetadata",
    ParentType,
    ContextType,
    RequireFields<SubscriptiondeedMetadataArgs, "id" | "subgraphError">
  >;
  deedMetadata_collection?: SubscriptionResolver<
    Array<ResolversTypes["DeedMetadata"]>,
    "deedMetadata_collection",
    ParentType,
    ContextType,
    RequireFields<SubscriptiondeedMetadata_collectionArgs, "skip" | "first" | "subgraphError">
  >;
  transfer?: SubscriptionResolver<
    Maybe<ResolversTypes["Transfer"]>,
    "transfer",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontransferArgs, "id" | "subgraphError">
  >;
  transfers?: SubscriptionResolver<
    Array<ResolversTypes["Transfer"]>,
    "transfers",
    ParentType,
    ContextType,
    RequireFields<SubscriptiontransfersArgs, "skip" | "first" | "subgraphError">
  >;
  approval?: SubscriptionResolver<
    Maybe<ResolversTypes["Approval"]>,
    "approval",
    ParentType,
    ContextType,
    RequireFields<SubscriptionapprovalArgs, "id" | "subgraphError">
  >;
  approvals?: SubscriptionResolver<
    Array<ResolversTypes["Approval"]>,
    "approvals",
    ParentType,
    ContextType,
    RequireFields<SubscriptionapprovalsArgs, "skip" | "first" | "subgraphError">
  >;
  approvalForAll?: SubscriptionResolver<
    Maybe<ResolversTypes["ApprovalForAll"]>,
    "approvalForAll",
    ParentType,
    ContextType,
    RequireFields<SubscriptionapprovalForAllArgs, "id" | "subgraphError">
  >;
  approvalForAlls?: SubscriptionResolver<
    Array<ResolversTypes["ApprovalForAll"]>,
    "approvalForAlls",
    ParentType,
    ContextType,
    RequireFields<SubscriptionapprovalForAllsArgs, "skip" | "first" | "subgraphError">
  >;
  fileInfo?: SubscriptionResolver<
    Maybe<ResolversTypes["FileInfo"]>,
    "fileInfo",
    ParentType,
    ContextType,
    RequireFields<SubscriptionfileInfoArgs, "id" | "subgraphError">
  >;
  fileInfos?: SubscriptionResolver<
    Array<ResolversTypes["FileInfo"]>,
    "fileInfos",
    ParentType,
    ContextType,
    RequireFields<SubscriptionfileInfosArgs, "skip" | "first" | "subgraphError">
  >;
  _meta?: SubscriptionResolver<
    Maybe<ResolversTypes["_Meta_"]>,
    "_meta",
    ParentType,
    ContextType,
    Partial<Subscription_metaArgs>
  >;
}>;

export type TransferResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["Transfer"] = ResolversParentTypes["Transfer"],
> = ResolversObject<{
  id?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  from?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  to?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  tokenId?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes["BigInt"], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes["Bytes"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Block_"] = ResolversParentTypes["_Block_"],
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes["Bytes"]>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes["_Meta_"] = ResolversParentTypes["_Meta_"],
> = ResolversObject<{
  block?: Resolver<ResolversTypes["_Block_"], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Approval?: ApprovalResolvers<ContextType>;
  ApprovalForAll?: ApprovalForAllResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  DeedEntity?: DeedEntityResolvers<ContextType>;
  DeedMetadata?: DeedMetadataResolvers<ContextType>;
  FileInfo?: FileInfoResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Transfer?: TransferResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = Deed3SepoliaTypes.Context & BaseMeshContext;

const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), "..");

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId
  )
    .split("\\")
    .join("/")
    .replace(baseDir + "/", "");
  switch (relativeModuleId) {
    case ".graphclient/sources/Deed3-Sepolia/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore(
  ".graphclient",
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: "ts",
  }),
  {
    readonly: true,
    validate: false,
  },
);

export const rawServeConfig: YamlConfig.Config["serve"] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child("sources");
  const logger = new DefaultLogger("GraphClient");
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child("cache"),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const deed3SepoliaTransforms = [];
  const additionalTypeDefs = [] as any[];
  const deed3SepoliaHandler = new GraphqlHandler({
    name: "Deed3-Sepolia",
    config: {
      endpoint: "https://api.studio.thegraph.com/query/56229/deed3-sepolia/version/latest",
    },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child("Deed3-Sepolia"),
    logger: logger.child("Deed3-Sepolia"),
    importFn,
  });
  sources[0] = {
    name: "Deed3-Sepolia",
    handler: deed3SepoliaHandler,
    transforms: deed3SepoliaTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child("bareMerger"),
    store: rootStore.child("bareMerger"),
  });

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions()
      .then(meshOptions => getMesh(meshOptions))
      .then(mesh => {
        const id = mesh.pubsub.subscribe("destroy", () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) =>
  getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));

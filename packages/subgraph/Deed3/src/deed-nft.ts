import { BigInt } from "@graphprotocol/graph-ts"
import {
  DeedNFT,
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  DeedNFTAssetTypeSet,
  DeedNFTAssetValidationSet,
  DeedNFTBurned,
  DeedNFTIpfsDetailsSet,
  DeedNFTMinted,
  MetadataUpdate,
  Transfer
} from "../generated/DeedNFT/DeedNFT"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.canSubdivide(...)
  // - contract.getApproved(...)
  // - contract.getDeedInfo(...)
  // - contract.hasAdminRole(...)
  // - contract.hasRole(...)
  // - contract.hasValidatorRole(...)
  // - contract.isApprovedForAll(...)
  // - contract.mintAsset(...)
  // - contract.name(...)
  // - contract.nextDeedId(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleBatchMetadataUpdate(event: BatchMetadataUpdate): void {}

export function handleDeedNFTAssetTypeSet(event: DeedNFTAssetTypeSet): void {}

export function handleDeedNFTAssetValidationSet(
  event: DeedNFTAssetValidationSet
): void {}

export function handleDeedNFTBurned(event: DeedNFTBurned): void {}

export function handleDeedNFTIpfsDetailsSet(
  event: DeedNFTIpfsDetailsSet
): void {}

export function handleDeedNFTMinted(event: DeedNFTMinted): void {}

export function handleMetadataUpdate(event: MetadataUpdate): void {}

export function handleTransfer(event: Transfer): void {}

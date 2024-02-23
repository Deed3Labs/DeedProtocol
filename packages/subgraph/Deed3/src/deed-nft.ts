import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BatchMetadataUpdate as BatchMetadataUpdateEvent,
  DeedNFTAssetTypeChanged as DeedNFTAssetTypeChangedEvent,
  DeedNFTBurned as DeedNFTBurnedEvent,
  DeedNFTMinted as DeedNFTMintedEvent,
  DeedNFTUriChanged as DeedNFTUriChangedEvent,
  DeedNFTValidatedChanged as DeedNFTValidatedChangedEvent,
  Initialized as InitializedEvent,
  MetadataUpdate as MetadataUpdateEvent,
  Transfer as TransferEvent
} from "../generated/DeedNFT/DeedNFT"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  DeedNFTAssetTypeChanged,
  DeedNFTBurned,
  DeedNFTMinted,
  DeedNFTUriChanged,
  DeedNFTValidatedChanged,
  Initialized,
  MetadataUpdate,
  Transfer
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBatchMetadataUpdate(
  event: BatchMetadataUpdateEvent
): void {
  let entity = new BatchMetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._fromTokenId = event.params._fromTokenId
  entity._toTokenId = event.params._toTokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeedNFTAssetTypeChanged(
  event: DeedNFTAssetTypeChangedEvent
): void {
  let entity = new DeedNFTAssetTypeChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.deedId = event.params.deedId
  entity.newAssetType = event.params.newAssetType

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeedNFTBurned(event: DeedNFTBurnedEvent): void {
  let entity = new DeedNFTBurned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.deedId = event.params.deedId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeedNFTMinted(event: DeedNFTMintedEvent): void {
  let entity = new DeedNFTMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.deedId = event.params.deedId
  entity.deedInfo_assetType = event.params.deedInfo.assetType
  entity.deedInfo_isValidated = event.params.deedInfo.isValidated
  entity.minter = event.params.minter
  entity.uri = event.params.uri

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeedNFTUriChanged(event: DeedNFTUriChangedEvent): void {
  let entity = new DeedNFTUriChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.deedId = event.params.deedId
  entity.newIpfsDetailsHash = event.params.newIpfsDetailsHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeedNFTValidatedChanged(
  event: DeedNFTValidatedChangedEvent
): void {
  let entity = new DeedNFTValidatedChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.deedId = event.params.deedId
  entity.isValid = event.params.isValid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdate(event: MetadataUpdateEvent): void {
  let entity = new MetadataUpdate(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._tokenId = event.params._tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

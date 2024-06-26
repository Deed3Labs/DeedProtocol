import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/DeedNFT/DeedNFT"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createDeedNFTAssetTypeChangedEvent(
  deedId: BigInt,
  newAssetType: i32
): DeedNFTAssetTypeChanged {
  let deedNftAssetTypeChangedEvent = changetype<DeedNFTAssetTypeChanged>(
    newMockEvent()
  )

  deedNftAssetTypeChangedEvent.parameters = new Array()

  deedNftAssetTypeChangedEvent.parameters.push(
    new ethereum.EventParam("deedId", ethereum.Value.fromUnsignedBigInt(deedId))
  )
  deedNftAssetTypeChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAssetType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newAssetType))
    )
  )

  return deedNftAssetTypeChangedEvent
}

export function createDeedNFTBurnedEvent(deedId: BigInt): DeedNFTBurned {
  let deedNftBurnedEvent = changetype<DeedNFTBurned>(newMockEvent())

  deedNftBurnedEvent.parameters = new Array()

  deedNftBurnedEvent.parameters.push(
    new ethereum.EventParam("deedId", ethereum.Value.fromUnsignedBigInt(deedId))
  )

  return deedNftBurnedEvent
}

export function createDeedNFTMintedEvent(
  deedId: BigInt,
  deedInfo: ethereum.Tuple,
  minter: Address,
  uri: string
): DeedNFTMinted {
  let deedNftMintedEvent = changetype<DeedNFTMinted>(newMockEvent())

  deedNftMintedEvent.parameters = new Array()

  deedNftMintedEvent.parameters.push(
    new ethereum.EventParam("deedId", ethereum.Value.fromUnsignedBigInt(deedId))
  )
  deedNftMintedEvent.parameters.push(
    new ethereum.EventParam("deedInfo", ethereum.Value.fromTuple(deedInfo))
  )
  deedNftMintedEvent.parameters.push(
    new ethereum.EventParam("minter", ethereum.Value.fromAddress(minter))
  )
  deedNftMintedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )

  return deedNftMintedEvent
}

export function createDeedNFTUriChangedEvent(
  deedId: BigInt,
  newIpfsDetailsHash: string
): DeedNFTUriChanged {
  let deedNftUriChangedEvent = changetype<DeedNFTUriChanged>(newMockEvent())

  deedNftUriChangedEvent.parameters = new Array()

  deedNftUriChangedEvent.parameters.push(
    new ethereum.EventParam("deedId", ethereum.Value.fromUnsignedBigInt(deedId))
  )
  deedNftUriChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newIpfsDetailsHash",
      ethereum.Value.fromString(newIpfsDetailsHash)
    )
  )

  return deedNftUriChangedEvent
}

export function createDeedNFTValidatedChangedEvent(
  deedId: BigInt,
  isValid: boolean
): DeedNFTValidatedChanged {
  let deedNftValidatedChangedEvent = changetype<DeedNFTValidatedChanged>(
    newMockEvent()
  )

  deedNftValidatedChangedEvent.parameters = new Array()

  deedNftValidatedChangedEvent.parameters.push(
    new ethereum.EventParam("deedId", ethereum.Value.fromUnsignedBigInt(deedId))
  )
  deedNftValidatedChangedEvent.parameters.push(
    new ethereum.EventParam("isValid", ethereum.Value.fromBoolean(isValid))
  )

  return deedNftValidatedChangedEvent
}

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

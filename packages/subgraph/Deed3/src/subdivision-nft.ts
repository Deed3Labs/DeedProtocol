import {
  IpfsDetailsSet as IpfsDetailsSetEvent,
  SubdivisionInfoSet as SubdivisionInfoSetEvent,
  SubdivisionMinted as SubdivisionMintedEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent
} from "../generated/SubdivisionNFT/SubdivisionNFT"
import {
  IpfsDetailsSet,
  SubdivisionInfoSet,
  SubdivisionMinted,
  TransferBatch,
  TransferSingle,
  URI
} from "../generated/schema"

export function handleIpfsDetailsSet(event: IpfsDetailsSetEvent): void {
  let entity = new IpfsDetailsSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.ipfsDetailsHash = event.params.ipfsDetailsHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubdivisionInfoSet(event: SubdivisionInfoSetEvent): void {
  let entity = new SubdivisionInfoSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.info_ipfsDetailsHash = event.params.info.ipfsDetailsHash
  entity.info_owner = event.params.info.owner
  entity.info_parentDeed = event.params.info.parentDeed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubdivisionMinted(event: SubdivisionMintedEvent): void {
  let entity = new SubdivisionMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.subdivisionId = event.params.subdivisionId
  entity.deedId = event.params.deedId
  entity.ipfsDetailsHash = event.params.ipfsDetailsHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let entity = new TransferBatch(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.ids = event.params.ids
  entity.values = event.params.values

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let entity = new TransferSingle(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.from = event.params.from
  entity.to = event.params.to
  entity.SubdivisionNFT_id = event.params.id
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleURI(event: URIEvent): void {
  let entity = new URI(event.transaction.hash.concatI32(event.logIndex.toI32()))
  entity.value = event.params.value
  entity.SubdivisionNFT_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

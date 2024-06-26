import { Bytes, store, BigInt, log } from "@graphprotocol/graph-ts";
import {
    Approval as ApprovalEvent,
    ApprovalForAll as ApprovalForAllEvent,
    DeedNFT,
    DeedNFTBurned,
    DeedNFTMinted as DeedNFTMintedEvent,
    DeedNFTUriChanged as DeedNFTUriChangedEvent,
    DeedNFTValidatedChanged as DeedNFTValidatedChangedEvent,
    Transfer as TransferEvent,
} from "../generated/DeedNFT/DeedNFT";
import {
    Approval,
    ApprovalForAll,
    DeedEntity,
    Transfer,
} from "../generated/schema";
import { DeedMetadata as DeedMetadataTemplate } from "../generated/templates";

export function handleDeedNFTMinted(event: DeedNFTMintedEvent): void {
    let deedContract = DeedNFT.bind(event.address);
    let entityId = getDeedEntityId(event.address, event.params.deedId);
    let deed = new DeedEntity(entityId);
    deed.deedId = event.params.deedId;
    deed.owner = deedContract.ownerOf(event.params.deedId);
    deed.minter = event.params.minter;
    deed.assetType = event.params.deedInfo.assetType;
    deed.isValidated = event.params.deedInfo.isValidated;
    deed.uri = deedContract.tokenURI(event.params.deedId);
    deed.blockNumber = event.block.number;
    deed.blockTimestamp = event.block.timestamp;
    deed.transactionHash = event.transaction.hash;
    deed.deedMetadata = deed.uri;

    log.debug("Fetching deed metadata for {}: {}", [
        entityId,
        deed.deedMetadata,
    ]);
    DeedMetadataTemplate.create(deed.deedMetadata);
    deed.save();
}

export function handleDeedNFTAssetValidationSet(
    event: DeedNFTValidatedChangedEvent
): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    )!;
    deed.isValidated = event.params.isValid;
    deed.save();
}

export function handleDeedNFTBurned(event: DeedNFTBurned): void {
    store.remove(
        "DeedEntity",
        getDeedEntityId(event.address, event.params.deedId)
    );
}

export function handleDeedNFTUriChanged(event: DeedNFTUriChangedEvent): void {
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    );
    if (deed) {
        deed.uri = event.params.newIpfsDetailsHash;
        deed.deedMetadata = deed.uri;
        DeedMetadataTemplate.create(deed.uri);
        deed.save();
    }
}

export function handleDeedNFTValidatedChanged(
    event: DeedNFTValidatedChangedEvent
): void {
    log.debug("DeedNFTValidatedChanged: {} {}", [
        event.address.toString(),
        event.params.isValid.toString(),
    ]);
    let deed = DeedEntity.load(
        getDeedEntityId(event.address, event.params.deedId)
    );
    if (deed) {
        deed.isValidated = event.params.isValid;
        deed.save();
    }
}

export function handleTransfer(event: TransferEvent): void {
    let entity = new Transfer(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.from = event.params.from;
    entity.to = event.params.to;
    entity.tokenId = event.params.tokenId;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
    let entity = new Approval(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.owner = event.params.owner;
    entity.approved = event.params.approved;
    entity.tokenId = event.params.tokenId;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
    let entity = new ApprovalForAll(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.owner = event.params.owner;
    entity.operator = event.params.operator;
    entity.approved = event.params.approved;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

function getDeedEntityId(address: Bytes, deedId: BigInt): string {
    return address.toHexString() + "_" + deedId.toString();
}

import { BigInt, log } from "@graphprotocol/graph-ts";
import {
    Approval as ApprovalEvent,
    ApprovalForAll as ApprovalForAllEvent,
    DeedNFTAssetTypeSet as DeedNFTAssetTypeSetEvent,
    DeedNFTAssetValidationSet as DeedNFTAssetValidationSetEvent,
    DeedNFTIpfsDetailsSet as DeedNFTIpfsDetailsSetEvent,
    DeedNFTMinted as DeedNFTMintedEvent,
    DeedNFTBurned as DeedNFTBurnedEvent,
    DeedNFTPriceUpdated as DeedNFTPriceUpdatedEvent,
    RoleAdminChanged as RoleAdminChangedEvent,
    RoleGranted as RoleGrantedEvent,
    RoleRevoked as RoleRevokedEvent,
    Transfer as TransferEvent,
} from "../generated/DeedNFT/DeedNFT";
import {
    Approval,
    ApprovalForAll,
    DeedEntity,
    RoleAdminChanged,
    RoleGranted,
    RoleRevoked,
    Transfer,
} from "../generated/schema";

export function handleDeedNFTMinted(event: DeedNFTMintedEvent): void {
    let entity = new DeedEntity(event.params.deedId.toString());
    entity.deedId = event.params.deedId;
    entity.deedInfo_ipfsDetailsHash = event.params.deedInfo.ipfsDetailsHash;
    entity.deedInfo_assetType = event.params.deedInfo.assetType;
    entity.deedInfo_price = event.params.deedInfo.price;
    entity.deedInfo_deedAddress = event.params.deedInfo.deedAddress; 
    entity.deedInfo_isValidated = event.params.deedInfo.isValidated;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleDeedNFTBurned(event: DeedNFTBurnedEvent): void {
    let deedEntity = loadDeedEntity(event.params.deedId);
    if (deedEntity != null) {
        deedEntity.archived;
        deedEntity.save();
    }
}

export function handleDeedNFTAssetTypeSet(
    event: DeedNFTAssetTypeSetEvent
): void {
    let deedEntity = loadDeedEntity(event.params.deedId);

    if (deedEntity != null) {
        deedEntity.deedInfo_assetType = event.params.newAssetType;
        deedEntity.save();
    }
}

export function handleDeedNFTAssetValidationSet(
    event: DeedNFTAssetValidationSetEvent
): void {
    let deedEntity = loadDeedEntity(event.params.deedId);

    if (deedEntity != null) {
        deedEntity.deedInfo_isValidated = event.params.isValid;
        deedEntity.save();
    }
}

export function handleDeedNFTIpfsDetailsSet(
    event: DeedNFTIpfsDetailsSetEvent
): void {
    let deedEntity = loadDeedEntity(event.params.deedId);

    if (deedEntity != null) {
        deedEntity.deedInfo_ipfsDetailsHash = event.params.newIpfsDetailsHash;
        deedEntity.save();
    }
}

export function handleDeedNFTPriceUpdated(
    event: DeedNFTPriceUpdatedEvent
): void {
    let deedEntity = loadDeedEntity(event.params.deedId);

    if (deedEntity != null) {
        deedEntity.deedInfo_price = event.params.newPrice;
        deedEntity.save();
    }
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
    let entity = new RoleAdminChanged(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.role = event.params.role;
    entity.previousAdminRole = event.params.previousAdminRole;
    entity.newAdminRole = event.params.newAdminRole;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
    let entity = new RoleGranted(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.role = event.params.role;
    entity.account = event.params.account;
    entity.sender = event.params.sender;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
    let entity = new RoleRevoked(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.role = event.params.role;
    entity.account = event.params.account;
    entity.sender = event.params.sender;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
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

function loadDeedEntity(deedId: BigInt): DeedEntity | null {
    let entity = DeedEntity.load(deedId.toString());

    if (entity == null) {
        log.error("DeedEntity not found for id: {}", [deedId.toString()]);
    }

    return entity;
}

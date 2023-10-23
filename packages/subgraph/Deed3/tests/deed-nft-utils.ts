import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    Approval,
    ApprovalForAll,
    DeedNFTAssetTypeSet,
    DeedNFTAssetValidationSet,
    DeedNFTIpfsDetailsSet,
    DeedNFTMinted,
    DeedNFTPriceUpdated,
    RoleAdminChanged,
    RoleGranted,
    RoleRevoked,
    Transfer,
} from "../generated/DeedNFT/DeedNFT";

export function createApprovalEvent(
    owner: Address,
    approved: Address,
    tokenId: BigInt
): Approval {
    let approvalEvent = changetype<Approval>(newMockEvent());

    approvalEvent.parameters = new Array();

    approvalEvent.parameters.push(
        new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    );
    approvalEvent.parameters.push(
        new ethereum.EventParam(
            "approved",
            ethereum.Value.fromAddress(approved)
        )
    );
    approvalEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(tokenId)
        )
    );

    return approvalEvent;
}

export function createApprovalForAllEvent(
    owner: Address,
    operator: Address,
    approved: boolean
): ApprovalForAll {
    let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent());

    approvalForAllEvent.parameters = new Array();

    approvalForAllEvent.parameters.push(
        new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    );
    approvalForAllEvent.parameters.push(
        new ethereum.EventParam(
            "operator",
            ethereum.Value.fromAddress(operator)
        )
    );
    approvalForAllEvent.parameters.push(
        new ethereum.EventParam(
            "approved",
            ethereum.Value.fromBoolean(approved)
        )
    );

    return approvalForAllEvent;
}

export function createDeedNFTAssetTypeSetEvent(
    deedId: BigInt,
    newAssetType: i32
): DeedNFTAssetTypeSet {
    let deedNftAssetTypeSetEvent = changetype<DeedNFTAssetTypeSet>(
        newMockEvent()
    );

    deedNftAssetTypeSetEvent.parameters = new Array();

    deedNftAssetTypeSetEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    deedNftAssetTypeSetEvent.parameters.push(
        new ethereum.EventParam(
            "newAssetType",
            ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newAssetType))
        )
    );

    return deedNftAssetTypeSetEvent;
}

export function createDeedNFTAssetValidationSetEvent(
    deedId: BigInt,
    isValid: boolean
): DeedNFTAssetValidationSet {
    let deedNftAssetValidationSetEvent = changetype<DeedNFTAssetValidationSet>(
        newMockEvent()
    );

    deedNftAssetValidationSetEvent.parameters = new Array();

    deedNftAssetValidationSetEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    deedNftAssetValidationSetEvent.parameters.push(
        new ethereum.EventParam("isValid", ethereum.Value.fromBoolean(isValid))
    );

    return deedNftAssetValidationSetEvent;
}

export function createDeedNFTIpfsDetailsSetEvent(
    deedId: BigInt,
    newIpfsDetailsHash: Bytes
): DeedNFTIpfsDetailsSet {
    let deedNftIpfsDetailsSetEvent = changetype<DeedNFTIpfsDetailsSet>(
        newMockEvent()
    );

    deedNftIpfsDetailsSetEvent.parameters = new Array();

    deedNftIpfsDetailsSetEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    deedNftIpfsDetailsSetEvent.parameters.push(
        new ethereum.EventParam(
            "newIpfsDetailsHash",
            ethereum.Value.fromBytes(newIpfsDetailsHash)
        )
    );

    return deedNftIpfsDetailsSetEvent;
}

export function createDeedNFTMintedEvent(
    deedId: BigInt,
    deedInfo: ethereum.Tuple
): DeedNFTMinted {
    let deedNftMintedEvent = changetype<DeedNFTMinted>(newMockEvent());

    deedNftMintedEvent.parameters = new Array();

    deedNftMintedEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    deedNftMintedEvent.parameters.push(
        new ethereum.EventParam("deedInfo", ethereum.Value.fromTuple(deedInfo))
    );

    return deedNftMintedEvent;
}

export function createDeedNFTPriceUpdatedEvent(
    deedId: BigInt,
    newPrice: BigInt
): DeedNFTPriceUpdated {
    let deedNftPriceUpdatedEvent = changetype<DeedNFTPriceUpdated>(
        newMockEvent()
    );

    deedNftPriceUpdatedEvent.parameters = new Array();

    deedNftPriceUpdatedEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    deedNftPriceUpdatedEvent.parameters.push(
        new ethereum.EventParam(
            "newPrice",
            ethereum.Value.fromUnsignedBigInt(newPrice)
        )
    );

    return deedNftPriceUpdatedEvent;
}

export function createRoleAdminChangedEvent(
    role: Bytes,
    previousAdminRole: Bytes,
    newAdminRole: Bytes
): RoleAdminChanged {
    let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent());

    roleAdminChangedEvent.parameters = new Array();

    roleAdminChangedEvent.parameters.push(
        new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
    );
    roleAdminChangedEvent.parameters.push(
        new ethereum.EventParam(
            "previousAdminRole",
            ethereum.Value.fromFixedBytes(previousAdminRole)
        )
    );
    roleAdminChangedEvent.parameters.push(
        new ethereum.EventParam(
            "newAdminRole",
            ethereum.Value.fromFixedBytes(newAdminRole)
        )
    );

    return roleAdminChangedEvent;
}

export function createRoleGrantedEvent(
    role: Bytes,
    account: Address,
    sender: Address
): RoleGranted {
    let roleGrantedEvent = changetype<RoleGranted>(newMockEvent());

    roleGrantedEvent.parameters = new Array();

    roleGrantedEvent.parameters.push(
        new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
    );
    roleGrantedEvent.parameters.push(
        new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
    );
    roleGrantedEvent.parameters.push(
        new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
    );

    return roleGrantedEvent;
}

export function createRoleRevokedEvent(
    role: Bytes,
    account: Address,
    sender: Address
): RoleRevoked {
    let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent());

    roleRevokedEvent.parameters = new Array();

    roleRevokedEvent.parameters.push(
        new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
    );
    roleRevokedEvent.parameters.push(
        new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
    );
    roleRevokedEvent.parameters.push(
        new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
    );

    return roleRevokedEvent;
}

export function createTransferEvent(
    from: Address,
    to: Address,
    tokenId: BigInt
): Transfer {
    let transferEvent = changetype<Transfer>(newMockEvent());

    transferEvent.parameters = new Array();

    transferEvent.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
    );
    transferEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
    );
    transferEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(tokenId)
        )
    );

    return transferEvent;
}

import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
    SubdivisionIpfsDetailsSet,
    SubdivisionBurned,
    SubdivisionInfoSet,
    SubdivisionMinted,
    TransferBatch,
    TransferSingle,
    URI,
} from "../generated/SubdivisionNFT/SubdivisionNFT";

export function createIpfsDetailsSetEvent(
    tokenId: BigInt,
    ipfsDetailsHash: Bytes
): SubdivisionIpfsDetailsSet {
    let ipfsDetailsSetEvent = changetype<SubdivisionIpfsDetailsSet>(
        newMockEvent()
    );

    ipfsDetailsSetEvent.parameters = new Array();

    ipfsDetailsSetEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(tokenId)
        )
    );
    ipfsDetailsSetEvent.parameters.push(
        new ethereum.EventParam(
            "ipfsDetailsHash",
            ethereum.Value.fromBytes(ipfsDetailsHash)
        )
    );

    return ipfsDetailsSetEvent;
}

export function createSubdivisionBurnedEvent(
    account: Address,
    subdivisionId: BigInt,
    deedId: BigInt,
    ipfsDetailsHash: Bytes
): SubdivisionBurned {
    let subdivisionBurnedEvent = changetype<SubdivisionBurned>(newMockEvent());

    subdivisionBurnedEvent.parameters = new Array();

    subdivisionBurnedEvent.parameters.push(
        new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
    );
    subdivisionBurnedEvent.parameters.push(
        new ethereum.EventParam(
            "subdivisionId",
            ethereum.Value.fromUnsignedBigInt(subdivisionId)
        )
    );
    subdivisionBurnedEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    subdivisionBurnedEvent.parameters.push(
        new ethereum.EventParam(
            "ipfsDetailsHash",
            ethereum.Value.fromBytes(ipfsDetailsHash)
        )
    );

    return subdivisionBurnedEvent;
}

export function createSubdivisionInfoSetEvent(
    tokenId: BigInt,
    info: ethereum.Tuple
): SubdivisionInfoSet {
    let subdivisionInfoSetEvent = changetype<SubdivisionInfoSet>(
        newMockEvent()
    );

    subdivisionInfoSetEvent.parameters = new Array();

    subdivisionInfoSetEvent.parameters.push(
        new ethereum.EventParam(
            "tokenId",
            ethereum.Value.fromUnsignedBigInt(tokenId)
        )
    );
    subdivisionInfoSetEvent.parameters.push(
        new ethereum.EventParam("info", ethereum.Value.fromTuple(info))
    );

    return subdivisionInfoSetEvent;
}

export function createSubdivisionMintedEvent(
    owner: Address,
    subdivisionId: BigInt,
    deedId: BigInt,
    ipfsDetailsHash: Bytes
): SubdivisionMinted {
    let subdivisionMintedEvent = changetype<SubdivisionMinted>(newMockEvent());

    subdivisionMintedEvent.parameters = new Array();

    subdivisionMintedEvent.parameters.push(
        new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
    );
    subdivisionMintedEvent.parameters.push(
        new ethereum.EventParam(
            "subdivisionId",
            ethereum.Value.fromUnsignedBigInt(subdivisionId)
        )
    );
    subdivisionMintedEvent.parameters.push(
        new ethereum.EventParam(
            "deedId",
            ethereum.Value.fromUnsignedBigInt(deedId)
        )
    );
    subdivisionMintedEvent.parameters.push(
        new ethereum.EventParam(
            "ipfsDetailsHash",
            ethereum.Value.fromBytes(ipfsDetailsHash)
        )
    );

    return subdivisionMintedEvent;
}

export function createTransferBatchEvent(
    operator: Address,
    from: Address,
    to: Address,
    ids: Array<BigInt>,
    values: Array<BigInt>
): TransferBatch {
    let transferBatchEvent = changetype<TransferBatch>(newMockEvent());

    transferBatchEvent.parameters = new Array();

    transferBatchEvent.parameters.push(
        new ethereum.EventParam(
            "operator",
            ethereum.Value.fromAddress(operator)
        )
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam(
            "ids",
            ethereum.Value.fromUnsignedBigIntArray(ids)
        )
    );
    transferBatchEvent.parameters.push(
        new ethereum.EventParam(
            "values",
            ethereum.Value.fromUnsignedBigIntArray(values)
        )
    );

    return transferBatchEvent;
}

export function createTransferSingleEvent(
    operator: Address,
    from: Address,
    to: Address,
    id: BigInt,
    value: BigInt
): TransferSingle {
    let transferSingleEvent = changetype<TransferSingle>(newMockEvent());

    transferSingleEvent.parameters = new Array();

    transferSingleEvent.parameters.push(
        new ethereum.EventParam(
            "operator",
            ethereum.Value.fromAddress(operator)
        )
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
    );
    transferSingleEvent.parameters.push(
        new ethereum.EventParam(
            "value",
            ethereum.Value.fromUnsignedBigInt(value)
        )
    );

    return transferSingleEvent;
}

export function createURIEvent(value: string, id: BigInt): URI {
    let uriEvent = changetype<URI>(newMockEvent());

    uriEvent.parameters = new Array();

    uriEvent.parameters.push(
        new ethereum.EventParam("value", ethereum.Value.fromString(value))
    );
    uriEvent.parameters.push(
        new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
    );

    return uriEvent;
}

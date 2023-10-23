import { OwnershipTransferred as OwnershipTransferredEvent } from "../generated/LeaseNFT/LeaseNFT";
import { OwnershipTransferred } from "../generated/schema";

export function handleOwnershipTransferred(
    event: OwnershipTransferredEvent
): void {
    let entity = new OwnershipTransferred(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.previousOwner = event.params.previousOwner;
    entity.newOwner = event.params.newOwner;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

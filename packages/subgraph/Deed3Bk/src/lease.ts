import { log } from "matchstick-as";
import {
    LeaseAgentRemoved as LeaseAgentRemovedEvent,
    LeaseAgentAdded as LeaseAgentAddedEvent,
    LeaseCreated as LeaseCreatedEvent,
    LeaseDepositSubmited as LeaseDepositSubmitedEvent,
    LeaseDueDateChanged as LeaseDueDateChangedEvent,
    LeaseExtended as LeaseExtendedEvent,
    LeaseFundsManagerSet as LeaseFundsManagerSetEvent,
    LeasePaymentMade as LeasePaymentMadeEvent,
    LeasePaymentTokenSet as LeasePaymentTokenSetEvent,
    LeaseRentDistributed as LeaseRentDistributedEvent,
    LeaseTerminated as LeaseTerminatedEvent,
} from "../generated/LeaseAgreement/LeaseAgreement";
import {
    LeaseEntity,
    LeaseFundsManagerSet,
    LeasePaymentTokenSet,
} from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";
import { OwnershipTransferred as OwnershipTransferredEvent } from "../generated/LeaseNFT/LeaseNFT";

export function handleLeaseCreated(event: LeaseCreatedEvent): void {
    let leaseEntity = new LeaseEntity(event.params.leaseId.toString());
    leaseEntity.leaseId = event.params.leaseId;
    leaseEntity.lease_lessor = event.params.lease.lessor;
    leaseEntity.lease_lessee = event.params.lease.lessee;
    leaseEntity.lease_rentAmount = event.params.lease.rentAmount;
    leaseEntity.lease_securityDeposit_amount =
        event.params.lease.securityDeposit.amount;
    leaseEntity.lease_securityDeposit_paid =
        event.params.lease.securityDeposit.paid;
    leaseEntity.lease_latePaymentFee = event.params.lease.latePaymentFee;
    leaseEntity.lease_gracePeriod = event.params.lease.gracePeriod;
    leaseEntity.lease_dates_startDate = event.params.lease.dates.startDate;
    leaseEntity.lease_dates_endDate = event.params.lease.dates.endDate;
    leaseEntity.lease_dates_rentDueDate = event.params.lease.dates.rentDueDate;
    leaseEntity.lease_dates_distributableDate =
        event.params.lease.dates.distributableDate;
    leaseEntity.lease_extensionCount = event.params.lease.extensionCount;
    leaseEntity.lease_deedId = event.params.lease.deedId;
    leaseEntity.lease_agent = event.params.lease.agent;
    leaseEntity.lease_agentPercentage = event.params.lease.agentPercentage;
    leaseEntity.lease_unclaimedRentAmount =
        event.params.lease.unclaimedRentAmount;

    leaseEntity.blockNumber = event.block.number;
    leaseEntity.blockTimestamp = event.block.timestamp;
    leaseEntity.transactionHash = event.transaction.hash;

    leaseEntity.save();
}

export function handleLeaseAgentRemoved(event: LeaseAgentRemovedEvent): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_agent = null;
        leaseEntity.save();
    }
}

export function handleLeaseAgentAdded(event: LeaseAgentAddedEvent): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_agent = event.params.agent;
        leaseEntity.save();
    }
}

export function handleLeaseDepositSubmited(
    event: LeaseDepositSubmitedEvent
): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_securityDeposit_paid = true;
        leaseEntity.save();
    }
}

export function handleLeaseDueDateChanged(
    event: LeaseDueDateChangedEvent
): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_dates_rentDueDate = event.params.newDueDate;
        leaseEntity.save();
    }
}

export function handleLeaseExtended(event: LeaseExtendedEvent): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_dates_endDate = event.params.endDate;
        leaseEntity.lease_extensionCount = event.params.extensionCount;
        leaseEntity.lease_rentAmount = event.params.rentAmount;
        leaseEntity.save();
    }
}

export function handleLeasePaymentMade(event: LeasePaymentMadeEvent): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_unclaimedRentAmount =
            event.params.unclaimedRentAmount;
        leaseEntity.save();
    }
}

export function handleLeaseRentDistributed(
    event: LeaseRentDistributedEvent
): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.lease_unclaimedRentAmount = new BigInt(0);
        leaseEntity.lease_dates_distributableDate =
            event.params.distributableDate;
        leaseEntity.save();
    }
}

export function handleLeaseTerminated(event: LeaseTerminatedEvent): void {
    let leaseEntity = loadLeaseEntity(event.params.leaseId);
    if (leaseEntity != null) {
        leaseEntity.archived = true;
    }
}

export function handleLeaseFundsManagerSet(
    event: LeaseFundsManagerSetEvent
): void {
    let entity = new LeaseFundsManagerSet(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.fundsManager = event.params.fundsManager;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

export function handleLeasePaymentTokenSet(
    event: LeasePaymentTokenSetEvent
): void {
    let entity = new LeasePaymentTokenSet(
        event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.paymentToken = event.params.paymentToken;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
}

function loadLeaseEntity(leaseId: BigInt): LeaseEntity | null {
    let lease = LeaseEntity.load(leaseId.toString());
    if (lease != null) {
        log.error("LeaseEntity not found for id: {}", [leaseId.toString()]);
    }
    return lease;
}

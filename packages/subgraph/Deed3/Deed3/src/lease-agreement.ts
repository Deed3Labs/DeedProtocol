import {
  LeaseAgentRemoved as LeaseAgentRemovedEvent,
  LeaseAgentSet as LeaseAgentSetEvent,
  LeaseCreated as LeaseCreatedEvent,
  LeaseDepositSubmited as LeaseDepositSubmitedEvent,
  LeaseDueDateChanged as LeaseDueDateChangedEvent,
  LeaseExtended as LeaseExtendedEvent,
  LeaseFundsManagerSet as LeaseFundsManagerSetEvent,
  LeasePaymentMade as LeasePaymentMadeEvent,
  LeasePaymentTokenSet as LeasePaymentTokenSetEvent,
  LeaseRentDistributed as LeaseRentDistributedEvent,
  LeaseTerminated as LeaseTerminatedEvent
} from "../generated/LeaseAgreement/LeaseAgreement"
import {
  LeaseAgentRemoved,
  LeaseAgentSet,
  LeaseCreated,
  LeaseDepositSubmited,
  LeaseDueDateChanged,
  LeaseExtended,
  LeaseFundsManagerSet,
  LeasePaymentMade,
  LeasePaymentTokenSet,
  LeaseRentDistributed,
  LeaseTerminated
} from "../generated/schema"

export function handleLeaseAgentRemoved(event: LeaseAgentRemovedEvent): void {
  let entity = new LeaseAgentRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseAgentSet(event: LeaseAgentSetEvent): void {
  let entity = new LeaseAgentSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.agent = event.params.agent
  entity.percentage = event.params.percentage
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseCreated(event: LeaseCreatedEvent): void {
  let entity = new LeaseCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.lease_lessor = event.params.lease.lessor
  entity.lease_lessee = event.params.lease.lessee
  entity.lease_rentAmount = event.params.lease.rentAmount
  entity.lease_securityDeposit_amount =
    event.params.lease.securityDeposit.amount
  entity.lease_securityDeposit_paid = event.params.lease.securityDeposit.paid
  entity.lease_latePaymentFee = event.params.lease.latePaymentFee
  entity.lease_gracePeriod = event.params.lease.gracePeriod
  entity.lease_dates_startDate = event.params.lease.dates.startDate
  entity.lease_dates_endDate = event.params.lease.dates.endDate
  entity.lease_dates_rentDueDate = event.params.lease.dates.rentDueDate
  entity.lease_dates_distributableDate =
    event.params.lease.dates.distributableDate
  entity.lease_extensionCount = event.params.lease.extensionCount
  entity.lease_propertyTokenId = event.params.lease.propertyTokenId
  entity.lease_agent = event.params.lease.agent
  entity.lease_agentPercentage = event.params.lease.agentPercentage
  entity.lease_unclaimedRentAmount = event.params.lease.unclaimedRentAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseDepositSubmited(
  event: LeaseDepositSubmitedEvent
): void {
  let entity = new LeaseDepositSubmited(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.amount = event.params.amount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseDueDateChanged(
  event: LeaseDueDateChangedEvent
): void {
  let entity = new LeaseDueDateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.newDueDate = event.params.newDueDate
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseExtended(event: LeaseExtendedEvent): void {
  let entity = new LeaseExtended(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.endDate = event.params.endDate
  entity.rentAmount = event.params.rentAmount
  entity.extensionCount = event.params.extensionCount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseFundsManagerSet(
  event: LeaseFundsManagerSetEvent
): void {
  let entity = new LeaseFundsManagerSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fundsManager = event.params.fundsManager
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeasePaymentMade(event: LeasePaymentMadeEvent): void {
  let entity = new LeasePaymentMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.amount = event.params.amount
  entity.unclaimedRentAmount = event.params.unclaimedRentAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeasePaymentTokenSet(
  event: LeasePaymentTokenSetEvent
): void {
  let entity = new LeasePaymentTokenSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.paymentToken = event.params.paymentToken
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseRentDistributed(
  event: LeaseRentDistributedEvent
): void {
  let entity = new LeaseRentDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.lessorAmount = event.params.lessorAmount
  entity.agentAmount = event.params.agentAmount
  entity.distributableDate = event.params.distributableDate
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleLeaseTerminated(event: LeaseTerminatedEvent): void {
  let entity = new LeaseTerminated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

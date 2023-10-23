import {
  AgentRemoved as AgentRemovedEvent,
  AgentSet as AgentSetEvent,
  DueDateChanged as DueDateChangedEvent,
  FundsManagerSet as FundsManagerSetEvent,
  LeaseCreated as LeaseCreatedEvent,
  LeaseTerminated as LeaseTerminatedEvent,
  PaymentMade as PaymentMadeEvent,
  RentDistributed as RentDistributedEvent
} from "../generated/LeaseAgreement/LeaseAgreement"
import {
  AgentRemoved,
  AgentSet,
  DueDateChanged,
  FundsManagerSet,
  LeaseCreated,
  LeaseTerminated,
  PaymentMade,
  RentDistributed
} from "../generated/schema"

export function handleAgentRemoved(event: AgentRemovedEvent): void {
  let entity = new AgentRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAgentSet(event: AgentSetEvent): void {
  let entity = new AgentSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.agent = event.params.agent
  entity.percentage = event.params.percentage

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDueDateChanged(event: DueDateChangedEvent): void {
  let entity = new DueDateChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.newDueDate = event.params.newDueDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsManagerSet(event: FundsManagerSetEvent): void {
  let entity = new FundsManagerSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fundsManager = event.params.fundsManager

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

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentMade(event: PaymentMadeEvent): void {
  let entity = new PaymentMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRentDistributed(event: RentDistributedEvent): void {
  let entity = new RentDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.leaseId = event.params.leaseId
  entity.lessorAmount = event.params.lessorAmount
  entity.agentAmount = event.params.agentAmount
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

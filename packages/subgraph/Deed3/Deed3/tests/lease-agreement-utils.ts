import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
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
} from "../generated/LeaseAgreement/LeaseAgreement"

export function createLeaseAgentRemovedEvent(
  leaseId: BigInt,
  timestamp: BigInt
): LeaseAgentRemoved {
  let leaseAgentRemovedEvent = changetype<LeaseAgentRemoved>(newMockEvent())

  leaseAgentRemovedEvent.parameters = new Array()

  leaseAgentRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseAgentRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseAgentRemovedEvent
}

export function createLeaseAgentSetEvent(
  leaseId: BigInt,
  agent: Address,
  percentage: BigInt,
  timestamp: BigInt
): LeaseAgentSet {
  let leaseAgentSetEvent = changetype<LeaseAgentSet>(newMockEvent())

  leaseAgentSetEvent.parameters = new Array()

  leaseAgentSetEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseAgentSetEvent.parameters.push(
    new ethereum.EventParam("agent", ethereum.Value.fromAddress(agent))
  )
  leaseAgentSetEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )
  leaseAgentSetEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseAgentSetEvent
}

export function createLeaseCreatedEvent(
  leaseId: BigInt,
  lease: ethereum.Tuple,
  timestamp: BigInt
): LeaseCreated {
  let leaseCreatedEvent = changetype<LeaseCreated>(newMockEvent())

  leaseCreatedEvent.parameters = new Array()

  leaseCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseCreatedEvent.parameters.push(
    new ethereum.EventParam("lease", ethereum.Value.fromTuple(lease))
  )
  leaseCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseCreatedEvent
}

export function createLeaseDepositSubmitedEvent(
  leaseId: BigInt,
  amount: BigInt,
  timestamp: BigInt
): LeaseDepositSubmited {
  let leaseDepositSubmitedEvent = changetype<LeaseDepositSubmited>(
    newMockEvent()
  )

  leaseDepositSubmitedEvent.parameters = new Array()

  leaseDepositSubmitedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseDepositSubmitedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  leaseDepositSubmitedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseDepositSubmitedEvent
}

export function createLeaseDueDateChangedEvent(
  leaseId: BigInt,
  newDueDate: BigInt,
  timestamp: BigInt
): LeaseDueDateChanged {
  let leaseDueDateChangedEvent = changetype<LeaseDueDateChanged>(newMockEvent())

  leaseDueDateChangedEvent.parameters = new Array()

  leaseDueDateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseDueDateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newDueDate",
      ethereum.Value.fromUnsignedBigInt(newDueDate)
    )
  )
  leaseDueDateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseDueDateChangedEvent
}

export function createLeaseExtendedEvent(
  leaseId: BigInt,
  endDate: BigInt,
  rentAmount: BigInt,
  extensionCount: BigInt,
  timestamp: BigInt
): LeaseExtended {
  let leaseExtendedEvent = changetype<LeaseExtended>(newMockEvent())

  leaseExtendedEvent.parameters = new Array()

  leaseExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "endDate",
      ethereum.Value.fromUnsignedBigInt(endDate)
    )
  )
  leaseExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "rentAmount",
      ethereum.Value.fromUnsignedBigInt(rentAmount)
    )
  )
  leaseExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "extensionCount",
      ethereum.Value.fromUnsignedBigInt(extensionCount)
    )
  )
  leaseExtendedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseExtendedEvent
}

export function createLeaseFundsManagerSetEvent(
  fundsManager: Address,
  timestamp: BigInt
): LeaseFundsManagerSet {
  let leaseFundsManagerSetEvent = changetype<LeaseFundsManagerSet>(
    newMockEvent()
  )

  leaseFundsManagerSetEvent.parameters = new Array()

  leaseFundsManagerSetEvent.parameters.push(
    new ethereum.EventParam(
      "fundsManager",
      ethereum.Value.fromAddress(fundsManager)
    )
  )
  leaseFundsManagerSetEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseFundsManagerSetEvent
}

export function createLeasePaymentMadeEvent(
  leaseId: BigInt,
  amount: BigInt,
  unclaimedRentAmount: BigInt,
  timestamp: BigInt
): LeasePaymentMade {
  let leasePaymentMadeEvent = changetype<LeasePaymentMade>(newMockEvent())

  leasePaymentMadeEvent.parameters = new Array()

  leasePaymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leasePaymentMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  leasePaymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "unclaimedRentAmount",
      ethereum.Value.fromUnsignedBigInt(unclaimedRentAmount)
    )
  )
  leasePaymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leasePaymentMadeEvent
}

export function createLeasePaymentTokenSetEvent(
  paymentToken: Address,
  timestamp: BigInt
): LeasePaymentTokenSet {
  let leasePaymentTokenSetEvent = changetype<LeasePaymentTokenSet>(
    newMockEvent()
  )

  leasePaymentTokenSetEvent.parameters = new Array()

  leasePaymentTokenSetEvent.parameters.push(
    new ethereum.EventParam(
      "paymentToken",
      ethereum.Value.fromAddress(paymentToken)
    )
  )
  leasePaymentTokenSetEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leasePaymentTokenSetEvent
}

export function createLeaseRentDistributedEvent(
  leaseId: BigInt,
  lessorAmount: BigInt,
  agentAmount: BigInt,
  distributableDate: BigInt,
  timestamp: BigInt
): LeaseRentDistributed {
  let leaseRentDistributedEvent = changetype<LeaseRentDistributed>(
    newMockEvent()
  )

  leaseRentDistributedEvent.parameters = new Array()

  leaseRentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseRentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "lessorAmount",
      ethereum.Value.fromUnsignedBigInt(lessorAmount)
    )
  )
  leaseRentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "agentAmount",
      ethereum.Value.fromUnsignedBigInt(agentAmount)
    )
  )
  leaseRentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "distributableDate",
      ethereum.Value.fromUnsignedBigInt(distributableDate)
    )
  )
  leaseRentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseRentDistributedEvent
}

export function createLeaseTerminatedEvent(
  leaseId: BigInt,
  timestamp: BigInt
): LeaseTerminated {
  let leaseTerminatedEvent = changetype<LeaseTerminated>(newMockEvent())

  leaseTerminatedEvent.parameters = new Array()

  leaseTerminatedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  leaseTerminatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return leaseTerminatedEvent
}

import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AgentRemoved,
  AgentSet,
  DueDateChanged,
  FundsManagerSet,
  LeaseCreated,
  LeaseTerminated,
  PaymentMade,
  RentDistributed
} from "../generated/LeaseAgreement/LeaseAgreement"

export function createAgentRemovedEvent(leaseId: BigInt): AgentRemoved {
  let agentRemovedEvent = changetype<AgentRemoved>(newMockEvent())

  agentRemovedEvent.parameters = new Array()

  agentRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )

  return agentRemovedEvent
}

export function createAgentSetEvent(
  leaseId: BigInt,
  agent: Address,
  percentage: BigInt
): AgentSet {
  let agentSetEvent = changetype<AgentSet>(newMockEvent())

  agentSetEvent.parameters = new Array()

  agentSetEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  agentSetEvent.parameters.push(
    new ethereum.EventParam("agent", ethereum.Value.fromAddress(agent))
  )
  agentSetEvent.parameters.push(
    new ethereum.EventParam(
      "percentage",
      ethereum.Value.fromUnsignedBigInt(percentage)
    )
  )

  return agentSetEvent
}

export function createDueDateChangedEvent(
  leaseId: BigInt,
  newDueDate: BigInt
): DueDateChanged {
  let dueDateChangedEvent = changetype<DueDateChanged>(newMockEvent())

  dueDateChangedEvent.parameters = new Array()

  dueDateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  dueDateChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newDueDate",
      ethereum.Value.fromUnsignedBigInt(newDueDate)
    )
  )

  return dueDateChangedEvent
}

export function createFundsManagerSetEvent(
  fundsManager: Address
): FundsManagerSet {
  let fundsManagerSetEvent = changetype<FundsManagerSet>(newMockEvent())

  fundsManagerSetEvent.parameters = new Array()

  fundsManagerSetEvent.parameters.push(
    new ethereum.EventParam(
      "fundsManager",
      ethereum.Value.fromAddress(fundsManager)
    )
  )

  return fundsManagerSetEvent
}

export function createLeaseCreatedEvent(leaseId: BigInt): LeaseCreated {
  let leaseCreatedEvent = changetype<LeaseCreated>(newMockEvent())

  leaseCreatedEvent.parameters = new Array()

  leaseCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )

  return leaseCreatedEvent
}

export function createLeaseTerminatedEvent(leaseId: BigInt): LeaseTerminated {
  let leaseTerminatedEvent = changetype<LeaseTerminated>(newMockEvent())

  leaseTerminatedEvent.parameters = new Array()

  leaseTerminatedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )

  return leaseTerminatedEvent
}

export function createPaymentMadeEvent(
  leaseId: BigInt,
  amount: BigInt
): PaymentMade {
  let paymentMadeEvent = changetype<PaymentMade>(newMockEvent())

  paymentMadeEvent.parameters = new Array()

  paymentMadeEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  paymentMadeEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return paymentMadeEvent
}

export function createRentDistributedEvent(
  leaseId: BigInt,
  lessorAmount: BigInt,
  agentAmount: BigInt,
  timestamp: BigInt
): RentDistributed {
  let rentDistributedEvent = changetype<RentDistributed>(newMockEvent())

  rentDistributedEvent.parameters = new Array()

  rentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "leaseId",
      ethereum.Value.fromUnsignedBigInt(leaseId)
    )
  )
  rentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "lessorAmount",
      ethereum.Value.fromUnsignedBigInt(lessorAmount)
    )
  )
  rentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "agentAmount",
      ethereum.Value.fromUnsignedBigInt(agentAmount)
    )
  )
  rentDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return rentDistributedEvent
}

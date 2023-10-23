import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  FundsStored,
  FundsWithdrawn
} from "../generated/FundsManager/FundsManager"

export function createFundsStoredEvent(
  id: BigInt,
  token: Address,
  amount: BigInt,
  sender: Address,
  caller: Address,
  newBalance: BigInt
): FundsStored {
  let fundsStoredEvent = changetype<FundsStored>(newMockEvent())

  fundsStoredEvent.parameters = new Array()

  fundsStoredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  fundsStoredEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  fundsStoredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsStoredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  fundsStoredEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  fundsStoredEvent.parameters.push(
    new ethereum.EventParam(
      "newBalance",
      ethereum.Value.fromUnsignedBigInt(newBalance)
    )
  )

  return fundsStoredEvent
}

export function createFundsWithdrawnEvent(
  id: BigInt,
  token: Address,
  amount: BigInt,
  destination: Address,
  caller: Address,
  newBalance: BigInt
): FundsWithdrawn {
  let fundsWithdrawnEvent = changetype<FundsWithdrawn>(newMockEvent())

  fundsWithdrawnEvent.parameters = new Array()

  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "destination",
      ethereum.Value.fromAddress(destination)
    )
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )
  fundsWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "newBalance",
      ethereum.Value.fromUnsignedBigInt(newBalance)
    )
  )

  return fundsWithdrawnEvent
}

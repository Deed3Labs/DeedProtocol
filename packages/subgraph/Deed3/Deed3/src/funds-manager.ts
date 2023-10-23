import {
  FundsStored as FundsStoredEvent,
  FundsWithdrawn as FundsWithdrawnEvent
} from "../generated/FundsManager/FundsManager"
import { FundsStored, FundsWithdrawn } from "../generated/schema"

export function handleFundsStored(event: FundsStoredEvent): void {
  let entity = new FundsStored(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.FundsManager_id = event.params.id
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.sender = event.params.sender
  entity.caller = event.params.caller
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFundsWithdrawn(event: FundsWithdrawnEvent): void {
  let entity = new FundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.FundsManager_id = event.params.id
  entity.token = event.params.token
  entity.amount = event.params.amount
  entity.destination = event.params.destination
  entity.caller = event.params.caller
  entity.newBalance = event.params.newBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

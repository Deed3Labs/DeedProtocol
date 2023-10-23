import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { LeaseAgentRemoved } from "../generated/schema"
import { LeaseAgentRemoved as LeaseAgentRemovedEvent } from "../generated/LeaseAgreement/LeaseAgreement"
import { handleLeaseAgentRemoved } from "../src/lease-agreement"
import { createLeaseAgentRemovedEvent } from "./lease-agreement-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let leaseId = BigInt.fromI32(234)
    let timestamp = BigInt.fromI32(234)
    let newLeaseAgentRemovedEvent = createLeaseAgentRemovedEvent(
      leaseId,
      timestamp
    )
    handleLeaseAgentRemoved(newLeaseAgentRemovedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("LeaseAgentRemoved created and stored", () => {
    assert.entityCount("LeaseAgentRemoved", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "LeaseAgentRemoved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "leaseId",
      "234"
    )
    assert.fieldEquals(
      "LeaseAgentRemoved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timestamp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

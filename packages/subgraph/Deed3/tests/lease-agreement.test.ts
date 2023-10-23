import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AgentRemoved } from "../generated/schema"
import { AgentRemoved as AgentRemovedEvent } from "../generated/LeaseAgreement/LeaseAgreement"
import { handleAgentRemoved } from "../src/lease-agreement"
import { createAgentRemovedEvent } from "./lease-agreement-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let leaseId = BigInt.fromI32(234)
    let newAgentRemovedEvent = createAgentRemovedEvent(leaseId)
    handleAgentRemoved(newAgentRemovedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AgentRemoved created and stored", () => {
    assert.entityCount("AgentRemoved", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AgentRemoved",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "leaseId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { FundsStored } from "../generated/schema";
import { FundsStored as FundsStoredEvent } from "../generated/FundsManager/FundsManager";
import { handleFundsStored } from "../src/funds-manager";
import { createFundsStoredEvent } from "./funds-manager-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    beforeAll(() => {
        let id = BigInt.fromI32(234);
        let token = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        );
        let amount = BigInt.fromI32(234);
        let sender = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        );
        let caller = Address.fromString(
            "0x0000000000000000000000000000000000000001"
        );
        let newBalance = BigInt.fromI32(234);
        let newFundsStoredEvent = createFundsStoredEvent(
            id,
            token,
            amount,
            sender,
            caller,
            newBalance
        );
        handleFundsStored(newFundsStoredEvent);
    });

    afterAll(() => {
        clearStore();
    });

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test("FundsStored created and stored", () => {
        assert.entityCount("FundsStored", 1);

        // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
        assert.fieldEquals(
            "FundsStored",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "token",
            "0x0000000000000000000000000000000000000001"
        );
        assert.fieldEquals(
            "FundsStored",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "amount",
            "234"
        );
        assert.fieldEquals(
            "FundsStored",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "sender",
            "0x0000000000000000000000000000000000000001"
        );
        assert.fieldEquals(
            "FundsStored",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "caller",
            "0x0000000000000000000000000000000000000001"
        );
        assert.fieldEquals(
            "FundsStored",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "newBalance",
            "234"
        );

        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    });
});

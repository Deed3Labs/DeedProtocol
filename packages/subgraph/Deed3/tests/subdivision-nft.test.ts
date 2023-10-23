import {
    assert,
    describe,
    test,
    clearStore,
    beforeAll,
    afterAll,
} from "matchstick-as/assembly/index";
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { handleSubdivisionIpfsDetailsSet } from "../src/subdivision-nft";
import { createIpfsDetailsSetEvent } from "./subdivision-nft-utils";

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
    beforeAll(() => {
        let tokenId = BigInt.fromI32(234);
        let ipfsDetailsHash = Bytes.fromI32(1234567890);
        let newIpfsDetailsSetEvent = createIpfsDetailsSetEvent(
            tokenId,
            ipfsDetailsHash
        );
        handleSubdivisionIpfsDetailsSet(newIpfsDetailsSetEvent);
    });

    afterAll(() => {
        clearStore();
    });

    // For more test scenarios, see:
    // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

    test("SubdivisionIpfsDetailsSet created and stored", () => {
        assert.entityCount("IpfsDetailsSet", 1);

        // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
        assert.fieldEquals(
            "IpfsDetailsSet",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "tokenId",
            "234"
        );
        assert.fieldEquals(
            "IpfsDetailsSet",
            "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
            "ipfsDetailsHash",
            "1234567890"
        );

        // More assert options:
        // https://thegraph.com/docs/en/developer/matchstick/#asserts
    });
});

import { TransactionReceipt, decodeEventLog, getEventSelector } from "viem";
import deployedContracts from "~~/contracts/deployedContracts";
import logger from "~~/services/logger.service";

const testChainId: keyof typeof deployedContracts = 1337;
type EventNames<TAbi> = TAbi extends { type: "event"; name: infer TName } ? TName : never;

type ContractAtIndex = (typeof deployedContracts)[typeof testChainId];

export const parseContractEvent = <TContract extends keyof ContractAtIndex>(
  receipt: TransactionReceipt,
  contract: TContract,
  eventName: EventNames<ContractAtIndex[TContract]["abi"][number]>,
) => {
  const eventAbi = deployedContracts[testChainId][contract].abi.find(
    abi => abi.type == "event" && abi.name === eventName,
  );

  if (!eventAbi) {
    throw new Error(
      `Event ${eventName} not found in contract ${contract} for chain ${testChainId}`,
    );
  }
  // const signature = `event ${eventAbi.name}(${eventAbi.inputs
  //   .map((input: any) => {
  //     return `${input.type} ${input.name}`;
  //   })
  //   .join(",")})`;

  const topic = getEventSelector(eventAbi as any);

  const log = receipt.logs.find(log => log.topics[0] === topic);

  if (!log) {
    logger.error(`Event ${eventName} not found in receipt`);
    return null;
  }

  const parsedLog = decodeEventLog({
    abi: deployedContracts[testChainId][contract].abi,
    data: log.data as any,
    topics: [topic],
  });

  return parsedLog.args as Record<string, any>;
};

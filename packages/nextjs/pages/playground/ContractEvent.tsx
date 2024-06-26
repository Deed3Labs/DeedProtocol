import { ExtractAbiEventNames } from "abitype";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";
import { ContractAbi, ContractName } from "~~/utils/scaffold-eth/contract";

interface Props<
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
> {
  contractName: TContractName;
  eventName: TEventName;
  search?: string;
}

const ContractEvent = <
  TContractName extends ContractName,
  TEventName extends ExtractAbiEventNames<ContractAbi<TContractName>>,
>({
  eventName,
  contractName,
  search,
}: Props<TContractName, TEventName>) => {
  const { data, isLoading, error } = useScaffoldEventHistory({
    contractName,
    eventName,
    fromBlock: BigInt(Number(process.env.NEXT_PUBLIC_DEPLOY_BLOCK) || 0),
    blockData: true,
  });
  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data?.length ? (
            <div>
              <div className="text-xl">{eventName}</div>
              <div className="mb-4 mt-1 p-4 border rounded-lg w-full flex flex-col gap-4">
                {data
                  .filter(x => {
                    if (search) {
                      let argsString;
                      try {
                        argsString = JSON.stringify(x.args);
                      } catch (e) {}
                      return (
                        x.log.blockNumber.toString() === search.trim() ||
                        x.log.transactionHash.includes(search) ||
                        x.log.topics.find((topic: any) => topic.includes(search)) ||
                        (argsString
                          ? argsString.includes(search)
                          : (x.args as any).toString().includes(search))
                      );
                    }
                    return true;
                  })
                  .map(x => (
                    <div
                      key={contractName + x.log.transactionHash + x.log.topics}
                      className="flex flex-col gap-4 border rounded-lg p-2"
                    >
                      <div className="text-base">
                        {error && <div>Error: {error}</div>}
                        <div>
                          <span className="font-bold">Block:</span> {x.block.number?.toString()}
                        </div>
                        <div>
                          <span className="font-bold">Transaction:</span> {x.log.transactionHash}
                        </div>
                        <div>
                          <span className="font-bold">Topics:</span>
                          <ul>
                            {x.log.topics.map((topic: any, i: number) => (
                              <li key={i} className="ml-2">
                                - {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-bold">Args:</span>
                          <ul>
                            {Object.keys(x.args)
                              .filter(key => !Number.isInteger(+key))
                              .map((key: string) => {
                                return (
                                  <li
                                    key={contractName + x.log.transactionHash + x.log.topics + key}
                                    className="ml-2"
                                  >
                                    - {key}:{" "}
                                    {(x.args[key as any] as any).toString() === "[object Object]"
                                      ? Object.keys(x.args[key as any] as any).map(
                                          (argKey: string) => (
                                            <li key={argKey} className="ml-2">
                                              - {argKey}:{" "}
                                              {(x.args[key as any] as any)[argKey as any]}
                                            </li>
                                          ),
                                        )
                                      : (x.args[key as any] as any).toString()}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};
export default ContractEvent;

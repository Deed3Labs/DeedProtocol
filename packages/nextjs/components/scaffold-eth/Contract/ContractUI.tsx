import { useReducer, useState } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { ArrowDownIcon } from "@dynamic-labs/sdk-react-core";
import { Spinner } from "~~/components/assets/Spinner";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";

interface ContractUIProps {
  contractName: ContractName;
  className?: string;
}

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [readCollapsed, setReadCollapsed] = useState(false);
  const [writeCollapsed, setWriteCollapsed] = useState(false);
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(
    value => !value,
    false,
  );
  const configuredNetwork = getTargetNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } =
    useDeployedContractInfo(contractName);
  const networkColor = useNetworkColor();

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <Spinner />
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        {`No contract found by the name of "${contractName}" on chain "${configuredNetwork.name}"!`}
      </p>
    );
  }

  const scrollToEvents = () => {
    const scrollView = window;
    scrollView?.scrollTo({ top: document.getElementById("Events")?.offsetTop, behavior: "auto" });
  };

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-6 px-6 lg:px-10 lg:gap-12 w-full max-w-7xl my-0${className}`}
    >
      <div className="col-span-6 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-base-100 border-base-300 border shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 space-y-1 py-4">
            <div className="flex">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address address={deployedContractData.address} />
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">Balance:</span>
                  <Balance
                    address={deployedContractData.address}
                    className="px-0 h-1.5 min-h-[0.375rem]"
                  />
                </div>
              </div>
            </div>
            {configuredNetwork && (
              <p className="my-0 text-sm">
                <span className="font-bold">Network</span>:{" "}
                <span style={{ color: networkColor }}>{configuredNetwork.name}</span>
              </p>
            )}
          </div>
          <div className="bg-base-300 rounded-3xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
          <div className="bg-base-300 rounded-1xl px-6 lg:px-8 py-4 shadow-lg shadow-base-300">
            <button
              className={`btn bg-base-300 hover:bg-secondary font-light btn-sm ml-8`}
              onClick={() => scrollToEvents()}
            >
              Events <ArrowDownIcon className="h-4" />
            </button>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="z-10">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p
                    className="my-0 text-sm cursor-pointer"
                    onClick={() => setReadCollapsed(x => !x)}
                  >
                    Read {readCollapsed ? "+" : "-"}
                  </p>
                </div>
              </div>
              {!readCollapsed && (
                <div className="p-5 divide-y divide-base-300">
                  <ContractReadMethods deployedContractData={deployedContractData} />
                </div>
              )}
            </div>
          </div>
          <div className="z-10 mt-8">
            <div className="bg-base-100 rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg shadow-base-300">
                <div className="flex items-center justify-center space-x-2">
                  <p
                    className="my-0 text-sm cursor-pointer"
                    onClick={() => setWriteCollapsed(x => !x)}
                  >
                    Write {writeCollapsed ? "+" : "-"}
                  </p>
                </div>
              </div>
              {!writeCollapsed && (
                <div className="p-5 divide-y divide-base-300">
                  <ContractWriteMethods
                    deployedContractData={deployedContractData}
                    onChange={triggerRefreshDisplayVariables}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

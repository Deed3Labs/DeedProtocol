import { useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import ContractEvent from "../playground/ContractEvent";
import { Abi, AbiEvent } from "abitype";
import { useLocalStorage } from "usehooks-ts";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/components/scaffold-eth";
import useIsAdmin from "~~/hooks/contracts/access-manager/useIdAdmin.hook";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { sleepAsync } from "~~/utils/sleepAsync";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

const AdminPanel = ({ router }: WithRouterProps) => {
  const isAdmin = useIsAdmin();
  const [searchEventValue, setSearchEventValue] = useState<string>();

  const [contractEvents, setContractEvents] = useState<string[]>([]);

  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  useEffect(() => {
    fetchContractEvents(selectedContract);
  }, [selectedContract]);

  const fetchContractEvents = async (contractName: ContractName) => {
    setContractEvents([]);
    await sleepAsync(100);
    const abi = contractsData[contractName].abi as Abi;
    const events = abi.filter(x => x.type === "event") as AbiEvent[];
    setContractEvents(events.map(x => x.name));
  };

  return (
    <div className="container pt-10">
      {isAdmin ? (
        <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
          {contractNames.length === 0 ? (
            <p className="text-3xl mt-14">No contracts found!</p>
          ) : (
            <>
              {contractNames.length > 1 && (
                <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                  {contractNames.map(contractName => (
                    <button
                      className={`btn btn-secondary btn-sm font-light  ${
                        contractName === selectedContract
                          ? "hover:bg-secondary no-animation"
                          : "bg-base-300 hover:border-transparent"
                      }`}
                      key={contractName}
                      onClick={() => setSelectedContract(contractName)}
                    >
                      {contractName}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <ContractUI contractName={selectedContract} />
                <div id="Events" className="text-4xl flex items-center gap-2 mt-4 mb-2">
                  Events
                  <button
                    className="btn btn-sm"
                    onClick={() => fetchContractEvents(selectedContract)}
                  >
                    <ArrowPathIcon className="h-6" />
                  </button>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full max-w-7xl"
                  placeholder="Search events"
                  value={searchEventValue}
                  onChange={e => setSearchEventValue(e.target.value)}
                />
                {contractEvents.map(event => (
                  <ContractEvent
                    key={event}
                    contractName={selectedContract}
                    eventName={event as any}
                    search={searchEventValue}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <div className="text-2xl leading-10">Restricted</div>
          <div className="text-base font-normal leading-normal">
            This section is restricted to admin users only.
          </div>
          <button
            onClick={() => router.push("/property-explorer")}
            className="btn btn-lg bg-gray-600"
          >
            Go back to explorer
          </button>
        </div>
      )}
    </div>
  );
};

export default withRouter(AdminPanel);

import { useState } from "react";
import { withRouter } from "next/router";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import logger from "~~/services/logger.service";

const adminRole = `0x${Array(64).join("0")}` as `0x${string}`;
const Page = () => {
  const [walletToGrant, setWalletToGrant] = useState<string>();
  const { primaryWallet } = useDynamicContext();

  const { writeAsync: grantValidatorAsync } = useScaffoldContractWrite({
    contractName: "AccessManager",
    functionName: "addValidator",
    args: [undefined],
  });

  const { writeAsync: grantRoleAsync } = useScaffoldContractWrite({
    contractName: "AccessManager",
    functionName: "grantRole",
    args: [undefined, undefined],
  });

  const { data: isAdmin } = useScaffoldContractRead({
    contractName: "AccessManager",
    functionName: "hasAdminRole",
    args: [primaryWallet?.address],
  });

  const onGrantValidatorSubmit = async () => {
    logger.debug("Granting validator", walletToGrant);
    await grantValidatorAsync({
      args: [walletToGrant],
    });
  };

  const onGrantAdminSubmit = async () => {
    logger.debug("Granting admin", walletToGrant);

    await grantRoleAsync({
      args: [adminRole, walletToGrant],
    });
  };

  return (
    <div className="container pt-10">
      {isAdmin ? (
        <div className="flex flex-col gap-8">
          <div className="w-full flex flex-col align-middle">
            <h1 className="text-xl">Grant validator</h1>
            <div className="w-full">
              <input
                className="input input-lg input-bordered join-item w-[470px]"
                type="text"
                placeholder="Wallet to grant"
                onChange={ev => setWalletToGrant(ev.target.value)}
              />
              <button
                className="btn btn-lg btn-outline btn-secondary join-item"
                onClick={onGrantValidatorSubmit}
              >
                Submit
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col align-middle">
            <h1 className="text-xl">Grant admin</h1>
            <div className="w-full">
              <input
                className="input input-lg input-bordered join-item w-[470px]"
                type="text"
                placeholder="Wallet to grant"
                onChange={ev => setWalletToGrant(ev.target.value)}
              />
              <button
                className="btn btn-lg btn-outline btn-secondary join-item"
                onClick={onGrantAdminSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 mt-6">
          <div className="text-2xl leading-10">Restricted</div>
          <div className="text-base font-normal leading-normal">
            Thi section is restricted to admin users only.
          </div>
        </div>
      )}
    </div>
  );
};

export default withRouter(Page);

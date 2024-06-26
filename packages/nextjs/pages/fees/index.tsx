import { ChangeEvent, useEffect, useState } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import useFeesClient from "~~/clients/fees.client";
import TextInput from "~~/components/inputs/TextInput";
import useIsAdmin from "~~/hooks/contracts/access-manager/useIdAdmin.hook";
import { LightChangeEvent } from "~~/models/light-change-event";
import logger from "~~/services/logger.service";
import { notification } from "~~/utils/scaffold-eth";

const FeesPanel = ({ router }: WithRouterProps) => {
  const isAdmin = useIsAdmin();
  const { fees, client } = useFeesClient();

  useEffect(() => {
    if (fees) {
      const feesState: Record<string, string> = {};
      Object.keys(fees).map(key => {
        const keyIn = key as keyof typeof fees;
        if (keyIn in fees) feesState[key] = JSON.stringify(fees[keyIn]);
      });
      setFeesState(feesState);
    }
  }, [fees]);

  const [feesState, setFeesState] = useState<Record<keyof typeof fees, string>>();

  const handleChange = (
    ev: LightChangeEvent<Record<string, string>> | ChangeEvent<HTMLInputElement>,
  ) => {
    const updatedValue = {
      ...feesState,
      ["target" in ev ? ev.target.name : ev.name]:
        "target" in ev ? ev.target.checked.toString() : ev.value,
    };
    // @ts-ignore
    setFeesState?.(updatedValue);
  };

  const handleSave = async () => {
    if (feesState) {
      const notif = notification.info("Saving...", { duration: 0 });
      const ignoreFields = ["createdOn", "_id", "chainId"];
      Object.keys(feesState)
        .filter(x => !ignoreFields.includes(x))
        .map(key => {
          const keyIn = key as keyof typeof feesState & keyof typeof fees;
          if (keyIn in feesState)
            try {
              if (feesState[keyIn] === "") {
                fees[keyIn] = undefined;
              } else {
                fees[keyIn] = JSON.parse(feesState[keyIn].replaceAll("'", '"'));
              }
            } catch (error) {
              notification.error(`Failed to parse ${keyIn} with value ${feesState[keyIn]}`);
              logger.error(`Failed to parse ${keyIn} with value ${feesState[keyIn]}`, error);
            }
        });
      notification.remove(notif);
      if ((await client.saveFees(fees)) === "Saved") {
        notification.success("Fees saved successfully");
      } else {
        notification.error("Failed to save fees");
      }
    }
  };

  return (
    <div className="container pt-10">
      {isAdmin ? (
        <div className="flex flex-col gap-y-6 w-full">
          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Global</h1>
            <TextInput
              large={false}
              label="Marketplace Fees"
              name="global_marketplaceFees"
              value={feesState?.global_marketplaceFees}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="global_automatedRoyalties">Automated Royalties</label>
              <input
                id="global_automatedRoyalties"
                type="checkbox"
                className="checkbox"
                name="global_automatedRoyalties"
                checked={feesState?.global_automatedRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="global_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="global_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="global_normalizeRoyalties"
                checked={feesState?.global_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">List</h1>
            <TextInput
              large={false}
              label="Fees Bps"
              name="list_feesBps"
              value={feesState?.list_feesBps}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="list_enableOnChainRoyalties">Enable Onchain Royalties</label>
              <input
                id="list_enableOnChainRoyalties"
                type="checkbox"
                className="checkbox"
                name="list_enableOnChainRoyalties"
                checked={feesState?.list_enableOnChainRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="list_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="list_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="list_normalizeRoyalties"
                checked={feesState?.list_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Edit List</h1>
            <div className="flex items-center justify-between">
              <label htmlFor="editList_enableOnChainRoyalties">Enable Onchain Royalties</label>
              <input
                id="editList_enableOnChainRoyalties"
                type="checkbox"
                className="checkbox"
                name="editList_enableOnChainRoyalties"
                checked={feesState?.editList_enableOnChainRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="editList_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="editList_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="editList_normalizeRoyalties"
                checked={feesState?.editList_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Cancel listing</h1>
            <div className="flex items-center justify-between">
              <label htmlFor="cancelList_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="cancelList_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="cancelList_normalizeRoyalties"
                checked={feesState?.cancelList_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Buy</h1>
            <TextInput
              large={false}
              label="Fees On Top Bps"
              name="buy_feesOnTopBps"
              value={feesState?.buy_feesOnTopBps}
              onChange={handleChange}
            />
            <TextInput
              large={false}
              label="Fees On Top Usd"
              name="buy_feesOnTopUsd"
              value={feesState?.buy_feesOnTopUsd}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="buy_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="buy_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="buy_normalizeRoyalties"
                checked={feesState?.buy_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Bid</h1>
            <TextInput
              large={false}
              label="Fees Bps"
              name="bid_feesBps"
              value={feesState?.bid_feesBps}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="bid_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="bid_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="bid_normalizeRoyalties"
                checked={feesState?.bid_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Edit Bid</h1>
            <div className="flex items-center justify-between">
              <label htmlFor="editBid_enableOnChainRoyalties">Enable Onchain Royalties</label>
              <input
                id="editBid_enableOnChainRoyalties"
                name="editBid_enableOnChainRoyalties"
                type="checkbox"
                className="checkbox"
                checked={feesState?.editBid_enableOnChainRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="editBid_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="editBid_normalizeRoyalties"
                name="editBid_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                checked={feesState?.editBid_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Accept bid</h1>
            <TextInput
              large={false}
              label="Fees On Top Bps"
              name="acceptBid_feesOnTopBps"
              value={feesState?.acceptBid_feesOnTopBps}
              onChange={handleChange}
            />
            <div className="flex items-center justify-between">
              <label htmlFor="acceptBid_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="acceptBid_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="acceptBid_normalizeRoyalties"
                checked={feesState?.acceptBid_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t p-4">
            <h1 className="text-lg uppercase mx-auto">Cancel Bid</h1>
            <div className="flex items-center justify-between">
              <label htmlFor="cancelBid_normalizeRoyalties">Normalize Royalties</label>
              <input
                id="cancelBid_normalizeRoyalties"
                type="checkbox"
                className="checkbox"
                name="cancelBid_normalizeRoyalties"
                checked={feesState?.cancelBid_normalizeRoyalties === "true"}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="btn btn-lg bg-gray-600 mx-auto mb-4" onClick={handleSave}>
            Save
          </button>
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

export default withRouter(FeesPanel);

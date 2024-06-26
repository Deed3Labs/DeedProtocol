import { useState } from "react";
import { Address } from "./scaffold-eth";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import TextInput from "~~/components/inputs/TextInput";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useContractAddress from "~~/hooks/useContractAddress";
import { DeedDetailsModel, DeedInfoModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";
import { IconInfoSquare } from "~~/styles/Icons";

interface Props {
  deedData: DeedInfoModel;
  isOwner: boolean;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  onSave: () => void;
}
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const OverviewDeedInformations = ({ deedData, isOwner, onChange, onSave }: Props) => {
  const [isEditMode, setEditMode] = useState(false);
  const isValidator = useIsValidator();
  const deedNFTContractAddress = useContractAddress("DeedNFT");
  const handleChange = (ev: LightChangeEvent<DeedDetailsModel>) => {
    const updatedValue = { ...(deedData.deedDetails ?? {}), [ev.name]: ev.value };
    onChange?.({
      name: "deedDetails",
      value: updatedValue,
    });
  };

  const handleViewModeToggle = () => {
    if (isEditMode) {
      onSave();
    }

    setEditMode(!isEditMode);
  };

  return (
    <>
      {deedData && (
        <div className={`w-full `}>
          <div className="flex flex-col border border-white border-opacity-10">
            <div className="flex flex-row justify-between items-center bg-base-300">
              <div className=" w-full font-normal text-[10px] sm:text-xs uppercase p-4 py-8 flex items-center gap-2 tracking-widest">
                {IconInfoSquare} Deed Information
              </div>
              {(isOwner || isValidator) && !isEditMode !== undefined && (
                <div className="pr-2">
                  <button className="btn btn-link" onClick={handleViewModeToggle}>
                    {!isEditMode ? <PencilIcon className="w-4" /> : <CheckIcon className="w-4" />}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col p-4 gap-4">
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">Deed Type</div>
                {isEditMode ? (
                  <TextInput
                    name="deedType"
                    className="input input-sm flex flex-row"
                    value={deedData.deedDetails?.deedType}
                    onChange={handleChange}
                  />
                ) : (
                  <div>{deedData.deedDetails?.deedType}</div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">Parcel Number</div>
                {isEditMode ? (
                  <TextInput
                    name="parcelNumber"
                    className="input input-sm flex flex-row"
                    value={deedData.deedDetails?.parcelNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <div>{deedData.deedDetails?.parcelNumber}</div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">Tax Assessed Value</div>
                {isEditMode ? (
                  <div className="flex flex-row items-center">
                    $
                    <TextInput
                      name="taxAssessedValue"
                      className="input input-sm flex flex-row"
                      value={deedData.deedDetails?.taxAssessedValue}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div>
                    {Number.isNaN(+deedData.deedDetails?.taxAssessedValue)
                      ? deedData.deedDetails?.taxAssessedValue
                      : formatter.format(+deedData.deedDetails?.taxAssessedValue ?? 0)}
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">GPS Coordinates</div>
                <div>
                  {deedData.propertyDetails.propertyLatitude},{" "}
                  {deedData.propertyDetails.propertyLongitude}
                </div>
              </div>
              <hr className=" border-white opacity-10 w-full" />
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">Contract</div>
                <div>
                  <Address address={deedNFTContractAddress} format="short" />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="text-sm text-[#8c8e97]">Transfer Fee</div>
                <div>2.5%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewDeedInformations;

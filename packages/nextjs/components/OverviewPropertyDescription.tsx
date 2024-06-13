import { ChangeEvent, useState } from "react";
import PropertyDetails from "./OverviewPropertyDetails";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import useIsOwner from "~~/hooks/useIsOwner.hook";
import { DeedInfoModel, PropertyDetailsModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  deedData: DeedInfoModel;
  onRefresh: () => void;
  onSave: () => void;
  onChange: (ev: LightChangeEvent<DeedInfoModel>) => void;
}

const OverviewPropertyDescription = ({ deedData, onRefresh, onSave, onChange }: Props) => {
  const [viewMode, setViewMode] = useState(true);
  const isOwner = useIsOwner(deedData);
  const isValidator = useIsValidator();
  const [isReadMore, setReadMore] = useState(false);

  const handleDescriptionChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    const propertyDetails: PropertyDetailsModel = {
      ...deedData.propertyDetails,
      propertyDescription: ev.target.value,
    };
    onChange?.({
      name: "propertyDetails",
      value: propertyDetails,
    });
  };

  const handleViewModeToggle = () => {
    if (!viewMode) {
      onSave();
    }

    setViewMode(!viewMode);
  };

  return (
    <div className="flex flex-row border border-white border-opacity-10 p-5 sm:p-6 gap-6 flex-wrap">
      {deedData?.propertyDetails && (
        <>
          <div className="flex flex-col gap-5 mt-7 sm:mt-1 flex-grow justify-center">
            <div className="flex flex-row items-center">
              <div className="text-[10px] font-normal text-zinc-400 uppercase tracking-widest">
                {"BUYER'S AGENT FEE"}
              </div>
              <div className="ml-2 h-7 badge bg-[#ffdc19] text-[11px] font-normal text-primary-content capitalize rounded-xl">
                1.5%
              </div>
            </div>

            <div className="text-5xl font-['Coolvetica'] font-extra-condensed font-bold uppercase">
              {deedData.propertyDetails.propertyAddress}, {deedData.propertyDetails.propertyCity},{" "}
              {deedData.propertyDetails.propertyState}
            </div>

            <hr className="my-0 border-white opacity-10" />
            <div className="flex flex-row justify-between items-center">
              <div className="pl-0 pb-2 text-[11px] sm:text-[12px] font-normal uppercase tracking-widest">
                Property description
              </div>
              {(isOwner || isValidator) && viewMode !== undefined && (
                <button className="btn btn-link" onClick={handleViewModeToggle}>
                  {viewMode ? <PencilIcon className="w-4" /> : <CheckIcon className="w-4" />}
                </button>
              )}
            </div>
            {viewMode ? (
              <>
                <div className={`${isReadMore ? "" : "line-clamp-5"}`}>
                  {deedData.propertyDetails.propertyDescription ? (
                    deedData.propertyDetails.propertyDescription
                  ) : (
                    <span className="text-gray-500 italic">
                      Please provide a description for your property ...
                    </span>
                  )}
                </div>
                <div
                  className={`flex items-center justify-center w-full ${
                    isReadMore || !deedData.propertyDetails.propertyDescription ? "" : ""
                  }`}
                >
                  <hr className="my-0 border-[#2d2d2d] w-full flex-1" />
                  {!!deedData.propertyDetails.propertyDescription && (
                    <button
                      className="btn btn-lg border-white border-opacity-10 bg-base-300 border-1 font-normal capitalize text-xs tracking-widest"
                      onClick={() => setReadMore(x => !x)}
                    >
                      {isReadMore ? (
                        <>
                          <span>READ LESS</span>
                          <ChevronUpIcon width={16} />
                        </>
                      ) : (
                        <>
                          <span>READ MORE</span>
                          <ChevronDownIcon width={16} />
                        </>
                      )}
                    </button>
                  )}
                  <hr className="my-0 border-[#2d2d2d] w-full flex-1" />
                </div>
              </>
            ) : (
              <textarea
                aria-multiline
                placeholder="Please provide a description for your property"
                onChange={handleDescriptionChange}
                value={deedData.propertyDetails.propertyDescription}
                className="input h-40"
              />
            )}
          </div>
          <PropertyDetails
            onRefresh={onRefresh}
            onSave={onSave}
            propertyDetail={deedData.propertyDetails}
            isOwner={isOwner}
            onChange={onChange}
            noBorders
          />
        </>
      )}
    </div>
  );
};

export default OverviewPropertyDescription;

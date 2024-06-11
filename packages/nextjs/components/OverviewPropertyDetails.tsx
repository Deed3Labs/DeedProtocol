import { useState } from "react";
import { CheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import TextInput from "~~/components/inputs/TextInput";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import { DeedInfoModel, PropertyDetailsModel } from "~~/models/deed-info.model";
import { LightChangeEvent } from "~~/models/light-change-event";

interface Props {
  propertyDetail: PropertyDetailsModel;
  isOwner: boolean;
  onChange?: (ev: LightChangeEvent<DeedInfoModel>) => void;
  onRefresh: () => void;
  onSave: () => void;
  noBorders?: boolean;
}

const PropertyDetails = ({
  propertyDetail,
  isOwner,
  onChange,
  onRefresh: refresh,
  onSave,
  noBorders = false,
}: Props) => {
  const [viewMode, setViewMode] = useState(true);
  const isValidator = useIsValidator();
  const handleChange = (ev: LightChangeEvent<PropertyDetailsModel>) => {
    const updatedValue = { ...propertyDetail, [ev.name]: ev.value };
    onChange?.({
      name: "propertyDetails",
      value: updatedValue,
    });
  };

  const handleViewModeToggle = () => {
    if (!viewMode) {
      onSave();
    }

    setViewMode(!viewMode);
  };

  return (
    <>
      {propertyDetail && (
        <div className={`w-full ${noBorders ? "" : "border border-white border-opacity-10"}`}>
          <div className="flex flex-row justify-between items-center px-0 pt-8">
            <div className="pl-0 pb-4 text-[11px] sm:text-[12px] font-normal uppercase tracking-widest">
              Property Details
            </div>
            {(isOwner || isValidator) && viewMode !== undefined && (
              <button className="btn btn-link" onClick={handleViewModeToggle}>
                {viewMode ? <PencilIcon className="w-4" /> : <CheckIcon className="w-4" />}
              </button>
            )}
          </div>
          <div className="flex flex-row justify-between w-full gap-6 p-0 flex-wrap">
            {/* First col */}
            <div className="flex flex-col flex-grow gap-6">
              <div className="flex flex-row justify-between items-center gap-4 sm:gap-3.5 pb-0 w-full">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Bed / Bath:{" "}
                </div>
                <div className="">
                  {viewMode ? (
                    <>
                      <TextInput
                        className="text-[3.4vw] sm:text-sm h-4"
                        name="propertyBedrooms"
                        value={`${propertyDetail.propertyBedrooms ?? 0} Bed / ${
                          propertyDetail.propertyBathrooms ?? 0
                        } Bath`}
                        placeholder="0"
                        onChange={handleChange}
                        readOnly
                      />
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <TextInput
                        className="text-[3.4vw] sm:text-sm h-4"
                        name="propertyBedrooms"
                        value={propertyDetail.propertyBedrooms}
                        placeholder="0"
                        onChange={handleChange}
                      />
                      <TextInput
                        className="text-[3.6vw] sm:text-sm h-4"
                        name="propertyBathrooms"
                        value={propertyDetail.propertyBathrooms}
                        placeholder="0"
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Lot size:
                </div>
                <TextInput
                  className="text-[3.4vw] sm:text-sm h-4"
                  name="propertySize"
                  value={propertyDetail.propertySize}
                  readOnly={viewMode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Square footage:
                </div>
                <TextInput
                  className="text-[3.4vw] sm:text-sm h-4"
                  name="propertySquareFootage"
                  value={propertyDetail.propertySquareFootage}
                  readOnly={viewMode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col flex-grow gap-6">
              <div className="flex flex-row justify-between items-center gap-3 pb-0 w-full">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Build Year:
                </div>
                <TextInput
                  className="text-[3.4vw] sm:text-sm h-4"
                  name="propertyBuildYear"
                  value={propertyDetail.propertyBuildYear}
                  readOnly={viewMode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Location:
                </div>
                <TextInput
                  className="text-[3.4vw] sm:text-sm h-4"
                  name="propertyCity"
                  value={propertyDetail.propertyCity}
                  readOnly={viewMode}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <div className="text-[3.4vw] sm:text-sm text-zinc-400 font-normal w-full h-4">
                  Property Type:
                </div>
                <TextInput
                  className="text-[3.4vw] sm:text-sm h-4"
                  name="propertyHouseType"
                  value={propertyDetail.propertyHouseType}
                  readOnly={viewMode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 auto-cols-min justify-items-start sm:gap-2 pt-6 sm:pt-6 pb-6 sm:pb-1">
            <button className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2054_765)">
                  <path
                    d="M9 17.5C13.6944 17.5 17.5 13.6944 17.5 9C17.5 4.30558 13.6944 0.5 9 0.5C4.30558 0.5 0.5 4.30558 0.5 9C0.5 13.6944 4.30558 17.5 9 17.5Z"
                    stroke="#A0A0A0"
                  />
                  <path d="M6.5 7.57227V14.0006" stroke="#A0A0A0" />
                  <path d="M9.19922 5.5V11.9284" stroke="#A0A0A0" />
                  <path d="M11.9004 4V10.4284" stroke="#A0A0A0" />
                </g>
                <defs>
                  <clipPath id="clip0_2054_765">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div>MLS Data</div>
            </button>
            <button className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2054_776)">
                  <path
                    d="M1.70557 4.78867L8.9998 0.577351L16.294 4.78867V13.2113L8.9998 17.4227L1.70557 13.2113V4.78867Z"
                    stroke="#A0A0A0"
                  />
                  <path
                    d="M5.16992 11.2113V6.78863L9.00005 4.5773L12.8302 6.78863V11.2113L9.00005 13.4226L5.16992 11.2113Z"
                    stroke="#A0A0A0"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2054_776">
                    <rect width="18" height="18" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div>Disclosures</div>
            </button>
            <button className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2054_786)">
                  <path d="M2 4.5L9 7.5L16 4.5" stroke="#A0A0A0" />
                  <path d="M9 7V17" stroke="#A0A0A0" />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 13.8L9 17L2 13.8V4.2L9 1L16 4.2V13.8Z"
                    stroke="#A0A0A0"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2054_786">
                    <rect width="18" height="18" fill="white" transform="translate(1)" />
                  </clipPath>
                </defs>
              </svg>
              <div>Proof of Title</div>
            </button>
            <button
              className="btn btn-link no-underline text-[2.2vw] sm:text-[12px] text-zinc-400 font-normal uppercase tracking-wide"
              onClick={refresh}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.39 9.82125C15.39 13.05 12.6337 15.8062 9.24748 15.8062C5.86123 15.8062 3.10498 13.05 3.10498 9.82125C3.10498 6.51375 5.86123 3.83625 9.24748 3.83625H12.0037"
                  stroke="#A0A0A0"
                  strokeWidth="0.7875"
                />
                <path
                  d="M8.91016 1.15875L12.6902 3.915L8.91016 6.67125"
                  stroke="#A0A0A0"
                  strokeWidth="0.7875"
                />
              </svg>

              <div>Refresh</div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyDetails;

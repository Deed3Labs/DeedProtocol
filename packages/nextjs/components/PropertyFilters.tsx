import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ExplorerLinks from "./ExplorerLinks";
import PropertyCard from "./PropertyCard";
import TextInput from "./inputs/TextInput";
import Map from "./map";
import { AddressInput } from "./scaffold-eth";
import { useLocalStorage } from "usehooks-ts";
import { MapIcon } from "@heroicons/react/24/outline";
import { MapIcon as MapIconSolid, XMarkIcon } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { PropertyTypeOptions } from "~~/constants";
import { usePropertiesFilter } from "~~/contexts/property-filter.context";
import useIsValidator from "~~/hooks/contracts/access-manager/useIsValidator.hook";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";
import useWallet from "~~/hooks/useWallet";
import { PropertyType } from "~~/models/deed-info.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { PropertyModel } from "~~/models/property.model";

interface Props {
  properties: PropertyModel[];
}

const PropertyFilters = ({ properties }: Props) => {
  const isValidator = useIsValidator();
  const { primaryWallet } = useWallet();
  const [mapOpened, setMapOpened] = useLocalStorage("PropertyFilter.MapOpened", false);
  const [isMoreFilters, setIsMoreFilters] = useState(false);
  const { filter, applyFilter, reset: resetFilter } = usePropertiesFilter();
  const router = useRouter();

  useEffect(() => {
    if (router.query.search) {
      applyFilter({ search: router.query.search as string });
    }
  }, [router.query.search]);

  useKeyboardShortcut(["Enter"], () => {
    applyFilter(filter);
  });

  return (
    <div className="Wrapper flex flex-col space-y-[-20px] sm:space-y-[-16px] w-full mb-4 sm:mb-8">
      <ExplorerLinks />
      <div className="filters">
        <div className="flex flex-row flex-wrap sm:flex-nowrap justify-start items-center gap-2 md:gap-4 w-full">
          <input
            name="Search"
            className="input input-md sm:input-lg border-white border-opacity-10 bg-base-300 text-white/30 text-[12px] sm:text-[16px] py-2 sm:py-0 w-full sm:flex-grow"
            placeholder="Search by City, State, or Zip code"
            value={filter.search}
            onChange={ev => applyFilter({ search: ev.target.value })}
          />
          <button
            className="btn btn-md sm:btn-lg border-white border-opacity-10 bg-base-300 text-[12px] sm:text-[16px] font-normal capitalize items-center gap-2 h-auto"
            onClick={() => setIsMoreFilters(old => !old)}
          >
            <AdjustmentsHorizontalIcon className="h-auto w-4" />
            {isMoreFilters ? "Hide Filters" : "More Filters"}
          </button>
          <select
            className="select select-md sm:select-lg border-white border-opacity-10 text-[12px] sm:text-[16px] flex flex-1"
            value={filter.propertyType}
            onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value={0}>
              Property type
            </option>
            {PropertyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </select>
          <div className="join">
            <button className="join-item btn sm:btn-lg btn-square bg-base-300 border-white border-opacity-10 flex flex-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.75 0.242325C7.92155 0.242325 7.25 0.913897 7.25 1.74232V3.99233C7.25 4.82078 7.92155 5.49233 8.75 5.49233H11C11.8285 5.49233 12.5 4.82078 12.5 3.99233V1.74232C12.5 0.913897 11.8285 0.242325 11 0.242325H8.75ZM8.75 6.99232C7.92155 6.99232 7.25 7.66387 7.25 8.49232V10.7423C7.25 11.5708 7.92155 12.2423 8.75 12.2423H11C11.8285 12.2423 12.5 11.5708 12.5 10.7423V8.49232C12.5 7.66387 11.8285 6.99232 11 6.99232H8.75ZM0.5 8.49232C0.5 7.66387 1.17157 6.99232 2 6.99232H4.25C5.07845 6.99232 5.75 7.66387 5.75 8.49232V10.7423C5.75 11.5708 5.07845 12.2423 4.25 12.2423H2C1.17157 12.2423 0.5 11.5708 0.5 10.7423V8.49232ZM2 0.242325C1.17157 0.242325 0.5 0.913897 0.5 1.74232V3.99233C0.5 4.82078 1.17157 5.49233 2 5.49233H4.25C5.07845 5.49233 5.75 4.82078 5.75 3.99233V1.74232C5.75 0.913897 5.07845 0.242325 4.25 0.242325H2Z"
                  fill="white"
                />
              </svg>
            </button>
            <button
              className="join-item btn sm:btn-lg btn-square bg-base-300 border-white border-opacity-10 flex flex-1"
              onClick={() => setMapOpened(!mapOpened)}
            >
              {mapOpened ? <MapIconSolid className="w-4" /> : <MapIcon className="w-4" />}
            </button>
            <button
              className="ml-2 btn sm:btn-lg btn-square bg-base-300 border-white border-opacity-10 hidden"
              onClick={() => resetFilter()}
            >
              <XMarkIcon className="w-6" />
            </button>
          </div>
        </div>

        {isMoreFilters && (
          <div className="flex flex-grow flex-row flex-wrap justify-start items-center gap-2 md:gap-4 w-full my-4">
            <select
              className="select select-md sm:select-lg border-white border-opacity-10 text-[12px] sm:text-[16px]"
              value={filter.validated}
              disabled={!primaryWallet}
              title={
                primaryWallet
                  ? "Filter by validation status"
                  : "Login to filter by validation status"
              }
              onChange={ev => {
                applyFilter({
                  validated: ev.currentTarget.value as PropertiesFilterModel["validated"],
                });
              }}
            >
              <option value="true">Verified</option>
              {primaryWallet && (
                <>
                  <option value="false">{isValidator ? "Not verified" : "Mine"}</option>
                  <option value="all">All</option>
                </>
              )}
            </select>
            <TextInput
              name="PropertySize"
              placeholder="Property Size"
              value={filter.propertySize}
              onChange={ev =>
                applyFilter({
                  propertySize: ev.value,
                })
              }
            />
            <AddressInput
              className="input input-md sm:input-lg text-[12px] sm:text-[16px] flex flex-grow"
              placeholder="Owner wallet"
              name="OwnerWallet"
              value={filter.ownerWallet ?? ""}
              onChange={address =>
                applyFilter({
                  ownerWallet: address,
                })
              }
            />
          </div>
        )}
      </div>
      {mapOpened && (
        <div className="!mt-4 border h-[420px]">
          <Map
            markers={properties}
            popupContent={marker => <PropertyCard property={marker as PropertyModel} small />}
          />
        </div>
      )}
    </div>
  );
};
export default PropertyFilters;

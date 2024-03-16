import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // Assuming this is used for the dropdown
import { PropertyTypeOptions } from "~~/constants";
import useDebouncer from "~~/hooks/useDebouncer";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";
import { PropertyType } from "~~/models/deed-info.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { ListingType, PropertyModel } from "~~/models/property.model";

interface Props {
  properties: PropertyModel[];
  onFilter: (filter?: PropertiesFilterModel) => void;
}

const PropertyFilters = ({ properties, onFilter }: Props) => {
  const searchParams = useSearchParams();
  const [mapOpened, setMapOpened] = useState(false);
  const [search, setSearch] = useState<string | undefined>();
  const listingType = searchParams.get("listingType");
  const [filter, setFilter] = useState<PropertiesFilterModel>({
    listingType: listingType ? (listingType as ListingType) : "All",
  });

  const debouncedSearch = useDebouncer(search, 500);

  const Map = useMemo(
    () => dynamic(() => import("~~/components/Map"), {
      loading: () => <div className="w-full flex justify-center"><span>Loading...</span></div>,
      ssr: false,
    }), [properties]
  );

  useEffect(() => {
    if (debouncedSearch) {
      applyFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    onFilter(filter);
  }, [filter]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => onFilter(filter));

  return (
    <div className="flex flex-col items-center justify-center w-full mb-8 p-7 bg-stone-950">
      <div className="flex flex-col items-start justify-end self-stretch h-36 gap-7">
        <div className="flex items-center justify-start gap-6 pr-24">
          <div className="text-5xl font-black text-white font-[Coolvetica]">ALL PROPERTIES</div>
          <div className="text-5xl font-black text-white text-opacity-30 font-[Coolvetica]">FOR SALE</div>
          <div className="text-5xl font-black text-white text-opacity-30 font-[Coolvetica]">FOR LEASE</div>
          <div className="text-5xl font-black text-white text-opacity-30 font-[Coolvetica]">AGENT DIRECTORY</div>
        </div>
        <div className="flex items-center justify-start gap-3.5 self-stretch">
          {/* Filters section based on Figma design */}
          <button className="flex items-center justify-center gap-1.5 bg-neutral-900 border border-white border-opacity-20 p-1.5 w-24">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span className="text-xs font-semibold text-white">More Filters</span>
          </button>
          {/* Assuming toggle switch for 'Featured?' is a styled checkbox for simplicity */}
          <div className="flex items-center gap-2">
            <label className="switch">
              <input type="checkbox" onChange={(ev) => applyFilter({ featured: ev.target.checked })} />
              <span className="slider"></span>
            </label>
            <span className="text-xs font-medium text-white text-opacity-60">Featured?</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 bg-neutral-900 border border-white border-opacity-20 grow">
            <input
              className="input w-full bg-transparent text-white placeholder-white::placeholder"
              placeholder="Enter a city, state, address or ZIP code"
              onChange={(val) => setSearch(val.target.value)}
            />
          </div>
          <div className="flex items-center justify-center bg-neutral-900 border border-white border-opacity-20 p-1.5">
            <select
              className="bg-transparent text-white"
              value={filter.propertyType}
              onChange={(ev) => applyFilter({ propertyType: ev.target.value as PropertyType })}
            >
              <option disabled value="">Property type</option>
              {PropertyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.title}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { MapIcon } from "@heroicons/react/24/outline";
import { MapIcon as MapIconSolid, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, SearchIcon } from "@heroicons/react/24/outline";
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
    <div className="flex flex-col w-full mb-8">
      <ExplorerLinks />
      {/* Adjusted for Coolvetica font and modified layout */}
      <div className="flex justify-between items-center text-white my-4" style={{ fontFamily: "Coolvetica, sans-serif", fontSize: "20px" }}>
        {/* Example tab, replicate as needed */}
        <h1 className="font-bold">ALL PROPERTIES</h1>
        <div className="flex gap-4">
          <div style={{ opacity: 0.5 }}>FOR SALE</div>
          <div style={{ opacity: 0.5 }}>FOR LEASE</div>
          <div style={{ opacity: 0.5 }}>AGENT DIRECTORY</div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button className="flex items-center gap-2 bg-neutral-900 p-2 border border-white border-opacity-20">
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
          More Filters
        </button>
        <label className="flex items-center gap-2 bg-neutral-900 p-2 border border-white border-opacity-20">
          <input type="checkbox" className="toggle toggle-primary" onChange={(ev) => applyFilter({ featured: ev.target.checked })} />
          Featured?
        </label>
        <div className="flex-grow flex items-center bg-neutral-900 p-2 border border-white border-opacity-20">
          <SearchIcon className="w-5 h-5" />
          <input
            className="bg-transparent w-full ml-2"
            placeholder="Enter a city, state, address or ZIP code"
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>
        <div className="flex items-center bg-neutral-900 p-2 border border-white border-opacity-20">
          <select
            className="bg-transparent text-white"
            value={filter.propertyType}
            onChange={(ev) => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value="">Property Type</option>
            {PropertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.title}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

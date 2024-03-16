import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid"; // Adjustments icon
import { MapIcon, MapIconSolid } from "@heroicons/react/24/solid"; // Map icons for toggling
import useDebouncer from "~~/hooks/useDebouncer";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";
import { PropertyTypeOptions } from "~~/constants";
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

  useEffect(() => {
    if (debouncedSearch) {
      applyFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    onFilter(filter);
  }, [filter, listingType]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => {
    onFilter(filter);
  });

  // Dynamically importing the Map component with SSR disabled
  const Map = useMemo(
    () =>
      dynamic(() => import("~~/components/Map"), {
        loading: () => (
          <div className="w-full flex flex-row justify-center">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ),
        ssr: false,
      }),
    [properties],
  );

  return (
    <div className="Wrapper flex flex-col w-full mb-8">
      {/* Filters Container */}
      <div className="filters w-full h-14 justify-start items-center gap-3.5 inline-flex bg-neutral-900 border border-white border-opacity-20">
        {/* More Filters Button */}
        <button className="btn flex items-center justify-center gap-2 p-3 text-white" onClick={() => {}}>
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          More filters
        </button>
        
        {/* Featured Toggle */}
        <div className="form-control flex items-center">
          <label className="cursor-pointer label flex items-center gap-2">
            <input type="checkbox" className="toggle toggle-primary" onChange={(ev) => applyFilter({ featured: ev.target.checked })} />
            <span className="label-text text-white">Featured?</span>
          </label>
        </div>
        
        {/* Search Input */}
        <div className="form-control flex-grow">
          <input
            className="input input-lg input-bordered w-full bg-neutral-900 text-white placeholder-white::placeholder"
            placeholder="Enter a city, state, address or ZIP code"
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>
        
        {/* Property Type Selector */}
        <div className="form-select">
          <select
            className="select select-lg select-bordered bg-neutral-900 text-white"
            value={filter.propertyType}
            onChange={(ev) => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value="">
              Property type
            </option>
            {PropertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Map Toggle */}
        <button className="btn btn-square btn-outline" onClick={() => setMapOpened(!mapOpened)}>
          {mapOpened ? <MapIconSolid className="w-6 h-6 text-white" /> : <MapIcon className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Map Component */}
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

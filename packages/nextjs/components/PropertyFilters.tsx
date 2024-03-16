import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"; // Use appropriate icons based on your setup
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // Dropdown icon
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
    <div className="w-full bg-stone-950 text-white flex flex-col p-7 items-center justify-center">
      <div className="flex w-full justify-between items-center gap-6">
        <div className="text-5xl font-black">ALL PROPERTIES</div>
        <div className="text-5xl font-black text-opacity-30">FOR SALE</div>
        <div className="text-5xl font-black text-opacity-30">FOR LEASE</div>
        <div className="text-5xl font-black text-opacity-30">AGENT DIRECTORY</div>
      </div>
      <div className="flex w-full mt-7 items-center gap-3.5">
        {/* More Filters */}
        <button className="flex items-center justify-center gap-2 bg-neutral-900 border border-white border-opacity-20 p-1.5">
          <AdjustmentsHorizontalIcon className="w-5 h-5" />
          <span>More Filters</span>
        </button>

        {/* Featured Toggle */}
        <div className="flex items-center">
          <label className="switch">
            <input type="checkbox" onChange={(ev) => applyFilter({ featured: ev.target.checked })} />
            <span className="slider round"></span>
          </label>
          <span className="ml-2">Featured?</span>
        </div>

        {/* Search Input */}
        <div className="flex-grow flex items-center bg-neutral-900 border border-white border-opacity-20 p-1.5">
          <input
            className="w-full bg-transparent text-white placeholder-white::placeholder"
            placeholder="Enter a city, state, address or ZIP code"
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>

        {/* Property Type Selector */}
        <div className="flex items-center bg-neutral-900 border border-white border-opacity-20 p-1.5">
          <select
            className="bg-transparent text-white outline-none"
            value={filter.propertyType}
            onChange={(ev) => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value="">Property Type</option>
            {PropertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
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

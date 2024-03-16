import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { MapIcon as OutlineMapIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // Correctly importing MagnifyingGlassIcon
import { MapIcon as SolidMapIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
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
    <div className="Wrapper flex flex-col w-full mb-8">
      <ExplorerLinks />
      <div className="filters flex flex-wrap justify-evenly items-center gap-8 w-full">
        <button className="btn btn-lg btn-outline">
          <AdjustmentsHorizontalIcon className="w-4" />
          More filters
        </button>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              onChange={ev => applyFilter({ featured: ev.target.checked })}
            />
            <span className="label-text mx-4">Featured?</span>
          </label>
        </div>
        <div className="flex-grow flex items-center">
          <MagnifyingGlassIcon className="w-5 h-5" /> {/* Using MagnifyingGlassIcon */}
          <input
            className="input input-lg input-bordered w-full"
            placeholder="Enter a city, state, address or ZIP code"
            onChange={val => setSearch(val.target.value)}
          />
        </div>
        <select
          className="select select-lg select-bordered"
          value={filter.propertyType}
          onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}
        >
          <option disabled value="">Property type</option>
          {PropertyTypeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.title}</option>
          ))}
        </select>
        <div className="join">
          <button className="join-item btn btn-square btn-outline" onClick={() => setMapOpened(!mapOpened)}>
            {mapOpened ? <SolidMapIcon className="w-4" /> : <OutlineMapIcon className="w-4" />}
          </button>
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

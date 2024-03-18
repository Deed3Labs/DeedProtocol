import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { MapIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { MapIconSolid } from "@heroicons/react/24/solid";
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
  const [search, setSearch] = useState("");
  const listingType = searchParams.get("listingType");
  const [filter, setFilter] = useState<PropertiesFilterModel>({
    listingType: listingType ? (listingType as ListingType) : "All",
  });

  const debouncedSearch = useDebouncer(search, 500);

  const Map = useMemo(
    () =>
      dynamic(() => import("~~/components/Map"), {
        ssr: false,
      }),
    [properties],
  );

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      applyFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  useEffect(() => {
    onFilter(filter);
  }, [filter, onFilter]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => onFilter(filter));

  return (
    <div className="Wrapper flex flex-col w-full mb-8">
      <ExplorerLinks />
      <div className="filters bg-gray-800 text-white btn-outline p-4 rounded-lg">
        <div className="flex flex-row flex-wrap justify-between items-center gap-2 w-full">
          <button className="btn btn-md flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            More filters
          </button>
          <div className="form-control">
            <label className="cursor-pointer label flex items-center gap-2">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={filter.featured}
                onChange={ev => applyFilter({ featured: ev.target.checked })}
              />
              <span className="label-text">Featured?</span>
            </label>
          </div>
          <input
            className="input input-md input-bordered flex-grow"
            placeholder="Enter a city, state, address"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="select select-md select-bordered"
            value={filter.propertyType}
            onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value={0}>Property type</option>
            {PropertyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.title}</option>
            ))}
          </select>
          <button className="btn btn-square btn-outline" onClick={() => setMapOpened(!mapOpened)}>
            {mapOpened ? <MapIconSolid className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

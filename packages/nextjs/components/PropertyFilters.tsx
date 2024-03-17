import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { MapIcon } from "@heroicons/react/24/outline";
import { MapIconSolid } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
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

  useEffect(() => {
    if (debouncedSearch) {
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

  useKeyboardShortcut(["Enter"], () => {
    onFilter(filter);
  });

  return (
    <div className="Wrapper flex flex-col w-full mb-8">
      <ExplorerLinks />
      <div className="filters bg-gray-800 text-white p-4 rounded-lg">
        <div className="flex flex-row flex-wrap justify-between items-center gap-4 w-full">
          <button className="btn btn-sm flex items-center gap-2 border-gray-700 text-white bg-gray-800 hover:bg-gray-700">
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
            className="input input-sm input-bordered w-full max-w-xs border-gray-700 bg-gray-800 text-white"
            placeholder="Enter a city, state, address"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="select select-sm w-full max-w-xs border-gray-700 bg-gray-800 text-white"
            value={filter.propertyType}
            onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}
          >
            <option disabled value="">Property type</option>
            {PropertyTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.title}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button className="btn btn-square btn-outline border-gray-700 bg-gray-800 hover:bg-gray-700" onClick={() => setMapOpened(!mapOpened)}>
              {mapOpened ? <MapIconSolid className="w-5 h-5 text-white" /> : <MapIcon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;


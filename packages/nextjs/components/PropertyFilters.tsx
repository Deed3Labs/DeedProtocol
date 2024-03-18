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
      <div className="filters bg-gray-800 text-white p-4 rounded-lg">
        <div className="flex md:flex-row flex-col-reverse md:flex-wrap justify-between items-center gap-2 md:gap-2 w-full">
          <input
            className="input input-md input-bordered w-full mb-2 md:mb-0 md:flex-grow"
            placeholder="Enter a city, state, address"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 justify-between items-center w-full md:w-auto">
            <button className="btn btn-md btn-bordered flex items-center gap-2 w-full md:w-auto">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              More filters
            </button>
            <div className="form-control md:hidden w-full">
              <label className="cursor-pointer label flex items-center gap-2 justify-between">
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={filter.featured}
                  onChange={ev => applyFilter({ featured: ev.target.checked })}
                />
                <span className="label-text">Featured?</span>
              </label>
            </div>
            <select
              className="select select-md select-bordered w-full md:w-auto"
              value={filter.propertyType}
              onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}
            >
              <option disabled value="">Property type</option>
              {PropertyTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.title}</option>
              ))}
            </select>
            <button className="btn btn-square btn-outline w-full md:w-auto" onClick={() => setMapOpened(!mapOpened)}>
              {mapOpened ? <MapIconSolid className="w-5 h-5" /> : <MapIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;

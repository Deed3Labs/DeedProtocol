import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
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
  }, [listingType]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => {
    onFilter(filter);
  });

  return (
    <div className="flex flex-col w-full mb-8 space-y-4">
      <ExplorerLinks />
      <div className="flex justify-between items-center w-full px-4">
        <button className="flex items-center gap-2 text-white bg-neutral-900 py-2 px-4 rounded">
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
          More Filters
        </button>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="toggle toggle-primary" onChange={e => applyFilter({ featured: e.target.checked })} />
            Featured?
          </label>
          <input
            type="text"
            placeholder="Enter a city, state, address or ZIP code"
            className="input input-bordered w-full max-w-xs"
            onChange={e => setSearch(e.target.value)}
          />
          <select className="select select-bordered" onChange={e => applyFilter({ propertyType: e.target.value as PropertyType })}>
            <option disabled>Property Type</option>
            {PropertyTypeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.title}</option>
            ))}
          </select>
          <button onClick={() => setMapOpened(!mapOpened)} className="btn btn-square btn-outline">
            {mapOpened ? <MapIconSolid className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mapOpened && <Map />}
    </div>
  );
};

export default PropertyFilters;

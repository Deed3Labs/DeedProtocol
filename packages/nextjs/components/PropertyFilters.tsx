import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks";
import { MapIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { MapIcon as MapIconSolid } from "@heroicons/react/24/solid";
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
  }, [filter, listingType]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => {
    onFilter(filter);
  });

  return (
    <div className="w-full mb-8 flex flex-col">
      <ExplorerLinks />
      <div className="flex flex-wrap justify-evenly items-center gap-8 w-full">
        <button className="btn btn-lg btn-outline" onClick={() => setMapOpened(!mapOpened)}>
          {mapOpened ? <MapIconSolid className="w-6 h-6" /> : <MapIcon className="w-6 h-6" />}
          <span className="ml-2">Toggle Map</span>
        </button>
        <div className="form-control w-auto flex-none">
          <input type="checkbox" className="toggle toggle-primary" onChange={ev => applyFilter({ featured: ev.target.checked })} />
          <span className="label-text mx-2">Featured?</span>
        </div>
        <input type="text" className="input input-lg input-bordered w-full max-w-xs" placeholder="Enter a city, state, address or ZIP code" onChange={ev => setSearch(ev.target.value)} />
        <select className="select select-lg select-bordered max-w-xs" value={filter.propertyType || ''} onChange={ev => applyFilter({ propertyType: ev.target.value as PropertyType })}>
          <option value="">Property Type</option>
          {PropertyTypeOptions.map(option => (
            <option key={option.value} value={option.value}>{option.title}</option>
          ))}
        </select>
        <button className="btn btn-lg btn-outline" onClick={() => applyFilter({})}>
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
          <span className="ml-2">More Filters</span>
        </button>
      </div>
      {mapOpened && <Map />}
    </div>
  );
};

export default PropertyFilters;

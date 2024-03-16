import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import ExplorerLinks from "./ExplorerLinks"; // Assumed to handle tab/page switching
import { MapIcon, MapIcon as MapIconSolid, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [mapOpened, setMapOpened] = useState(false);
  const [search, setSearch] = useState<string | undefined>();
  const listingType = searchParams.get("listingType");
  const [filter, setFilter] = useState<PropertiesFilterModel>({
    listingType: listingType ? (listingType as ListingType) : "All",
  });

  const debouncedSearch = useDebouncer(search, 500);
  const Map = useMemo(() => dynamic(() => import("~~/components/Map"), { ssr: false }), [properties]);

  useEffect(() => {
    if (debouncedSearch) applyFilter({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => onFilter(filter), [filter, onFilter]);

  const applyFilter = (partialFilter: Partial<PropertiesFilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["Enter"], () => onFilter(filter));

  // Adjusted styling to match the Figma design while retaining functionality
  return (
    <div className="flex flex-col w-full mb-8" style={{ padding: '28px', backgroundColor: '#1E293B' }}>
      <ExplorerLinks /> {/* Handles tab/page switching */}
      <div className="flex flex-wrap justify-evenly items-center gap-8 w-full">
        <button className="btn btn-lg btn-outline" onClick={() => setMapOpened(!mapOpened)}>
          <AdjustmentsHorizontalIcon className="w-4" />
          More filters
        </button>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input type="checkbox" className="toggle toggle-primary" onChange={(ev) => applyFilter({ featured: ev.target.checked })} />
            <span className="label-text mx-4">Featured?</span>
          </label>
        </div>
        <input className="input input-lg input-bordered w-full" placeholder="Enter a city, state, address or ZIP code" onChange={(ev) => setSearch(ev.target.value)} />
        <select className="select select-lg select-bordered" value={filter.propertyType} onChange={(ev) => applyFilter({ propertyType: ev.target.value as PropertyType })}>
          <option disabled value="">Property type</option>
          {PropertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.title}</option>
          ))}
        </select>
        <div>
          {mapOpened ? <MapIconSolid className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
        </div>
      </div>
      {mapOpened && <Map markers={properties} />}
    </div>
  );
};

export default PropertyFilters;


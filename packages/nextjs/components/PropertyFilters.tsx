import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AdjustmentsHorizontalIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import useDebouncer from "~~/hooks/useDebouncer";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { PropertyModel } from "~~/models/property.model";

interface Props {
  properties: PropertyModel[];
  onFilter: (filter?: PropertiesFilterModel) => void;
}

const PropertyFilters = ({ properties, onFilter }: Props) => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncer(search, 500);
  
  useEffect(() => {
    const newFilter = { search: debouncedSearch };
    onFilter(newFilter);
  }, [debouncedSearch, onFilter]);

  return (
    <div style={{ width: '100%', padding: '28px', backgroundColor: '#111827', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'end', width: '100%', gap: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '24px', width: '100%' }}>
          <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '700', fontFamily: 'Coolvetica, sans-serif' }}>ALL PROPERTIES</h1>
          <h2 style={{ color: 'white', fontSize: '40px', fontWeight: '700', fontFamily: 'Coolvetica, sans-serif', opacity: '0.3' }}>FOR SALE</h2>
          <h2 style={{ color: 'white', fontSize: '40px', fontWeight: '700', fontFamily: 'Coolvetica, sans-serif', opacity: '0.3' }}>FOR LEASE</h2>
          <h2 style={{ color: 'white', fontSize: '40px', fontWeight: '700', fontFamily: 'Coolvetica, sans-serif', opacity: '0.3' }}>AGENT DIRECTORY</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
          <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#1F2937', border: '1px solid white', borderRadius: '8px', padding: '8px 16px' }}>
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-white" />
            <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>More Filters</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F2937', border: '1px solid white', borderRadius: '9999px', padding: '4px 12px' }}>
            <input type="checkbox" onChange={(e) => console.log(e.target.checked)} />
            <span style={{ color: 'white', fontSize: '14px', marginLeft: '8px' }}>Featured?</span>
          </div>
          <input 
            type="text" 
            placeholder="Enter a city, state, address or ZIP code" 
            onChange={(e) => setSearch(e.target.value)} 
            style={{ flexGrow: 1, backgroundColor: '#1F2937', color: 'white', border: '1px solid white', borderRadius: '8px', padding: '8px 16px' }} 
          />
          <select style={{ backgroundColor: '#1F2937', color: 'white', border: '1px solid white', borderRadius: '8px', padding: '8px 16px' }}>
            <option>Real Estate</option>
          </select>
          <ChevronDownIcon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;

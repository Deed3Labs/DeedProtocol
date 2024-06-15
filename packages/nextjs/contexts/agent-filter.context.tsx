import React, { ReactNode, createContext, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AgentFilterModel } from "~~/models/agent-filter.model";

export const defaultPropertyFilter: AgentFilterModel = {
  search: "",
  agentType: "realEstate",
  validated: "true",
};

interface FilterContextModel {
  filter: AgentFilterModel;
  applyFilter: React.Dispatch<React.SetStateAction<AgentFilterModel>>;
  reset: () => void;
}

// Create a context for the filter
const FilterContext = createContext<FilterContextModel | null>(null);

// Create a provider component for the filter context
export const PropertiesFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useLocalStorage<PropertiesFilterModel>(
    "PropertyFilter.Filter",
    defaultPropertyFilter,
  );

  const applyFilter = (x: any) => {
    setFilter(prev => ({ ...prev, ...x }));
  };

  const reset = () => {
    setFilter(defaultPropertyFilter);
  };

  return (
    <FilterContext.Provider value={{ filter, applyFilter, reset }}>
      {children}
    </FilterContext.Provider>
  );
};

// Create a hook to use the filter context
export const usePropertiesFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

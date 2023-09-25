import React, { useEffect, useRef, useState } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Navbar from "~~/components/Navbar";
import useDebouncer from "~~/hooks/useDebouncer";
import { useKeyboardShortcut } from "~~/hooks/useKeyboardShortcut";

type FilterModel = { search?: string };

type Props = {
  onFilter: (filter?: FilterModel) => void;
};

const AgentFilters = ({ onFilter }: Props) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<FilterModel>();
  const [search, setSearch] = useState<string | undefined>();
  const debouncedSearch = useDebouncer(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      applyFilter({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  const applyFilter = (partialFilter: Partial<FilterModel>) => {
    const newFilter = { ...filter, ...partialFilter };
    setFilter(newFilter);
    onFilter(newFilter);
  };

  useKeyboardShortcut(["/"], ev => {
    if (ev.target === searchRef.current) return;
    searchRef.current?.focus();
    ev.preventDefault();
  });

  useKeyboardShortcut(["Enter"], () => {
    onFilter(filter);
  });

  return (
    <div className="Wrapper flex flex-col w-full my-8">
      <Navbar />
      <div className="filters">
        <div className="flex flex-wrap justify-evenly items-center my-10 gap-8 w-full ">
          <button className="btn btn-lg btn-outline">
            <AdjustmentsHorizontalIcon className="w-4" />
            More filters
          </button>
          <div className="flex-grow flex items-center">
            <input
              ref={searchRef}
              className="input input-lg input-bordered border-1 w-full"
              placeholder="Agent name or username"
              onChange={() => setSearch(searchRef.current?.value)}
              value={search}
            />
            <kbd className="bd bg-neutral-focus -ml-14 flex justify-center items-center w-10 h-10 rounded-xl">/</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AgentFilters;

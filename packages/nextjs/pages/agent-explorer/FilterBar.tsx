import React, { useRef } from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Navbar from "~~/components/Navbar";
import { useKeyboardShortcut } from "~~/hooks/utils/useKeyboardShortcut";

const FilterBar = () => {
  const searchRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcut(["/"], ev => {
    if (ev.target === searchRef.current) return;
    searchRef.current?.focus();
    ev.preventDefault();
  });

  return (
    <div className="Wrapper flex flex-col w-full my-8">
      <Navbar />
      <div className="filters">
        <div className="flex flex-wrap justify-evenly items-center my-10 gap-8 w-full ">
          <label className="btn btn-lg btn-outline drawer-button" htmlFor="my-drawer">
            <AdjustmentsHorizontalIcon className="w-4" />
            More filters
          </label>
          <div className="flex-grow flex items-center">
            <input
              ref={searchRef}
              className="input input-lg input-bordered border-1 w-full"
              placeholder="Agent name or username"
            />
            <kbd className="bd bg-neutral-focus -ml-14 flex justify-center items-center w-10 h-10 rounded-xl">/</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterBar;

// Filters component
import React from "react";
import { MapIcon } from "@heroicons/react/24/outline";
import { MapIcon as MapIconSolid } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

const DEFAULT_CENTER = [38.907132, -77.036546];
export const Filters = () => {
  const [mapOpened, setMapOpened] = React.useState(false);
  return (
    <>
      <div className="flex flex-wrap justify-evenly items-center my-10 gap-8 w-full ">
        <label className="btn btn-lg btn-outline drawer-button" htmlFor="my-drawer">
          <AdjustmentsHorizontalIcon className="w-4" />
          More filters
        </label>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input type="checkbox" className="toggle toggle-primary" />
            <span className="label-text mx-4">Featured?</span>
          </label>
        </div>
        <div className="flex-grow flex items-center">
          <input
            className="input input-lg input-bordered border-1 w-full"
            placeholder="Enter a city, state, address or ZIP code"
          />
          <kbd className="bd bg-neutral-focus -ml-14 flex justify-center items-center w-10 h-10 rounded-xl">/</kbd>
        </div>
        <select className="select select-lg select-bordered">
          <option disabled selected>
            Property type
          </option>
          <option>House</option>
          <option>Appartement</option>
          <option>Bachelor</option>
        </select>
        <div className="join">
          <button className="join-item btn btn-square btn-outline">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.75 0.242325C7.92155 0.242325 7.25 0.913897 7.25 1.74232V3.99233C7.25 4.82078 7.92155 5.49233 8.75 5.49233H11C11.8285 5.49233 12.5 4.82078 12.5 3.99233V1.74232C12.5 0.913897 11.8285 0.242325 11 0.242325H8.75ZM8.75 6.99232C7.92155 6.99232 7.25 7.66387 7.25 8.49232V10.7423C7.25 11.5708 7.92155 12.2423 8.75 12.2423H11C11.8285 12.2423 12.5 11.5708 12.5 10.7423V8.49232C12.5 7.66387 11.8285 6.99232 11 6.99232H8.75ZM0.5 8.49232C0.5 7.66387 1.17157 6.99232 2 6.99232H4.25C5.07845 6.99232 5.75 7.66387 5.75 8.49232V10.7423C5.75 11.5708 5.07845 12.2423 4.25 12.2423H2C1.17157 12.2423 0.5 11.5708 0.5 10.7423V8.49232ZM2 0.242325C1.17157 0.242325 0.5 0.913897 0.5 1.74232V3.99233C0.5 4.82078 1.17157 5.49233 2 5.49233H4.25C5.07845 5.49233 5.75 4.82078 5.75 3.99233V1.74232C5.75 0.913897 5.07845 0.242325 4.25 0.242325H2Z"
                fill="white"
              />
            </svg>
          </button>
          <button className="join-item btn btn-square btn-outline" onClick={() => setMapOpened(!mapOpened)}>
            {mapOpened ? <MapIconSolid className="w-4" /> : <MapIcon className="w-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

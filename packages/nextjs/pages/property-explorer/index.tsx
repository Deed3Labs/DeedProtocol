/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Filters } from "./filters";
import { NextPage } from "next";
import { AdjustmentsHorizontalIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Property } from "~~/models/property";

const PropertyExplorer: NextPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPage] = useState(1);
  const [pageSize] = useState(20);

  useEffect(() => {
    loadProperties(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const loadProperties = (pageIndex: number, pageSize: number) => {
    const nextPageContent: Property[] = [];
    for (let index = pageIndex * pageSize; index < pageIndex * pageSize + pageSize; index++) {
      nextPageContent.push({
        id: index,
        name: `Property ${index}`,
        description: `This is the description for property ${index}`,
        photos: [
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
        ],
        address: `${Math.round(Math.random() * 1000)} Fake Street, US 92401`,
        price: Math.round(Math.random() * 1000000),
        latitude: 0,
        longitude: 0,
        type: "House",
      });
    }
    setProperties(nextPageContent);
  };

  return (
    <div className="container">
      <Filters />
      <div className="flex flex-wrap gap-8 items-center justify-center">
        {properties.map(property => (
          <figure
            className="card bg-base-100 shadow-xl p-2 bg-secondary border border-white border-opacity-10"
            key={property.id}
          >
            <img src={property.photos[0]} alt="Picture" />
            <div className="m-4">
              <span className="flex flex-h w-fit gap-2">
                <span className="text-secondary-content">Username.eth</span>
                <CheckBadgeIcon className="w-4" />
              </span>
              <h2 className="text-2xl font-bold">{property.address}</h2>
            </div>
            <div className="bg-neutral p-4 flex flex-row justify-evenly">
              <div className="flex flex-col">
                <span className="text-secondary-content">PRICE</span>
                <span>{property.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>
              </div>
              <div className="flex flex-col">
                <div className="text-secondary-content">TYPE</div>
                <div>{property.type}</div>
              </div>
              <div className="flex flex-col">
                <div className="text-secondary-content">ZONING</div>
                <div>Residential</div>
              </div>
            </div>
          </figure>
        ))}
        f
      </div>
    </div>
  );
};

export default PropertyExplorer;

import L from "leaflet";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Property } from "~~/models/property";

type Props = {
  property: Property;
};

export default function PropertyCard({ property }: Props) {
  const onCardClick = () => {
    L.map("map").setView([property.latitude, property.longitude], 13);
  };
  return (
    <figure
      className="card bg-base-100 shadow-xl p-2 bg-secondary border border-white border-opacity-10"
      key={property.id}
      onClick={onCardClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
  );
}

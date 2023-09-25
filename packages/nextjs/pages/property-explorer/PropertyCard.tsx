import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { PropertyModel } from "~~/models/property.model";

type Props = {
  property: PropertyModel;
};

export default function PropertyCard({ property }: Props) {
  return (
    <figure className="card bg-base-100 shadow-xl p-2 border border-white border-opacity-10 font-['Montserrat']">
      <Image src={property.photos[0]} alt="Picture" height={400} width={350} />
      <div className="m-4">
        <span className="flex flex-h w-fit gap-2">
          <span className="text-secondary-content">Username.eth</span>
          <CheckBadgeIcon className="w-4" />
        </span>
        <h2 className="text-2xl font-bold">{property.address}</h2>
      </div>
      <div className="bg-neutral p-4 flex flex-row justify-evenly border-solid border-2 border-opacity-25">
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

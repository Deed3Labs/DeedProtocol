import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { PropertyModel } from "~~/models/property.model";

interface Props {
  property: PropertyModel;
}

const PropertyCard = ({ property }: Props) => {
  return (
    <>
      {property && (
        <Link href={`/registration?id=${property.id}`}>
          <figure className="card bg-base-100 shadow-xl p-2 border border-white border-opacity-10 font-['Montserrat'] max-w-full w-[350px]">
            <Image
              src={property.photos[0]}
              alt="Picture"
              height={400}
              width={350}
              style={{
                maxWidth: "100%",
              }}
            />
            <div className="m-4">
              <span className="flex flex-h w-fit gap-2">
                <span className="text-secondary-content">Username.eth</span>
                <CheckBadgeIcon className="w-4" />
              </span>
              <h2 className="text-2xl font-bold truncate" title={property.address}>
                {property.address}
              </h2>
            </div>
            <div className="bg-neutral p-4 flex flex-row justify-evenly border border-white border-opacity-25 flex-wrap">
              <div className="flex flex-col">
                <span className="text-secondary-content">PRICE</span>
                <span>
                  {property.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </span>
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
        </Link>
      )}
    </>
  );
};

export default PropertyCard;

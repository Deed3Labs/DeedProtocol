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
        <Link href={`/validation/${property.id}`} className="link-default">
          {/* Adjusted class names for responsive sizing */}
          <div className="w-full sm:w-64 h-60 sm:h-96 p-2 border border-white border-opacity-10 flex flex-col justify-start items-start gap-2.5">
            <div className="relative self-stretch flex-grow bg-white bg-opacity-5">
              <Image src={property.pictures[0]} alt="Property Image" layout="fill" objectFit="cover" />
              <div className="absolute bottom-2 right-2 p-1 bg-zinc-900 bg-opacity-40 rounded-full border border-white border-opacity-10 flex justify-center items-center w-7 h-7">
                <CheckBadgeIcon className="text-white w-5 h-5" />
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-3">
              <div className="self-stretch flex flex-col justify-center gap-0.5 px-2">
                <div className="flex justify-start items-center">
                  <span className="text-white text-opacity-60 text-xs font-medium tracking-wider">USERNAME.ETH</span>
                </div>
                <div className="text-white text-base font-bold">{property.address}</div>
              </div>
              <div className="self-stretch flex flex-col justify-center bg-neutral-900 border border-white border-opacity-10 px-3 pt-2.5 pb-3">
                <div className="flex justify-start items-start gap-5">
                  <div className="flex flex-col">
                    <span className="text-white text-opacity-60 text-xs font-medium tracking-wider">PRICE</span>
                    <span className="text-white text-xs font-semibold">
                      {property.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-opacity-60 text-xs font-medium tracking-wider">TYPE</span>
                    <span className="text-white text-xs font-semibold">{property.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-opacity-60 text-xs font-medium tracking-wider">ZONING</span>
                    <span className="text-white text-xs font-semibold">Residential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default PropertyCard;


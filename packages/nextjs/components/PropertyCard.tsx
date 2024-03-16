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
          <div className="w-64 h-96 p-2.5 border border-white border-opacity-10 flex-col justify-start items-start gap-2.5 inline-flex sm:w-48 sm:h-64 sm:p-1.5 sm:gap-1.5">
            <div className="self-stretch flex-col justify-start items-start flex relative bg-white bg-opacity-5 sm:bg-neutral-900 sm:h-40">
              <Image src={property.pictures[0]} alt="Property Image" layout="fill" objectFit="cover" className="sm:w-44 sm:h-40 sm:pl-1.5 sm:pr-36 sm:pt-32 sm:pb-2"/>
              <div className="w-7 h-7 p-1 bg-zinc-900 bg-opacity-40 rounded-3xl border border-white border-opacity-10 flex-col justify-center items-center flex absolute bottom-0 right-0 m-2 sm:absolute sm:bottom-auto sm:right-auto sm:m-0 sm:bg-neutral-900 sm:bg-opacity-40 sm:rounded-3xl">
                <CheckBadgeIcon className="text-white w-5 h-5" />
              </div>
            </div>
            <div className="self-stretch h-32 flex-col justify-start items-start gap-3 flex p-2 sm:h-16 sm:p-3 sm:bg-neutral-900 sm:border sm:border-white sm:border-opacity-10">
              <div className="self-stretch flex-col justify-center items-start gap-0.5 flex pr-16 sm:self-stretch sm:h-6">
                <div className="text-white text-opacity-60 text-xs font-medium font-['Montserrat'] leading-none tracking-wider sm:text-xs sm:font-semibold sm:justify-between sm:items-center">
                  {property.address}
                </div>
              </div>
              <div className="self-stretch flex-col justify-start items-start gap-0.5 inline-flex sm:h-2.5">
                <div className="text-white text-xs font-semibold font-['Montserrat'] leading-none">
                  {property.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                  <span className="text-opacity-60 sm:ml-0.5">USD</span>
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

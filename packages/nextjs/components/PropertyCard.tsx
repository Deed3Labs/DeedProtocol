import Image from "next/image";
import Link from "next/link";
import { Address } from "./scaffold-eth";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { PropertyModel } from "~~/models/property.model";

interface Props {
  property: PropertyModel;
  small?: boolean;
}

const PropertyCard = ({ property, small = false }: Props) => {
  const image = (
    <div
      className={`self-stretch ${
        small ? "h-16 w-16" : "h-60"
      } bg-white bg-opacity-5 flex-col justify-start items-start flex relative`}
    >
      {property.pictures?.length && (
        <Image src={property.pictures[0]} alt="Property Image" layout="fill" objectFit="cover" />
      )}
      {!small && (
        <div className="w-7 h-7 p-1 bg-zinc-900 bg-opacity-40 rounded-3xl border border-white border-opacity-10 flex-col justify-center items-center flex absolute bottom-0 right-0 m-2">
          <CheckBadgeIcon
            className={`${property.validated ? "text-white" : "text-warning"} w-5 h-5`}
          />
        </div>
      )}
    </div>
  );
  return (
    <>
      {property && (
        <Link href={`/overview/${property.id}`} className="link-default">
          {small ? (
            image
          ) : (
            <>
              <div className="w-full sm:w-full h-72 sm:h-72 md:h-[391px] p-1.5 sm:p-2.5 border border-white border-opacity-10 flex-col justify-start items-start gap-2.5 inline-flex">
                {image}
                <div className="self-stretch h-32 flex-col justify-center items-start gap-3 flex">
                  <div className="self-stretch px-2 flex-col justify-center items-start gap-0.5 flex">
                    <div className="pr-16 justify-start items-center inline-flex">
                      <div className="justify-start items-center gap-1 flex">
                        <div className="h-5 flex-col justify-center items-start inline-flex">
                          <div className="flex items-center gap-1 text-white text-opacity-60 text-[9px] sm:text-[9px] font-normal leading-none tracking-wider">
                            <CheckBadgeIcon
                              // @ts-ignore
                              title={property.validated ? "Validated" : "Pending Validation"}
                              className={`${
                                property.validated ? "text-white" : "text-warning"
                              } w-4 h-4 sm:w-[18px] sm:h-[18px] mb-[-1px]`}
                            />
                            <Address
                              address={property.owner}
                              format="short"
                              showBlockie={false}
                              showLink={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch justify-start items-center w-full">
                      <div className="text-white text-sm sm:text-base font-normal w-full leading-snug line-clamp-2">
                        {property.address}
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-14 sm:h-16 px-2.5 sm:px-3 pt-2.5 pb-2.5 bg-base-300 border border-white border-opacity-10 flex-col justify-center items-start flex">
                    <div className="self-stretch justify-between items-start gap-2.5 inline-flex">
                      <div className="flex-col justify-start items-start inline-flex">
                        <div className="self-stretch h-4 flex-col justify-start items-start flex">
                          <div className="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">
                            PRICE
                          </div>
                        </div>
                        <div className="self-stretch justify-start items-start gap-0.5 inline-flex">
                          <div className="text-white text-[2vw] sm:text-[0.74vw] font-medium uppercase leading-none">
                            {property.price?.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex-col justify-start items-start inline-flex">
                        <div className="self-stretch h-4 flex-col justify-start items-start flex">
                          <div className="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">
                            TYPE
                          </div>
                        </div>
                        <div className="self-stretch justify-start items-start inline-flex">
                          <div className="text-white text-[1.8vw] sm:text-[0.68vw] font-medium uppercase leading-none">
                            {property.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex-col justify-start items-start inline-flex">
                        <div className="self-stretch h-4 flex-col justify-start items-start flex">
                          <div className="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">
                            ZONING
                          </div>
                        </div>
                        <div className="justify-start items-start inline-flex">
                          <div className="text-white text-[1.8vw] sm:text-[0.68vw] font-medium uppercase leading-none">
                            Residential
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Link>
      )}
    </>
  );
};

export default PropertyCard;

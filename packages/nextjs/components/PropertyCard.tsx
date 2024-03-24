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
          <div class="w-full sm:w-48 md:w-full h-72 sm:h-72 md:h-[391px] p-2.5 border border-white border-opacity-10 flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="self-stretch h-60 bg-white bg-opacity-5 flex-col justify-start items-start flex relative">
              <Image src={property.pictures[0]} alt="Property Image" layout="fill" objectFit="cover" />
              <div class="w-7 h-7 p-1 bg-zinc-900 bg-opacity-40 rounded-3xl border border-white border-opacity-10 flex-col justify-center items-center flex absolute bottom-0 right-0 m-2">
                <CheckBadgeIcon className="text-white w-5 h-5" />
              </div>
            </div>
            <div class="self-stretch h-32 flex-col justify-start items-start gap-3 flex">
              <div class="self-stretch h-11 px-2 flex-col justify-center items-start gap-0.5 flex">
                <div class="pr-16 justify-start items-center inline-flex">
                  <div class="justify-start items-center gap-1 flex">
                    <div class="h-5 flex-col justify-center items-start inline-flex">
                      <div class="text-white text-opacity-60 text-[9px] sm:text-xs font-medium leading-none tracking-wider">USERNAME.ETH</div>
                    </div>
                  </div>
                </div>
                <div class="self-stretch pr-24 justify-start items-center inline-flex w-full">
                  <div class="text-white text-base font-bold w-full leading-snug">{property.address}</div>
                </div>
              </div>
              <div class="self-stretch h-16 px-3 pt-2.5 pb-3 bg-neutral-900 border border-white border-opacity-10 flex-col justify-center items-start flex">
                <div class="self-stretch justify-start items-start gap-2.5 inline-flex">
                  <div class="flex-col justify-start items-start inline-flex">
                    <div class="self-stretch h-4 flex-col justify-start items-start flex">
                      <div class="text-white text-opacity-60 text-[8px] sm:text-xs font-medium leading-none tracking-wider">PRICE</div>
                    </div>
                    <div class="self-stretch justify-start items-start gap-0.5 inline-flex">
                      <div class="text-white text-[1.5vw] sm:text-xs font-medium uppercase leading-none">
                        {property.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                  <div class="flex-col justify-start items-start inline-flex">
                    <div class="self-stretch h-4 flex-col justify-start items-start flex">
                      <div class="text-white text-opacity-60 text-[8px] sm:text-xs font-medium leading-none tracking-wider">TYPE</div>
                    </div>
                    <div class="self-stretch justify-start items-start inline-flex">
                      <div class="text-white text-[1.5vw] sm:text-xs font-medium leading-none">{property.type}</div>
                    </div>
                  </div>
                  <div class="flex-col justify-start items-start inline-flex">
                    <div class="self-stretch h-4 flex-col justify-start items-start flex">
                      <div class="text-white text-opacity-60 text-[8px] sm:text-xs font-medium leading-none tracking-wider">ZONING</div>
                    </div>
                    <div class="justify-start items-start inline-flex">
                      <div class="text-white text-[1.5vw] sm:text-xs font-medium leading-none">Residential</div>
                    </div>
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


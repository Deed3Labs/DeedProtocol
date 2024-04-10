import Image from "next/image";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { PropertyModel } from "~~/models/property.model";

interface Props {
  property: PropertyModel;
}

interface PropertyModel {
  id: number;
  pictures: string[];
  type: PropertyType; // This is the property type, e.g., "residential", "commercial", etc.
  // ... other properties like address, price, etc.
}

const PropertyCard = ({ property }: Props) => {
  // Placeholder images for different property types, each with multiple options
  const placeholderImages = {
    default: [
      '/assets/images/placeholders/residential1.png',
      // Add more as needed
    ],
    realEstate: [
      '/assets/images/placeholders/residential1.png',
      '/assets/images/placeholders/residential2.png',
      '/assets/images/placeholders/residential3.png',
      '/assets/images/placeholders/residential4.png',
      '/assets/images/placeholders/residential5.png',
      '/assets/images/placeholders/residential6.png',
      // Add more as needed
    ],
    vehicle: [
      '/assets/images/placeholders/residential1.png',
      '/assets/images/placeholders/residential2.png',
      '/assets/images/placeholders/residential3.png',
      '/assets/images/placeholders/residential4.png',
      '/assets/images/placeholders/residential5.png',
      '/assets/images/placeholders/residential6.png',
      // Add more as needed
    ],
    // Define more property types as needed
  };

  // Function to select a random placeholder image based on property type
  const getRandomPlaceholderImage = (type: keyof typeof placeholderImages) => {
    const images = placeholderImages[type] || placeholderImages['default'];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Determine the image source
  const imageUrl =
    property.pictures && property.pictures.length > 0
      ? property.pictures[0]
      : getRandomPlaceholderImage(property.type);

  return (
    <>
      {property && (
        <Link href={`/validation/${property.id}`} className="link-default">
          <div class="w-full sm:w-full h-72 sm:h-72 md:h-[391px] p-1.5 sm:p-2.5 border border-white border-opacity-10 flex-col justify-start items-start gap-2.5 inline-flex">
            <div class="self-stretch h-60 bg-white bg-opacity-5 flex-col justify-start items-start flex relative">
              <Image src={imageUrl} alt="Property Image" layout="fill" objectFit="cover" />
              <div class="w-7 h-7 p-1 bg-zinc-900 bg-opacity-40 rounded-3xl border border-white border-opacity-10 flex-col justify-center items-center flex absolute bottom-0 right-0 m-2">
                <CheckBadgeIcon className="text-white w-5 h-5" />
              </div>
            </div>
            <div class="self-stretch h-32 flex-col justify-center items-start gap-3 flex">
              <div class="self-stretch h-11 px-2 flex-col justify-center items-start gap-0.5 flex">
                <div class="pr-16 justify-start items-center inline-flex">
                  <div class="justify-start items-center gap-1 flex">
                    <div class="h-5 flex-col justify-center items-start inline-flex">
                      <div class="text-white text-opacity-60 text-[9px] sm:text-[10px] font-normal leading-none tracking-wider">USERNAME.ETH</div>
                    </div>
                  </div>
                </div>
                <div class="self-stretch justify-start items-center w-full">
                  <div class="text-white text-sm sm:text-base font-normal w-full leading-snug">{property.address}</div>
                </div>
              </div>
              <div class="self-stretch h-14 sm:h-16 px-2.5 sm:px-3 pt-2.5 pb-2.5 bg-base-300 border border-white border-opacity-10 flex-col justify-center items-start flex">
                <div class="self-stretch justify-between items-start gap-2.5 inline-flex">
                  <div class="flex-col justify-start items-start inline-flex">
                    <div class="self-stretch h-4 flex-col justify-start items-start flex">
                      <div class="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">PRICE</div>
                    </div>
                    <div class="self-stretch justify-start items-start gap-0.5 inline-flex">
                      <div class="text-white text-[2vw] sm:text-[0.74vw] font-medium uppercase leading-none">
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
                      <div class="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">TYPE</div>
                    </div>
                    <div class="self-stretch justify-start items-start inline-flex">
                      <div class="text-white text-[1.8vw] sm:text-[0.68vw] font-medium uppercase leading-none">{property.type}</div>
                    </div>
                  </div>
                  <div class="flex-col justify-start items-start inline-flex">
                    <div class="self-stretch h-4 flex-col justify-start items-start flex">
                      <div class="text-white text-opacity-60 text-[1.8vw] sm:text-[0.68vw] font-normal leading-none tracking-wider">ZONING</div>
                    </div>
                    <div class="justify-start items-start inline-flex">
                      <div class="text-white text-[1.8vw] sm:text-[0.68vw] font-medium uppercase leading-none">Residential</div>
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


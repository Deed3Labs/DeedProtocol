import { useEffect, useRef, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { MapIconModel } from "~~/models/map-icon.model";
import { PropertyModel } from "~~/models/property.model";
import PropertyCard from "~~/pages/property-explorer/PropertyCard";

const propertyIcon: MapIconModel = {
  className: "property-icon",
  html: `<div class="marker-pin"></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
</svg>
`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
};

const PropertyExplorer: NextPage = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [_isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: nextTokenId } = useScaffoldContractRead({
    contractName: "DeedNFT",
    functionName: "nextDeedId",
  });

  useEffect(() => {
    if (nextTokenId && Number(nextTokenId) > 0 && properties.length === 0) {
      loadMoreProperties();
    }
  }, [nextTokenId]);

  // useEffect(() => {
  //   const handleDebouncedScroll = debounce(() => !isLast && handleScroll(), 100);
  //   window.addEventListener("scroll", handleDebouncedScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleDebouncedScroll);
  //   };
  // }, [isLast]);

  // const handleScroll = () => {
  //   console.log("handleScroll");
  //   if (containerRef.current && typeof window !== "undefined") {
  //     const container = containerRef.current;
  //     const { bottom } = container.getBoundingClientRect();
  //     const { innerHeight } = window;
  //     if (bottom <= innerHeight) {
  //       loadMoreProperties();
  //     }
  //   }
  // };

  const onFilter = (_filter?: { search?: string }) => {
    // setCurrentPage(0);
    // setProperties([]);
    // loadMoreProperties();
  };

  const loadMoreProperties = async () => {
    setLoading(true);
    const _properties = [];
    setCurrentPage(1);
    const radius = 10;
    const center = { lat: 40, lng: -100 };
    const pageSize = Number(nextTokenId);
    for (let index = 1; index < pageSize + 1; index++) {
      const newProperty: PropertyModel = {
        id: index,
        name: `Deed #${index}`,
        description: `This is the description for property ${index}`,
        photos: [
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
        ],
        address: `Deed #${index}`,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: Math.random() > 0.3 ? "Appartement" : Math.random() > 0.5 ? "House" : "Condo",
        icon: propertyIcon,
      };
      newProperty.popupContent = <PropertyCard property={newProperty} />;
      _properties.push(newProperty);
    }
    if (currentPage >= 5) {
      // Fake 5 pages
      setIsLast(true);
    }
    // setProperties([...properties]);
    setProperties(_properties);
    setLoading(false);
  };

  return (
    <div className="container" ref={containerRef}>
      <PropertyFilters properties={properties} onFilter={onFilter} />

      <div className="flex flex-wrap gap-8 items-center justify-center max-w-full">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
      {loading && <span className="loading loading-bars loading-lg my-8"></span>}
    </div>
  );
};

export default PropertyExplorer;

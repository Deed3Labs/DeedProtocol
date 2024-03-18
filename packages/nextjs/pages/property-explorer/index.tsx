import { useEffect, useRef, useState } from "react";
import PropertyFilters from "../../components/PropertyFilters";
import { NextPage } from "next";
import PropertyCard from "~~/components/PropertyCard";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { MapIconModel } from "~~/models/map-icon.model";
import { PropertyModel } from "~~/models/property.model";

const propertyIcon: MapIconModel = {
  className: "property-icon",
  html: `<div class="marker-pin"></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
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
    cacheOnBlock: true,
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
    for (let index = 1; index < pageSize; index++) {
      const newProperty: PropertyModel = {
        id: index,
        name: `Deed #${index}`,
        pictures: [
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
        ],
        address: `Deed #${index}`,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: "realEstate",
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

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-3 sm:p-4 items-start justify-start w-full">
        {properties.length === 0 ? (
          <div className="card w-96 bg-neutral">
            <div className="card-body items-center text-center">
              <h2 className="card-title">No properties</h2>
            </div>
          </div>
        ) : (
          properties.map(property => <PropertyCard key={property.id} property={property} />)
        )}
      </div>
      {loading && <span className="loading loading-bars loading-lg my-8"></span>}
    </div>
  );
};

export default PropertyExplorer;

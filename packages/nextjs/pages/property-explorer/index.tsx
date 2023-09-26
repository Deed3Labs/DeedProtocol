import { useEffect, useRef, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import { debounce, uniqueId } from "lodash";
import { NextPage } from "next";
import { PropertyModel } from "~~/models/property.model";
import PropertyCard from "~~/pages/property-explorer/PropertyCard";
import { sleepAsync } from "~~/utils/sleepAsync";

const PropertyExplorer: NextPage = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => !isLast && handleScroll(), 100);
    window.addEventListener("scroll", handleDebouncedScroll);
    return () => {
      window.removeEventListener("scroll", handleDebouncedScroll);
    };
  }, [isLast]);

  const handleScroll = () => {
    if (containerRef.current && typeof window !== "undefined") {
      const container = containerRef.current;
      const { bottom } = container.getBoundingClientRect();
      const { innerHeight } = window;
      if (bottom <= innerHeight) {
        loadMoreProperties();
      }
    }
  };

  const onFilter = (_filter?: { search?: string }) => {
    setCurrentPage(0);
    setProperties([]);
    loadMoreProperties();
  };

  const loadMoreProperties = async () => {
    setLoading(true);
    await sleepAsync(500);
    setCurrentPage(prev => prev + 1);
    const radius = 10;
    const center = { lat: 40, lng: -100 };
    for (let index = currentPage * pageSize; index < currentPage * pageSize + pageSize; index++) {
      properties.push({
        id: uniqueId("property-"),
        name: `Property ${index}`,
        description: `This is the description for property ${index}`,
        photos: [
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
          `https://picsum.photos/seed/${Math.random() * 1000}/350/400`,
        ],
        address: `${Math.round(Math.random() * 1000)} Fake Street, US 92401`,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: Math.random() > 0.3 ? "Appartement" : Math.random() > 0.5 ? "House" : "Condo",
      });
    }
    if (currentPage >= 5) {
      // Fake 5 pages
      setIsLast(true);
    }
    setProperties([...properties]);
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

import { useEffect, useRef, useState } from "react";
import FilterBar from "./FilterBar";
import { debounce } from "lodash";
import { NextPage } from "next";
import PropertyCard from "~~/components/PropertyCard";
import { PropertyModel } from "~~/models/property.model";

const PropertyExplorer: NextPage = () => {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [isLast, setIsLast] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMoreProperties();
  }, []);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => !isLast && handleScroll(), 200);
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

  const loadMoreProperties = () => {
    setCurrentPage(prev => prev + 1);
    const nextPageContent: PropertyModel[] = [...properties];
    const radius = 10;
    const center = { lat: 40, lng: -100 };
    for (let index = currentPage * pageSize; index < currentPage * pageSize + pageSize; index++) {
      nextPageContent.push({
        id: index,
        name: `Property ${index}`,
        description: `This is the description for property ${index}`,
        photos: [
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
          `https://picsum.photos/seed/${Math.random() * 1000}/245/245`,
        ],
        address: `${Math.round(Math.random() * 1000)} Fake Street, US 92401`,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: "House",
      });
    }
    if (currentPage === 5) {
      // Fake 5 pages
      setIsLast(true);
    }
    setProperties(nextPageContent);
  };
  return (
    <div className="container" ref={containerRef}>
      <FilterBar properties={properties} />
      <div className="flex flex-wrap gap-8 items-center justify-center">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyExplorer;

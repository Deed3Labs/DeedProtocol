import { useEffect, useRef, useState } from "react";
import PropertyFilters from "../../components/PropertyFilters";
import { debounce } from "lodash-es";
import { NextPage } from "next";
import { DeedEntity } from "~~/.graphclient";
import PropertyCard from "~~/components/PropertyCard";
import { ExplorerPageSize } from "~~/constants";
import { PropertyType } from "~~/models/deed-info.model";
import { MapIconModel } from "~~/models/map-icon.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { PropertyModel } from "~~/models/property.model";
import { fetchDeeds } from "~~/queries/deed3.query";

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
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PropertiesFilterModel>();

  const containerRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   if (!properties.length && !loading) {
  //     console.log("Init");
  //     loadMoreProperties();
  //   }
  // }, []);

  useEffect(() => {
    const handleDebouncedScroll = debounce(() => {
      if (!isLast) handleScroll();
    }, 100);
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
        loadMoreProperties(filter, currentPage);
      }
    }
  };

  const onFilter = (filter?: PropertiesFilterModel) => {
    setCurrentPage(0);
    setProperties([]);
    setFilter(filter);
    loadMoreProperties(filter, 0);
  };

  const loadMoreProperties = async (filter?: PropertiesFilterModel, currentPage?: number) => {
    setLoading(true);
    const results = await fetchDeeds(filter, currentPage, ExplorerPageSize);
    if (results.length === 0) {
      setIsLast(true);
      setLoading(false);
      return;
    }
    const center = { lat: 40, lng: -100 };
    const radius = 10;
    const deeds = results.map((entity: DeedEntity) => {
      const deed: PropertyModel = {
        id: entity.deedId,
        name: entity.deedMetadata.ownerInformation_entityName ?? "",
        pictures: entity.deedMetadata.propertyDetails_images
          ?.filter(x => !!x.fileId)
          ?.map(image => "https://ipfs.io/ipfs/" + image.fileId),
        address: entity.deedMetadata.propertyDetails_address,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: (entity.deedMetadata.propertyDetails_type as PropertyType) ?? "realEstate",
        icon: propertyIcon,
        validated: entity.isValidated,
      };
      if (!deed.pictures?.length) {
        deed.pictures = ["images/home-icon.svg"];
      }
      deed.popupContent = <PropertyCard property={deed} />;
      return deed;
    }) as PropertyModel[];

    setProperties(old => {
      // Merge with distinct
      const result = [];
      const map = new Map();
      for (const item of [...old, ...deeds]) {
        if (!map.has(item.id)) {
          map.set(item.id, true); // set any value to Map
          result.push(item);
        }
      }
      return result;
    });
    setLoading(false);
    if (results.length < ExplorerPageSize) {
      setIsLast(true);
      return;
    }
    setCurrentPage(old => old + 1);
  };

  return (
    <div className="container pb-4" ref={containerRef}>
      <PropertyFilters properties={properties} onFilter={onFilter} />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-3 items-start justify-start w-full">
        {properties.length !== 0 &&
          properties.map(property => <PropertyCard key={property.id} property={property} />)}
      </div>
      {properties.length === 0 && !loading && (
        <div className="card w-96 bg-neutral mt-28 my-8">
          <div className="card-body items-center text-center">
            <h2 className="card-title font-normal capitalize">No properties</h2>
          </div>
        </div>
      )}
      {loading ? (
        <span className="loading loading-bars loading-lg my-8 mt-28"></span>
      ) : isLast ? (
        properties.length !== 0 && (
          <h2 className="mt-8 font-normal capitalize">No more properties</h2>
        )
      ) : (
        <h2 className="mt-8 font-normal capitalize">Scroll to load more</h2>
      )}
    </div>
  );
};

export default PropertyExplorer;

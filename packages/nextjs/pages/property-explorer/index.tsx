import { useEffect, useRef, useState } from "react";
import PropertyFilters from "./PropertyFilters";
import { NextPage } from "next";
import { execute } from "~~/.graphclient";
import deed3Query from "~~/clients/deed3.query";
import { PropertyTypeOptions } from "~~/constants";
import { PropertyType } from "~~/models/deed-info.model";
import { MapIconModel } from "~~/models/map-icon.model";
import { PropertiesFilterModel } from "~~/models/properties-filter.model";
import { PropertyModel } from "~~/models/property.model";
import PropertyCard from "~~/pages/property-explorer/PropertyCard";
import { indexOfLiteral } from "~~/utils/extract-values";

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
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProperties();
  }, []);

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

  const onFilter = async (filter?: PropertiesFilterModel) => {
    loadProperties(filter);
  };

  const loadProperties = async (filter?: PropertiesFilterModel) => {
    setLoading(true);
    const results = await execute(
      deed3Query,
      {
        PROPERTY_ADDRESS: filter?.search || " ",
        PROPERTY_CITY: filter?.search || " ",
        PROPERTY_STATE: filter?.search || " ",
        PROPERTY_TYPE: filter?.propertyType || "realEstate",
      },
      {},
    );
    const _properties = [];
    const radius = 10;
    const center = { lat: 40, lng: -100 };
    for (const property of results.data.deedEntities) {
      const infos = property.deedMetadata;
      const newProperty: PropertyModel = {
        id: property.id,
        name: `${infos.propertyDetails_city}, ${infos.propertyDetails_state}`,
        pictures: infos.propertyDetails_images.map((x: any) => "https://ipfs.io/ipfs/" + x.id),
        address: infos.propertyDetails_address,
        price: Math.round(Math.random() * 1000000),
        latitude: center.lat + (Math.random() - 0.5) * (radius * 2),
        longitude: center.lng + (Math.random() - 0.5) * (radius * 2),
        type: infos.propertyDetails_type,
        icon: propertyIcon,
      };
      newProperty.popupContent = <PropertyCard property={newProperty} />;
      _properties.push(newProperty);
    }
    setProperties(_properties);
    setLoading(false);
  };

  return (
    <div className="container" ref={containerRef}>
      <PropertyFilters properties={properties} onFilter={onFilter} />

      <div className="flex flex-wrap gap-8 items-center justify-center max-w-full">
        {!loading &&
          (properties.length === 0 ? (
            <div className="card w-96 bg-neutral">
              <div className="card-body items-center text-center">
                <h2 className="card-title">No properties</h2>
              </div>
            </div>
          ) : (
            properties.map(property => <PropertyCard key={property.id} property={property} />)
          ))}
      </div>
      {loading && <span className="loading loading-bars loading-lg my-8"></span>}
    </div>
  );
};

export default PropertyExplorer;

import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import PropertyCard from "~~/components/PropertyCard";
import { Property } from "~~/models/property";

type Props = {
  properties: Property[];
};

const propertyIcon = L.divIcon({
  iconUrl: "assets/property-icon.svg",
  className: "property-icon",
  html: `<div class="marker-pin"></div><i class="fa-solid fa-house"></i>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
});

const Map = ({ properties }: Props) => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: 750, width: "100%", margin: "16px" }} id="map">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {properties.map(property => (
        <Marker key={property.id} position={[property.latitude, property.longitude]} icon={propertyIcon}>
          <Popup className="property-popup">
            <PropertyCard key={property.id} property={property} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;

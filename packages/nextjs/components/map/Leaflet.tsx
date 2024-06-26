import { MapProps } from ".";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const mapboxToken =
  "pk.eyJ1IjoiY29yYW50aW4iLCJhIjoiY2xtdjZiZTV4MGlibDJsbXM5ZzM1dHg0OCJ9.cv78ncZxEq8TE2exs5vvIA";

const Map = (_props: MapProps) => {
  return (
    <MapContainer
      center={[40.8054, -74.0241]}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="[&_.leaflet-control-container]:hidden"
    >
      {/* @ts-ignore */}
      <Marker position={[40.8054, -74.0241]} draggable={true} interactive={true} animate={true}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`}
        />
      </Marker>
    </MapContainer>
  );
};

export default Map;

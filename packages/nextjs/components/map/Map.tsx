import { useRef } from "react";
import { MapContainer, TileLayer, ZoomControl } from "./MapComponents";

const Map = () => {
  const mapRef = useRef(null);
  return (
    <div style={{ height: "400px", zIndex: "0!important" }}>
      <MapContainer ref={mapRef} touchZoom={false} zoomControl={false}>
        <div style={{ zIndex: "0!important" }}>
          <TileLayer url="..." attribution="..." className="custom-tile-layer" />
        </div>
        <div style={{ zIndex: "10!important" }}>
          <ZoomControl position="topright" />
        </div>
      </MapContainer>
    </div>
  );
};

export default Map;

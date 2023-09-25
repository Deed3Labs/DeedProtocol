"use client";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MarkerModel } from "~~/models/marker.model";

type Props = {
  markers: MarkerModel[];
  drawPopup?: (property: MarkerModel) => JSX.Element;
};

const propertyIcon = L.divIcon({
  iconUrl: "assets/property-icon.svg",
  className: "property-icon",
  html: `<div class="marker-pin"></div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
  <path fill-rule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clip-rule="evenodd" />
</svg>

`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
});

const Map = ({ markers, drawPopup }: Props) => {
  return (
    <>
      <MapContainer center={[40, -100]} zoom={5} style={{ height: 750, width: "100%", margin: "16px" }} id="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map(marker => (
          <Marker key={"marker-" + marker.id} position={[marker.latitude, marker.longitude]} icon={propertyIcon}>
            {drawPopup && <Popup className="property-popup">{drawPopup(marker)}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;

"use client";

import { useEffect } from "react";
import { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { IMarker } from "~~/models/marker.model";

type Props = {
  markers: IMarker[];
};

const defaultIcon = new DivIcon({
  className: "property-icon",
  html: `<div class="marker-pin"></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
});

const Map = ({ markers }: Props) => {
  useEffect(() => {
    console.log(window);
    const map = document.getElementById("map");
    // Scroll only if needed
    if (map && window.scrollY + map.offsetTop + map.offsetHeight >= window.screen.height) {
      window.scrollTo({ top: map.offsetTop, behavior: "smooth" });
    }
  }, []);
  return (
    <>
      <MapContainer
        center={[40, -100]}
        zoom={5}
        style={{ height: 750, width: "calc(100%-32px)", maxHeight: "calc(100vh - 130px)", margin: "16px" }}
        id="map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
        {markers.map(marker => (
          <Marker
            key={"marker-" + marker.id}
            position={[marker.latitude, marker.longitude]}
            icon={new DivIcon(marker.icon) ?? defaultIcon}
          >
            {marker.popupContent && <Popup className="marker-popup">{marker.popupContent}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default Map;

import { useEffect, useState } from "react";
import { MarkerModel } from "~~/models/marker.model";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
type Props = {
  markers: MarkerModel[];
  markerPopup?: (marker: MarkerModel) => JSX.Element;
  opened: boolean;
};

const propertyIcon = L.DivIcon({
  iconUrl: "assets/property-icon.svg",
  className: "property-icon",
  html: `<div class="marker-pin"></div><i class="fa-solid fa-house"></i>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [-3, -76],
});

const MapBox = ({ markers, markerPopup }: Props) => {

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      <h1>{markers.length}</h1>
      {opened && (

      )}
    </>
  );
};

export default Map;

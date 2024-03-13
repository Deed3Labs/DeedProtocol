"use client";

import { useEffect, useState } from "react";
import classes from "./Page.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Mapbox, { Marker, useMap } from "react-map-gl";
import logger from "~~/services/logger.service";

const mapboxToken =
  "pk.eyJ1IjoiY29yYW50aW4iLCJhIjoiY2xtdjZiZTV4MGlibDJsbXM5ZzM1dHg0OCJ9.cv78ncZxEq8TE2exs5vvIA";

interface Props {
  markers: Array<string>;
}

interface Marker {
  id: string;
  lat: number;
  lng: number;
}

const Map = ({ markers }: Props) => {
  const [resolvedMarkers, setResolvedMarkers] = useState<Marker[]>();

  // useEffect(() => {
  //   (async () => {
  //     setResolvedMarkers(
  //       await Promise.all(
  //         markers.map(async marker => {
  //           const response = await fetch(
  //             `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
  //               marker,
  //             )}.json?access_token=${mapboxToken}`,
  //           );
  //           if (!response.ok) throw new Error("Failed to fetch");
  //           const data = await response.json();

  //           const markerData = data.features[0];
  //           return {
  //             id: markerData.id,
  //             lat: markerData.geometry.coordinates[1],
  //             lng: markerData.geometry.coordinates[0],
  //           };
  //         }),
  //       ),
  //     );
  //   })().catch(err => {
  //     logger.error(err);
  //   });
  // }, [markers]);

  return (
    <main className={classes.mainStyle}>
      {/* {resolvedMarkers?.length && ( */}
      <Mapbox
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={classes.mapStyle}
        // initialViewState={{
        //   latitude: resolvedMarkers[0].lat,
        //   longitude: resolvedMarkers[0].lng,
        //   zoom: 10,
        // }}
      >
        {/* {resolvedMarkers?.map(marker => (
          <Marker key={marker.id} latitude={marker.lat} longitude={marker.lng}></Marker>
        ))} */}
      </Mapbox>
      {/* )} */}
    </main>
  );
};

export default Map;

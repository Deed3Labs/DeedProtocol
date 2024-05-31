import { useEffect, useRef, useState } from "react";
import { MapProps } from ".";
import { ErrorFallback } from "../ErrorFallback";
import classes from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { ErrorBoundary } from "react-error-boundary";
import Mapbox, { MapRef, Marker, NavigationControl, Popup } from "react-map-gl";
import logger from "~~/services/logger.service";

const Map = ({
  markers,
  onMarkerClicked,
  popupContent,
  center,
}: MapProps & { center?: { lat: number; lng: number } }) => {
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | undefined>(undefined);
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    if (!markers.length) return;

    let minLat = Infinity,
      minLng = Infinity,
      maxLat = -Infinity,
      maxLng = -Infinity;

    markers.forEach(marker => {
      const { lat, lng } = marker;
      minLat = Math.min(minLat, lat);
      minLng = Math.min(minLng, lng);
      maxLat = Math.max(maxLat, lat);
      maxLng = Math.max(maxLng, lng);
    });

    const newBounds: [[number, number], [number, number]] = [
      [minLng, minLat],
      [maxLng, maxLat],
    ];
    setBounds(newBounds);
    if (
      minLat !== Infinity &&
      minLng !== Infinity &&
      maxLat !== -Infinity &&
      maxLng !== -Infinity
    ) {
      mapRef.current?.setCenter([(minLng + maxLng) / 2, (minLat + maxLat) / 2]);
    }
  }, [markers.length]);

  useEffect(() => {
    if (center) {
      mapRef.current?.setCenter([center.lng, center.lat]);
    }
  }, [center]);

  return (
    <main className={classes.mainStyle}>
      {!process.env.NEXT_PUBLIC_OFFLINE && (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logger.error}>
          <Mapbox
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            style={{ width: "100%", height: "100%" }}
            initialViewState={{
              latitude: center?.lat || 36.7783,
              longitude: center?.lng || -119.417931,
              bounds,
              zoom: 5,
              fitBoundsOptions: { padding: 64 },
            }}
          >
            <NavigationControl showCompass={false} />
            {markers?.map(marker => (
              <div key={marker.id}>
                {popupContent ? (
                  <Popup
                    className="[&_.mapboxgl-popup-tip]:!border-t-secondary [&_.mapboxgl-popup-tip]:!border-b-secondary [&_.mapboxgl-popup-content]:bg-secondary [&_.mapboxgl-popup-content]:p-1"
                    key={"popup_" + marker.id}
                    latitude={marker.lat}
                    longitude={marker.lng}
                    closeButton={false}
                    closeOnClick={false}
                    offset={[0, -38] as [number, number]}
                  >
                    {popupContent(marker)}
                  </Popup>
                ) : (
                  <Marker
                    key={"marker_" + marker.id}
                    latitude={marker.lat}
                    longitude={marker.lng}
                    onClick={() => onMarkerClicked?.(marker)}
                  />
                )}
              </div>
            ))}
          </Mapbox>
        </ErrorBoundary>
      )}
    </main>
  );
};

export default Map;

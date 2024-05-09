import { useMemo } from "react";
import dynamic from "next/dynamic";
import { MarkerModel } from "~~/models/marker.model";

export interface MapProps {
  markers: Array<MarkerModel>;
  popupContent?: (marker: MarkerModel) => JSX.Element;
  onMarkerClicked?: (marker: MarkerModel) => void;
}

const Map = (props: MapProps) => {
  const MapWithNoSSR = useMemo(
    () =>
      dynamic(() => import("~~/components/map/Mapbox"), {
        loading: () => (
          <div className="w-full h-full flex flex-row justify-center items-center">
            <span className="loading loading-bars loading-lg" />
          </div>
        ),
        ssr: false,
      }),
    [],
  );

  return <MapWithNoSSR {...props} />;
};

export default Map;

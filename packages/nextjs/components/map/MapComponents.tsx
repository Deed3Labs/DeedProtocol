import React, { forwardRef } from "react";
import dynamic from "next/dynamic";

export const LazyMapContainer = dynamic(() => import("./MapLazyComponents").then(m => m.MapContainer), {
  ssr: false,
  loading: () => <div style={{ height: "400px" }} />,
});
// eslint-disable-next-line react/display-name
export const MapContainer = forwardRef<any, { children: React.ReactNode; touchZoom: boolean; zoomControl: boolean }>(
  (props, ref) => (
    <LazyMapContainer {...props} forwardedRef={ref}>
      {props.children}
    </LazyMapContainer>
  ),
);

// direct import from 'react-leaflet'
export const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
export const ZoomControl = dynamic(() => import("react-leaflet").then(m => m.ZoomControl), { ssr: false });

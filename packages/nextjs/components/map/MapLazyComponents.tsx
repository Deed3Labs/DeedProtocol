import { ForwardedRef } from "react";
import { MapContainer as LMapContainer } from "react-leaflet";

type Props = {
  forwardedRef: ForwardedRef<any>;
  children: React.ReactNode;
};
export const MapContainer = ({ forwardedRef, ...props }: Props) => <LMapContainer {...props} ref={forwardedRef} />;

import { MapIconModel } from "./map-icon.model";

export interface IMarker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  icon?: MapIconModel;
  popupContent?: JSX.Element;
}

import { MapIconModel } from "./map-icon.model";

export interface MarkerModel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  icon?: MapIconModel;
  popupContent?: JSX.Element;
}

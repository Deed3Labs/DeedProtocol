import { IMarker } from "./marker.model";

export interface AgentModel extends IMarker {
  id: number;
  name: string;
  address: string;
  profile: string;
  cover: string;
  phone: string;
  email: string;
  followers: number;
}
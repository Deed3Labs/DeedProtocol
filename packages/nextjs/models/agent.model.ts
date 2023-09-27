import { IMarker } from "./marker.model";

export interface AgentModel extends IMarker {
  id: string;
  name: string;
  address: string;
  profile: string;
  cover: string;
  phone: string;
  email: string;
  followers: number;
}

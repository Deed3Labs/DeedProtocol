import { AgentType } from "./agent-info.model";
import { IMarker } from "./marker.model";

export interface AgentModel extends IMarker {
  id: string;
  name: string;
  address: string;
  profile: string;
  type: AgentType;
  cover: string;
  phone: string;
  email: string;
  followers: number;
  location: string;
}

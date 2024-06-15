import { AgentType } from "./agent-info.model";

export interface AgentFilterModel {
  agentType?: AgentType | "All";
  featured?: boolean;
  search?: string;
  validated?: "true" | "false" | "all";
  propertySize?: string;
  ownerWallet?: string;
}

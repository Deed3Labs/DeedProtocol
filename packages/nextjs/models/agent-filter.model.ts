import { AgentType } from "./agent-info.model";

export interface AgentFilterModel {
  agentType?: AgentType | "All";
  featured?: boolean;
  search?: string;
  

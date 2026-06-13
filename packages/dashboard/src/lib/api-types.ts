// ━━━━━ Shared API Types ━━━━━
// Single source of truth for all API response types

export interface Plugin {
  id: string; name: string; module: string; version: string;
  status: "running" | "stopped" | "error"; toolCount: number;
  description: string; transport: string; endpoint: string;
}

export interface PluginsResponse {
  plugins: Plugin[];
  totalPlugins: number;
  runningPlugins: number;
  totalTools: number;
  protocol: string;
}

export interface AgentTask {
  id: string; type: string; module: string; desc: string;
  schedule: string; enabled: boolean; lastRun?: string; status: string;
}

export interface AgentResponse {
  tasks: AgentTask[];
  totalTasks: number;
  activeTasks: number;
  runtimeStatus: string;
}

export interface MemoryEntry {
  id: string; type: "conversation" | "preference" | "context";
  content: string; timestamp: number; metadata?: Record<string, unknown>;
}

export interface MemoryResponse {
  entries: MemoryEntry[];
  totalEntries: number;
  conversations: number;
  preferences: number;
  contexts: number;
}

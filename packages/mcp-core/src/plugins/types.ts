// ━━━━━ MCP Plugin System Types ━━━━━
// Plugin Manager — 统一加载外部 MCP Server

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  module: "cex" | "onchain" | "outcomes" | "signals" | "kb" | "collab" | "custom";
  transport: "stdio" | "sse" | "websocket";
  endpoint: string;  // command (stdio) or URL (sse/ws)
  args?: string[];   // for stdio transport
  env?: Record<string, string>;
  autoStart?: boolean;
}

export interface PluginStatus {
  id: string;
  manifest: PluginManifest;
  status: "loading" | "running" | "stopped" | "error";
  toolCount: number;
  resourceCount: number;
  uptime: number;     // ms
  lastError?: string;
}

export interface PluginTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  pluginId: string;
  module: string;
}

export interface PluginResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  pluginId: string;
}

// ━━━━━ Plugin Manager Events ━━━━━
export interface PluginEvent {
  type: "plugin_loaded" | "plugin_unloaded" | "plugin_error" | "plugin_reload";
  pluginId: string;
  timestamp: number;
  data?: unknown;
}

// ━━━━━ Pre-registered Plugins ━━━━━
export const BUILTIN_PLUGINS: PluginManifest[] = [
  {
    name: "OKX CEX",
    version: "1.0.0",
    description: "OKX CEX Trading — 180+ MCP tools",
    module: "cex",
    transport: "stdio",
    endpoint: "hvip-mcp-server",
    autoStart: true,
  },
  {
    name: "OKX Onchain OS",
    version: "1.0.0", 
    description: "DEX, DeFi, Bridge, Wallet — 100+ tools",
    module: "onchain",
    transport: "stdio",
    endpoint: "okx-onchain-mcp",
    autoStart: false,
  },
  {
    name: "OKX Outcomes",
    version: "1.0.0",
    description: "Prediction Markets — 10+ tools",
    module: "outcomes",
    transport: "stdio",
    endpoint: "okx-outcomes-mcp",
    autoStart: false,
  },
];

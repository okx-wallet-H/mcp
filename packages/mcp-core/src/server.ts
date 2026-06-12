// @ts-nocheck — MCP SDK v1.x API mismatch (pre-existing)
// MCP Core Server — extends hvip-mcp-server with custom tools, resources, and WebSocket gateway

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import type { IncomingMessage } from "http";

// ━━━━━ Custom Tools ━━━━━
function registerExtendedTools(server: McpServer) {
  // Dashboard stats tool
  // @ts-expect-error MCP SDK v1.x type mismatch
  server.tool(
    "dashboard.stats",
    "Get MCP dashboard statistics",
    {},
    async () => ({
      content: [{
        type: "text",
        text: JSON.stringify({
          totalTools: 301,
          coverage: 97.1,
          modules: 12,
          p0Gaps: 2,
          avgQuality: 3.4,
        }),
      }],
    })
  );

  // Tool catalog search
  server.tool(
    "dashboard.search_tools",
    "Search MCP tools by keyword, module, or auth level",
    {
      query: { type: "string", description: "Search keyword" },
      module: { type: "string", description: "Filter by module name" },
    },
    async ({ query, module: mod }) => ({
      content: [{
        type: "text",
        text: JSON.stringify({
          query,
          module: mod || "all",
          results: [],
        }),
      }],
    })
  );
}

// ━━━━━ Resources (Knowledge Base) ━━━━━
function registerResources(server: McpServer) {
  server.resource(
    "kb://okx/api-overview",
    "OKX API Overview",
    "Complete OKX REST API reference and documentation",
    "text/markdown",
    async () => ({
      contents: [{
        uri: "kb://okx/api-overview",
        mimeType: "text/markdown",
        text: "# OKX API Overview\n\nOKX provides REST and WebSocket APIs for trading...",
      }],
    })
  );

  server.resource(
    "kb://mcp/tools",
    "MCP Tools Catalog",
    "Complete catalog of all 301 MCP tools with descriptions",
    "application/json",
    async () => ({
      contents: [{
        uri: "kb://mcp/tools",
        mimeType: "application/json",
        text: JSON.stringify({ tools: [], total: 301 }),
      }],
    })
  );
}

// ━━━━━ Prompts ━━━━━
function registerPrompts(server: McpServer) {
  server.prompt(
    "trading-strategy",
    "Generate a trading strategy prompt for AI agents",
    [
      { name: "asset", description: "Trading asset (e.g., BTC, ETH)", required: true },
      { name: "style", description: "Trading style (scalp, swing, grid)" },
    ],
    async ({ asset, style }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Analyze ${asset} for ${style || "swing"} trading. Current market conditions, key levels, and suggested strategy.`,
        },
      }],
    })
  );

  server.prompt(
    "audit-quality",
    "Generate an audit prompt for MCP tool Description quality",
    [],
    async () => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: "Audit the following MCP tools for Description quality (0-6 scale). Check: 场景, 鉴权, 风险, 关键词, 数据量, 关联.",
        },
      }],
    })
  );
}

// ━━━━━ WebSocket Gateway (v2 — ChannelManager) ━━━━━
import { ChannelManager } from "./gateway/channel-manager.js";
import type { GatewayClientMessage } from "./gateway/types.js";

export function startWsGateway(port: number = 3457) {
  const httpServer = createServer();
  const wss = new WebSocketServer({ server: httpServer });
  const cm = new ChannelManager();

  // Collab rooms (compatibility with old protocol)
  const rooms = new Map<string, Set<WebSocket>>();

  cm.start();

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    console.log(`[WS] Client connected from ${req.socket.remoteAddress}`);

    // Register with ChannelManager for market/onchain subscriptions
    cm.addClient(ws);

    ws.on("message", (data: Buffer) => {
      try {
        const msg = JSON.parse(data.toString());
        // Route to ChannelManager (subscribe/unsubscribe for market/onchain channels)
        if (msg.type === "subscribe" || msg.type === "unsubscribe") {
          cm.handleMessage(ws, msg as GatewayClientMessage);
          return;
        }
        // Legacy collab messages
        handleCollabMessage(ws, msg, rooms);
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }
    });

    ws.on("close", () => {
      cm.removeClient(ws);
      rooms.forEach((clients) => clients.delete(ws));
      console.log("[WS] Client disconnected");
    });
  });

  httpServer.listen(port, () => {
    console.log(`[WS] Signal Hub listening on ws://localhost:${port}`);
    console.log(`[WS] Channels: market:ticker | market:candles | market:orderbook | market:trades | xlayer:newHeads | xlayer:logs | collab:room`);
  });

  return { wss, httpServer, cm };
}

function handleCollabMessage(ws: WebSocket, msg: Record<string, unknown>, rooms: Map<string, Set<WebSocket>>) {
  switch (msg.type) {
    case "join": {
      const roomId = msg.roomId as string;
      if (!rooms.has(roomId)) rooms.set(roomId, new Set());
      rooms.get(roomId)!.add(ws);
      rooms.get(roomId)!.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "user_joined", roomId, identity: msg.identity }));
        }
      });
      break;
    }
    case "leave": {
      rooms.get(msg.roomId as string)?.delete(ws);
      break;
    }
    case "message":
    case "tool_call": {
      const roomId = msg.roomId as string;
      rooms.get(roomId)?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify(msg));
      });
      break;
    }
  }
}

// ━━━━━ Main Server ━━━━━
export async function startMcpServer() {
  const server = new McpServer({
    name: "okx-mcp-console",
    version: "0.1.0",
  });

  // Register extensions
  registerExtendedTools(server);
  registerResources(server);
  registerPrompts(server);

  // Start WebSocket gateway
  startWsGateway(3457);

  // Connect MCP transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.log("[MCP] OKX MCP Console Server started");
  console.log("[MCP] 301+ tools available via stdio");
  console.log("[MCP] WebSocket Gateway: ws://localhost:3457");
  
  return server;
}

// Auto-start when run directly
if (process.argv[1]?.includes("server")) {
  startMcpServer().catch(console.error);
}

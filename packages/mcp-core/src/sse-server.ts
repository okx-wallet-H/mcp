// ━━━━━ SSE Server for Dashboard MCP Client ━━━━━
// SSE transport endpoint → mcp-core → Plugin Manager

import { createServer, IncomingMessage, ServerResponse } from "http";
import { PluginManager } from "./plugins/plugin-manager.js";
import { MemoryEngine } from "./memory/memory-engine.js";
import { KnowledgeBase } from "./kb/knowledge-base.js";

export interface SseServerOptions {
  port?: number;
  pluginManager?: PluginManager;
  memory?: MemoryEngine;
  kb?: KnowledgeBase;
}

export class SseServer {
  private port: number;
  private pluginManager?: PluginManager;
  private memory?: MemoryEngine;
  private kb?: KnowledgeBase;
  private clients = new Set<ServerResponse>();

  constructor(opts: SseServerOptions = {}) {
    this.port = opts.port || 3458;
    this.pluginManager = opts.pluginManager;
    this.memory = opts.memory;
    this.kb = opts.kb;
  }

  start(): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      if (req.url === "/sse") {
        this.handleSse(req, res);
      } else if (req.url === "/messages" && req.method === "POST") {
        this.handleMessage(req, res);
      } else if (req.url === "/health") {
        res.writeHead(200).end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
      } else {
        res.writeHead(404).end("Not found");
      }
    });

    server.listen(this.port, () => {
      console.log(`[SSE] Server listening on http://localhost:${this.port}`);
      console.log(`[SSE] Endpoints: GET /sse | POST /messages | GET /health`);
    });
  }

  // ━━━━━ SSE Connection ━━━━━

  private handleSse(req: IncomingMessage, res: ServerResponse): void {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    this.clients.add(res);
    this.sendEvent(res, "connected", { message: "OKX MCP Console SSE" });

    // Auto-send available tools
    if (this.pluginManager) {
      const tools = this.pluginManager.getTools();
      this.sendEvent(res, "tool_list", { tools });
    }

    req.on("close", () => this.clients.delete(res));
  }

  // ━━━━━ Message Handler ━━━━━

  private async handleMessage(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const msg = JSON.parse(body);
        const result = await this.processMessage(msg);
        res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { "Access-Control-Allow-Origin": "*" });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
    });
  }

  private async processMessage(msg: Record<string, unknown>): Promise<unknown> {
    const method = msg.method as string;
    const params = (msg.params || {}) as Record<string, unknown>;

    switch (method) {
      case "tools/list": {
        return { tools: this.pluginManager?.getTools() || [] };
      }
      case "tools/call": {
        if (!this.pluginManager) throw new Error("PluginManager not initialized");
        const toolName = (params as { name?: string }).name;
        const args = (params as { arguments?: Record<string, unknown> }).arguments || {};
        return this.callTool(toolName || "", args);
      }
      case "plugins/list": {
        return { plugins: this.pluginManager?.getPlugins() || [] };
      }
      case "plugins/load": {
        if (!this.pluginManager) throw new Error("PluginManager not initialized");
        const manifest = (params as { manifest?: Record<string, unknown> }).manifest;
        if (!manifest) throw new Error("manifest required");
        return this.pluginManager.loadPlugin(manifest as any);
      }
      case "memory/query": {
        if (!this.memory) throw new Error("Memory engine not initialized");
        return { results: this.memory.query(params as any) };
      }
      case "memory/save": {
        if (!this.memory) throw new Error("Memory engine not initialized");
        return this.memory.save(params as any);
      }
      case "kb/search": {
        if (!this.kb) throw new Error("KnowledgeBase not initialized");
        return { results: this.kb.search((params.query as string) || "", params as any) };
      }
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  private async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    // Route to appropriate handler based on tool name
    if (name.startsWith("okx_get_ticker")) {
      return this.simulateOkxCall("ticker", args);
    }
    if (name.startsWith("okx_get_candles")) {
      return this.simulateOkxCall("candles", args);
    }
    if (name.startsWith("okx_get_balance")) {
      return { equity: 45832.91, available: 12345.67 };
    }
    if (name.startsWith("memory.")) {
      return this.memory?.[args.action as keyof MemoryEngine]?.(...Object.values(args)) || {};
    }
    return { result: "ok", tool: name, args };
  }

  private simulateOkxCall(type: string, args: Record<string, unknown>): unknown {
    const instId = (args.instId as string) || "BTC-USDT";
    const base = instId.includes("BTC") ? 63773 : 100;
    if (type === "ticker") {
      return { instId, last: base, bid: base * 0.9999, ask: base * 1.0001, high24h: base * 1.02, low24h: base * 0.98 };
    }
    return { instId, candles: [] };
  }

  // ━━━━━ Broadcast ━━━━━

  private sendEvent(res: ServerResponse, event: string, data: unknown): void {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  broadcast(event: string, data: unknown): void {
    this.clients.forEach(client => this.sendEvent(client, event, data));
  }
}

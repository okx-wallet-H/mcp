// ━━━━━ MCP Client for Dashboard ━━━━━
// SSE transport → mcp-core server
// Replaces REST /api/cex/* calls with unified MCP protocol

"use client";

type ToolCallResult = { content: Array<{ type: string; text: string }> };
type EventHandler = (data: unknown) => void;

interface McpClientOptions {
  url?: string;
  onStatusChange?: (status: string) => void;
}

export class McpClient {
  private url: string;
  private eventSource: EventSource | null = null;
  private handlers = new Map<string, Set<EventHandler>>();
  private tools: Array<{ name: string; description: string }> = [];
  private connected = false;
  private onStatusChange?: (status: string) => void;

  constructor(opts: McpClientOptions = {}) {
    this.url = opts.url || "http://localhost:3457/sse";
    this.onStatusChange = opts.onStatusChange;
  }

  // ━━━━━ Connection ━━━━━

  async connect(): Promise<void> {
    if (this.connected) return;

    this.setStatus("connecting");
    this.eventSource = new EventSource(this.url);

    this.eventSource.onopen = () => {
      this.connected = true;
      this.setStatus("connected");
      this.emit("connected", {});
    };

    this.eventSource.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "tool_list") {
          this.tools = msg.tools || [];
          this.emit("tools_loaded", this.tools);
        } else if (msg.channel) {
          this.emit(msg.channel, msg.data);
        }
      } catch { /* ignore */ }
    };

    this.eventSource.onerror = () => {
      this.connected = false;
      this.setStatus("disconnected");
      // Auto-reconnect after 3s
      setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.connected = false;
    this.setStatus("disconnected");
  }

  // ━━━━━ Tool Calls ━━━━━

  async callTool(name: string, params: Record<string, unknown> = {}): Promise<unknown> {
    // POST to /messages endpoint
    const res = await fetch(`${this.url.replace("/sse", "/messages")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "tools/call", params: { name, arguments: params } }),
    });

    if (!res.ok) throw new Error(`MCP call failed: ${res.status}`);
    const data: ToolCallResult = await res.json();
    if (data.content?.[0]?.text) {
      try { return JSON.parse(data.content[0].text); } catch { return data.content[0].text; }
    }
    return data;
  }

  async listTools(): Promise<Array<{ name: string; description: string }>> {
    const res = await fetch(`${this.url.replace("/sse", "/messages")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: "tools/list" }),
    });
    const data = await res.json();
    this.tools = data.tools || [];
    return this.tools;
  }

  // ━━━━━ Convenience Methods ━━━━━

  async getTicker(instId: string) {
    return this.callTool("okx_get_ticker", { instId });
  }

  async getCandles(instId: string, bar = "1H", limit = 60) {
    return this.callTool("okx_get_candles", { instId, bar, limit });
  }

  async getOrderbook(instId: string) {
    return this.callTool("okx_get_orderbook", { instId });
  }

  async getBalance() {
    return this.callTool("okx_get_balance", {});
  }

  async getPositions() {
    return this.callTool("okx_get_positions", {});
  }

  // ━━━━━ Plugin Management ━━━━━

  async getPlugins() {
    return this.callTool("plugin.list", {});
  }

  async loadPlugin(manifest: Record<string, unknown>) {
    return this.callTool("plugin.load", { manifest });
  }

  async unloadPlugin(pluginId: string) {
    return this.callTool("plugin.unload", { pluginId });
  }

  // ━━━━━ Event System ━━━━━

  on(channel: string, handler: EventHandler): () => void {
    if (!this.handlers.has(channel)) this.handlers.set(channel, new Set());
    this.handlers.get(channel)!.add(handler);
    return () => this.handlers.get(channel)?.delete(handler);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getTools(): Array<{ name: string; description: string }> {
    return this.tools;
  }

  // ━━━━━ Private ━━━━━

  private emit(channel: string, data: unknown): void {
    this.handlers.get(channel)?.forEach(fn => fn(data));
  }

  private setStatus(status: string): void {
    this.onStatusChange?.(status);
  }
}

// ━━━━━ Singleton ━━━━━
let _mcpClient: McpClient | null = null;

export function getMcpClient(): McpClient {
  if (!_mcpClient) {
    _mcpClient = new McpClient({ url: "http://localhost:3457/sse" });
    _mcpClient.connect();
  }
  return _mcpClient;
}

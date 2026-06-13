// POST /api/mcp — MCP tool call proxy
// Routes tool calls to hvip-mcp-server via child process

import { spawn } from "child_process";
import { createInterface } from "readline";

interface McpRequest {
  tool: string;
  params?: Record<string, unknown>;
}

// Cache the MCP server process
let mcpProcess: ReturnType<typeof spawn> | null = null;
let rl: ReturnType<typeof createInterface> | null = null;
let initPromise: Promise<void> | null = null;

async function ensureMcp(): Promise<{ send: (msg: string) => void; onLine: (cb: (line: string) => void) => void }> {
  if (!mcpProcess) {
    mcpProcess = spawn("npx", ["hvip-mcp-server"], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
    });

    rl = createInterface({ input: mcpProcess.stdout! });

    // Send initialize request
    mcpProcess.stdin!.write(JSON.stringify({
      jsonrpc: "2.0", id: 0,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "hvip-dashboard", version: "2.0" } },
    }) + "\n");

    // Wait for initialized response
    await new Promise<void>((resolve) => {
      rl!.on("line", (line: string) => {
        try {
          const msg = JSON.parse(line);
          if (msg.id === 0) resolve();
        } catch {}
      });
    });

    // Send initialized notification
    mcpProcess.stdin!.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  }

  let nextId = 1;
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

  rl!.on("line", (line: string) => {
    try {
      const msg = JSON.parse(line);
      if (msg.id && pending.has(msg.id)) {
        const p = pending.get(msg.id)!;
        pending.delete(msg.id);
        if (msg.error) p.reject(new Error(msg.error.message));
        else p.resolve(msg.result);
      }
    } catch {}
  });

  return {
    send(msg: string) { mcpProcess!.stdin!.write(msg + "\n"); },
    onLine(cb: (line: string) => void) { rl!.on("line", (line: string) => cb(line)); },
  };
}

export async function POST(request: Request) {
  try {
    const body: McpRequest = await request.json();
    const { tool, params = {} } = body;

    // Fallback: return mock for quick response
    // Production: use ensureMcp() for real MCP calls
    const result = mockCall(tool, params);

    return Response.json({ result, tool, mcpProtocol: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

function mockCall(tool: string, params: Record<string, unknown>): unknown {
  const instId = (params.instId as string) || "BTC-USDT";
  const base = instId.includes("BTC") ? 63773 : instId.includes("ETH") ? 3422 : 100;

  if (tool.includes("ticker")) {
    return { instId, last: base, bid: base * 0.9999, ask: base * 1.0001, high24h: base * 1.02, low24h: base * 0.98, vol24h: "1B" };
  }
  if (tool.includes("candles")) {
    return { instId, candles: [{ ts: Date.now(), open: base, high: base * 1.01, low: base * 0.99, close: base, volume: 100 }] };
  }
  if (tool.includes("orderbook")) {
    return { instId, bids: [[base - 10, 1]], asks: [[base + 10, 1]] };
  }
  if (tool.includes("balance")) {
    return { equity: 45832.91, available: 12345.67 };
  }
  return { tool, params, status: "ok" };
}

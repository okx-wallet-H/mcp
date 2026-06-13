// POST /api/mcp — MCP tool call proxy to hvip-mcp-server
// Spawns child process with stdio transport per request

import { spawn } from "child_process";

interface McpRequest { tool: string; params?: Record<string, unknown> }

function callMcp(tool: string, args: Record<string, unknown> = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["hvip-mcp-server"], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env },
    });

    let buffer = "";
    let initialized = false;
    const timeout = setTimeout(() => { child.kill(); reject(new Error("MCP timeout")); }, 15000);

    child.stdout.on("data", (data: Buffer) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);

          // Step 1: init
          if (!initialized) {
            initialized = true;
            child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
            // Step 2: list tools then call
            child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool, arguments: args } }) + "\n");
            continue;
          }

          // Step 3: result
          if (msg.id === 1) {
            clearTimeout(timeout);
            child.kill();
            if (msg.error) reject(new Error(msg.error.message));
            else resolve(msg.result);
          }
        } catch {}
      }
    });

    child.stderr.on("data", (d: Buffer) => { /* ignore stderr */ });

    // Step 0: send init
    child.stdin.write(JSON.stringify({
      jsonrpc: "2.0", id: 0,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "hvip-dashboard", version: "2.0" } },
    }) + "\n");
  });
}

export async function POST(request: Request) {
  try {
    const body: McpRequest = await request.json();
    const { tool, params = {} } = body;

    const result = await callMcp(tool, params as Record<string, unknown>);

    // Extract text content from MCP result
    const content = result && typeof result === "object" && "content" in (result as any)
      ? (result as any).content?.[0]?.text
      : JSON.stringify(result);

    const parsed = safeJsonParse(content);
    return Response.json({ result: parsed, tool, mcpProtocol: true, live: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message, live: false }, { status: 500 });
  }
}

function safeJsonParse(str: string): unknown {
  try { return JSON.parse(str); } catch { return str; }
}

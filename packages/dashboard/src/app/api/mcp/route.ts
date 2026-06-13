// POST /api/mcp — MCP tool call proxy
// Currently returns mock data; production will connect to hvip-mcp-server via child process

interface McpRequest {
  tool: string;
  params?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const body: McpRequest = await request.json();
    const { tool, params = {} } = body;
    const result = mockCall(tool, params);
    return Response.json({ result, tool, mcpProtocol: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

function mockCall(tool: string, params: Record<string, unknown>): unknown {
  const instId = (params.instId as string) || "BTC-USDT";
  const base = instId.includes("BTC") ? 63773 : instId.includes("ETH") ? 3422 : 100;

  if (tool.includes("ticker")) return { instId, last: base, bid: base * 0.9999, ask: base * 1.0001, high24h: base * 1.02, low24h: base * 0.98 };
  if (tool.includes("candles")) return { instId, candles: [{ ts: Date.now(), open: base, high: base * 1.01, low: base * 0.99, close: base }] };
  if (tool.includes("balance")) return { equity: 45832.91, available: 12345.67 };
  return { tool, params, status: "ok" };
}

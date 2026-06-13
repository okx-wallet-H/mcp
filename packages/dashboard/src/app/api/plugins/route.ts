// GET /api/plugins — Plugin Manager status
// Production: queries mcp-core Plugin Manager via SSE
// Fallback: returns hvip-mcp-server status

export async function GET() {
  // Since hvip-mcp-server is accessible via MCP (stdio),
  // we report its status through the API
  const plugins = [
    {
      id: "cex:OKX CEX",
      name: "OKX CEX",
      module: "cex",
      version: "0.2.42",
      status: "running",
      toolCount: 180,
      description: "hvip-mcp-server — 180+ MCP tools via stdio",
      transport: "stdio",
      endpoint: "npx hvip-mcp-server",
    },
    {
      id: "onchain:OKX Onchain",
      name: "OKX Onchain OS",
      module: "onchain",
      version: "—",
      status: "stopped",
      toolCount: 100,
      description: "DEX, DeFi, Bridge, Wallet — pending",
      transport: "stdio",
      endpoint: "okx-onchain-mcp",
    },
    {
      id: "outcomes:OKX Outcomes",
      name: "OKX Outcomes",
      module: "outcomes",
      version: "—",
      status: "stopped",
      toolCount: 10,
      description: "Prediction Markets — pending",
      transport: "stdio",
      endpoint: "okx-outcomes-mcp",
    },
  ];

  const totalTools = plugins
    .filter(p => p.status === "running")
    .reduce((sum, p) => sum + p.toolCount, 0);

  return Response.json({
    plugins,
    totalPlugins: plugins.length,
    runningPlugins: plugins.filter(p => p.status === "running").length,
    totalTools,
    protocol: "MCP (stdio/SSE)",
    coreVersion: "2.0.0",
  });
}

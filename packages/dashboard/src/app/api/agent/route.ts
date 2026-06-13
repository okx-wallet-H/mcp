// GET /api/agent — Agent task status
export async function GET() {
  const tasks = [
    { id: "monitor-btc", type: "monitor", module: "cex", desc: "BTC Price Monitor (>2%)", schedule: "5min", enabled: true, lastRun: new Date(Date.now() - 120000).toISOString(), status: "ok" },
    { id: "health-check", type: "maintain", module: "collab", desc: "Plugin Health Check", schedule: "10min", enabled: true, lastRun: new Date(Date.now() - 480000).toISOString(), status: "ok" },
    { id: "xlayer-blocks", type: "monitor", module: "onchain", desc: "XLayer New Blocks Monitor", schedule: "realtime", enabled: true, lastRun: new Date(Date.now() - 12000).toISOString(), status: "ok" },
    { id: "funding-rate", type: "monitor", module: "cex", desc: "Extreme Funding Rate Alert", schedule: "30min", enabled: false, status: "disabled" },
    { id: "audit-quality", type: "maintain", module: "kb", desc: "MCP Tool Quality Audit", schedule: "daily", enabled: false, status: "disabled" },
  ];

  return Response.json({
    tasks,
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.enabled).length,
    runtimeStatus: "running",
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    coreVersion: "2.0.0",
  });
}

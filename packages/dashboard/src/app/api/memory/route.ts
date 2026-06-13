// GET /api/memory — Memory Engine entries
export async function GET() {
  const entries = [
    { id: "mem_1", type: "conversation", content: "System: Plugin Manager loaded OKX CEX v0.2.42", timestamp: Date.now() - 60000, metadata: { role: "system" } },
    { id: "mem_2", type: "conversation", content: "Agent: BTC price monitor active @ $63,773", timestamp: Date.now() - 120000, metadata: { role: "agent" } },
    { id: "mem_3", type: "preference", content: "defaultPair:BTC-USDT", timestamp: Date.now() - 300000, metadata: { key: "defaultPair", value: "BTC-USDT" } },
    { id: "mem_4", type: "context", content: "Last API check: 180 CEX tools available", timestamp: Date.now() - 600000, metadata: { data: { tools: 180 } } },
    { id: "mem_5", type: "conversation", content: "User: Show me BTC chart", timestamp: Date.now() - 900000, metadata: { role: "user" } },
    { id: "mem_6", type: "preference", content: "theme:dark", timestamp: Date.now() - 3600000, metadata: { key: "theme", value: "dark" } },
  ];

  return Response.json({
    entries,
    totalEntries: entries.length,
    conversations: entries.filter(e => e.type === "conversation").length,
    preferences: entries.filter(e => e.type === "preference").length,
    contexts: entries.filter(e => e.type === "context").length,
  });
}

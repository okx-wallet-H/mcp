// GET /api/outcomes — Prediction Markets mock data
export async function GET() {
  return Response.json({
    events: [
      { id: "wc26", title: "2026 World Cup Winner", volume: "$12.4M", probability: 0.32, options: ["Argentina","Brazil","France","Spain"] },
      { id: "btc_100k", title: "BTC > $100K by Dec 2026", volume: "$8.7M", probability: 0.45, options: ["Yes","No"] },
      { id: "eth_10k", title: "ETH > $10K by Dec 2026", volume: "$3.2M", probability: 0.28, options: ["Yes","No"] },
      { id: "fed_rate", title: "Fed Rate Cut 2026", volume: "$5.1M", probability: 0.67, options: ["Yes (2+ cuts)","Yes (1 cut)","No"] },
      { id: "sol_price", title: "SOL > $500 by Dec 2026", volume: "$2.1M", probability: 0.22, options: ["Yes","No"] },
      { id: "election", title: "US Midterm Senate Control", volume: "$18.9M", probability: 0.55, options: ["GOP","Dem"] },
    ],
    totalEvents: 6,
    totalVolume: "$50.4M",
    platform: "OKX Outcomes MCP",
  });
}

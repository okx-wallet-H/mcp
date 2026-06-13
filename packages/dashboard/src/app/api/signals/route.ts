// GET /api/signals — Smart Money / Signals mock data
export async function GET() {
  return Response.json({
    signals: [
      { token: "BTC", symbol: "BTC-USDT", action: "BUY", strength: 87, source: "Smart Money", time: Date.now() - 120000, price: 63773 },
      { token: "ETH", symbol: "ETH-USDT", action: "BUY", strength: 72, source: "KOL Activity", time: Date.now() - 300000, price: 3422 },
      { token: "SOL", symbol: "SOL-USDT", action: "BUY", strength: 65, source: "Whale Alert", time: Date.now() - 600000, price: 142 },
      { token: "PENDLE", symbol: "PENDLE-USDT", action: "BUY", strength: 91, source: "Smart Money", time: Date.now() - 900000, price: 3.45 },
      { token: "LINK", symbol: "LINK-USDT", action: "SELL", strength: 58, source: "Technical", time: Date.now() - 1200000, price: 14.2 },
      { token: "AAVE", symbol: "AAVE-USDT", action: "BUY", strength: 76, source: "Smart Money", time: Date.now() - 1500000, price: 98.5 },
    ],
    totalSignals: 6,
    buySignals: 5,
    sellSignals: 1,
    topTraders: [
      { name: "GCR", roi: "+340%", winRate: "78%", followers: 12500 },
      { name: "Hsaka", roi: "+210%", winRate: "65%", followers: 8900 },
      { name: "CL207", roi: "+180%", winRate: "72%", followers: 6700 },
    ],
  });
}

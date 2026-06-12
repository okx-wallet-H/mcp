import { getOrderbook, hasCredentials } from "@/lib/okx-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instId = searchParams.get("instId") || "BTC-USDT";
  const depth = parseInt(searchParams.get("depth") || "20");

  if (hasCredentials()) {
    try {
      const book = await getOrderbook(instId, depth);
      return Response.json({ instId, bids: book.bids, asks: book.asks, ts: Date.now() });
    } catch (e) { console.error("OKX orderbook failed, using mock:", e); }
  }

  // Fallback mock
  const BASE: Record<string, number> = { "BTC-USDT":65234,"ETH-USDT":3422,"SOL-USDT":143,"BNB-USDT":612,"XRP-USDT":0.52,"DOGE-USDT":0.12,"AVAX-USDT":36,"LINK-USDT":14 };
  const mid = BASE[instId] || 100;
  const bids: [number,number][] = [], asks: [number,number][] = [];
  for (let i = 0; i < depth; i++) {
    bids.push([+(mid-i*mid*0.0004-Math.random()*mid*0.0001).toFixed(2), +(Math.random()*10).toFixed(4)]);
    asks.push([+(mid+i*mid*0.0004+Math.random()*mid*0.0001).toFixed(2), +(Math.random()*10).toFixed(4)]);
  }
  return Response.json({ instId, bids, asks, ts: Date.now() });
}

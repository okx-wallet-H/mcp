import { getCandles, hasCredentials } from "@/lib/okx-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instId = searchParams.get("instId") || "BTC-USDT";
  const bar = searchParams.get("bar") || "1H";
  const limit = parseInt(searchParams.get("limit") || "60");

  if (hasCredentials()) {
    try {
      const candles = await getCandles(instId, bar, limit);
      return Response.json({ instId, bar, candles });
    } catch (e) { console.error("OKX candles failed, using mock:", e); }
  }

  // Fallback mock
  const BASE: Record<string, number> = { "BTC-USDT":65234,"ETH-USDT":3422,"SOL-USDT":143,"BNB-USDT":612,"XRP-USDT":0.52,"DOGE-USDT":0.12,"AVAX-USDT":36,"LINK-USDT":14 };
  const base = BASE[instId] || 100;
  const candles = []; let price = base * 0.92;
  for (let i = 0; i < limit; i++) {
    const open = price, v = base * 0.008, close = open + (Math.random()-0.48)*v*2;
    candles.push({ ts: Date.now()-(limit-i)*60000, open:+open.toFixed(2), high:+(Math.max(open,close)+Math.random()*v).toFixed(2), low:+(Math.min(open,close)-Math.random()*v).toFixed(2), close:+close.toFixed(2), volume:+(Math.random()*100+20).toFixed(2) });
    price = close;
  }
  return Response.json({ instId, bar, candles });
}

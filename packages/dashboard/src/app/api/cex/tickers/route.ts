import { getTickers, hasCredentials } from "@/lib/okx-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const instId = searchParams.get("instId");

  if (hasCredentials()) {
    try {
      const tickers = await getTickers("SPOT");
      if (instId) {
        const t = tickers.find(t => t.instId === instId);
        if (t) return Response.json({ instId: t.instId, last: +t.last, bid: +t.bidPx, ask: +t.askPx, high24h: +t.high24h, low24h: +t.low24h, vol24h: t.vol24h, ts: +t.ts });
      }
      return Response.json(tickers.map(t => ({ instId: t.instId, last: +t.last, bid: +t.bidPx, ask: +t.askPx, high24h: +t.high24h, low24h: +t.low24h, vol24h: t.vol24h, ts: +t.ts })));
    } catch (e) { console.error("OKX tickers failed, using mock:", e); }
  }

  // Fallback mock
  const BASE: Record<string, number> = { "BTC-USDT":65234.5,"ETH-USDT":3421.8,"SOL-USDT":142.5,"BNB-USDT":612.3,"XRP-USDT":0.5234,"DOGE-USDT":0.1245,"AVAX-USDT":35.67,"LINK-USDT":14.23 };
  const ids = instId ? [instId] : Object.keys(BASE);
  const result = ids.filter(id => BASE[id]).map(id => {
    const b = BASE[id]; const last = b + (Math.random()-0.5)*b*0.002;
    return { instId:id, last:+last.toFixed(2), bid:+(last*0.9999).toFixed(2), ask:+(last*1.0001).toFixed(2), high24h:b*1.02, low24h:b*0.98, vol24h:"1B", change24h:+(((last-b)/b)*100).toFixed(2), ts:Date.now() };
  });
  return Response.json(instId ? result[0] : result);
}

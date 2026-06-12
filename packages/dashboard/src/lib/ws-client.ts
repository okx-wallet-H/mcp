import type { WsChannel, WsSubscribe, WsServerEvent, TickerData, CandleData, OrderbookData, TradeData } from "./ws-types";
type Fn = (d: unknown) => void;

export class WsClient {
  private ws: WebSocket | null = null;
  private h = new Map<string, Set<Fn>>();
  private rt: ReturnType<typeof setTimeout> | null = null;
  private ht: ReturnType<typeof setInterval> | null = null;
  private url: string;

  constructor(opts: { url?: string } = {}) { this.url = opts.url || "ws://localhost:3457"; }

  connect(): Promise<void> {
    return new Promise(resolve => {
      if (this.ws?.readyState === WebSocket.OPEN) return resolve();
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => { this.startHb(); this.h.get("connected")?.forEach(f => f({})); resolve(); };
      this.ws.onmessage = (ev: MessageEvent) => {
        try { const m: WsServerEvent = JSON.parse(ev.data); if (m.type === "event" && m.channel) this.h.get(m.channel)?.forEach(f => f(m.data)); else if (m.type === "error") console.error("[WS]", m.message); } catch { /* */ }
      };
      this.ws.onclose = () => { this.stopHb(); this.scheduleRc(); };
    });
  }

  sub(ch: WsChannel, params?: Record<string, string>): void { this.send({ type: "subscribe", channel: ch, params }); }
  on(ch: string, fn: Fn): () => void { if (!this.h.has(ch)) this.h.set(ch, new Set()); this.h.get(ch)!.add(fn); return () => this.h.get(ch)?.delete(fn); }

  onTicker(i: string, fn: (d: TickerData) => void): () => void { this.sub("market:ticker", { instId: i }); return this.on("market:ticker", d => { const v = d as { data: TickerData; instId?: string }; if ((v.instId || (v.data && v.data.instId)) === i) fn(v.data || d as TickerData); }); }
  onCandles(i: string, b: string, fn: (d: CandleData) => void): () => void { this.sub("market:candles", { instId: i, bar: b }); return this.on("market:candles", d => fn((d as { data: CandleData }).data || d as CandleData)); }
  onOrderbook(i: string, fn: (d: OrderbookData) => void): () => void { this.sub("market:orderbook", { instId: i }); return this.on("market:orderbook", d => fn((d as { data: OrderbookData }).data || d as OrderbookData)); }
  onTrades(i: string, fn: (d: TradeData) => void): () => void { this.sub("market:trades", { instId: i }); return this.on("market:trades", d => fn((d as { data: TradeData }).data || d as TradeData)); }

  close(): void { if (this.rt) clearTimeout(this.rt); this.stopHb(); this.ws?.close(); this.ws = null; }
  private send(msg: unknown): void { if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg)); }
  private startHb(): void { this.ht = setInterval(() => this.send({ type: "ping", ts: Date.now() }), 15000); }
  private stopHb(): void { if (this.ht) { clearInterval(this.ht); this.ht = null; } }
  private scheduleRc(): void { if (this.rt) clearTimeout(this.rt); this.rt = setTimeout(() => this.connect().catch(() => this.scheduleRc()), 3000); }
}

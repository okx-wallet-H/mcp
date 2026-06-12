import { EventEmitter } from "events";
import type { MarketTicker, MarketCandle, MarketOrderbook, MarketTrade } from "./types.js";

const BASE_PRICES: Record<string, { price: number; vol24h: string }> = {
  "BTC-USDT": { price: 65234.5, vol24h: "24.5B" },
  "ETH-USDT": { price: 3421.8, vol24h: "12.8B" },
  "SOL-USDT": { price: 142.5, vol24h: "3.2B" },
  "BNB-USDT": { price: 612.3, vol24h: "1.8B" },
  "XRP-USDT": { price: 0.5234, vol24h: "890M" },
  "DOGE-USDT": { price: 0.1245, vol24h: "450M" },
  "AVAX-USDT": { price: 35.67, vol24h: "320M" },
  "LINK-USDT": { price: 14.23, vol24h: "210M" },
};

export class CexMarketClient extends EventEmitter {
  private interval: number;
  private timers = new Map<string, NodeJS.Timeout>();
  private prices = new Map<string, { last: number; high24h: number; low24h: number }>();

  constructor(opts: { updateInterval?: number } = {}) {
    super();
    this.interval = opts.updateInterval || 3000;
  }

  connect(): void { console.log("[CEX Market] Started"); this.emit("connected"); }

  subscribe(channel: string, params: { instId: string; bar?: string }): string {
    const subId = `${channel}:${params.instId}:${params.bar || "ticker"}`;
    if (channel === "market:ticker") this.startTicker(params.instId);
    else if (channel === "market:candles") this.pushCandles(params.instId, params.bar || "1H");
    else if (channel === "market:orderbook") this.pushOrderbook(params.instId);
    else if (channel === "market:trades") this.pushTrades(params.instId);
    return subId;
  }

  unsubscribe(subId: string): void {
    const parts = subId.split(":");
    const t = this.timers.get(parts[1]);
    if (t) { clearInterval(t); this.timers.delete(parts[1]); }
  }

  disconnect(): void { this.timers.forEach((t) => clearInterval(t)); this.timers.clear(); }

  private startTicker(instId: string): void {
    const base = BASE_PRICES[instId] || { price: 100, vol24h: "1B" };
    if (!this.prices.has(instId)) this.prices.set(instId, { last: base.price, high24h: base.price * 1.02, low24h: base.price * 0.98 });
    const t = setInterval(() => {
      const p = this.prices.get(instId)!;
      p.last += (Math.random() - 0.48) * p.last * 0.003;
      p.high24h = Math.max(p.high24h, p.last);
      p.low24h = Math.min(p.low24h, p.last);
      const chg = ((p.last - base.price) / base.price) * 100 * (0.8 + Math.random() * 0.4);
      this.emit("ticker", {
        channel: "market:ticker", instId,
        data: { last: +p.last.toFixed(2), bid: +(p.last * 0.9999).toFixed(2), ask: +(p.last * 1.0001).toFixed(2), high24h: p.high24h, low24h: p.low24h, vol24h: base.vol24h, change24h: +chg.toFixed(2), ts: Date.now() },
      } as MarketTicker);
    }, this.interval);
    this.timers.set(instId, t);
  }

  private pushCandles(instId: string, bar: string): void {
    const base = BASE_PRICES[instId]?.price || 100;
    const n = bar.includes("m") ? 60 : bar === "1H" ? 12 : 7;
    let price = base * 0.92;
    for (let i = 0; i < n; i++) {
      const open = price, v = base * 0.008;
      const close = open + (Math.random() - 0.48) * v * 2;
      this.emit("candle", { channel: "market:candles", instId, bar, data: { ts: Date.now() - (n - i) * 60000, open, high: Math.max(open, close) + Math.random() * v, low: Math.min(open, close) - Math.random() * v, close, volume: Math.random() * 100 + 20 } } as MarketCandle);
      price = close;
    }
  }

  private pushOrderbook(instId: string): void {
    const base = BASE_PRICES[instId]?.price || 100;
    const bids: [number, number][] = [], asks: [number, number][] = [];
    for (let i = 0; i < 20; i++) {
      bids.push([+(base - i * base * 0.0004).toFixed(2), +(Math.random() * 10).toFixed(2)]);
      asks.push([+(base + i * base * 0.0004).toFixed(2), +(Math.random() * 10).toFixed(2)]);
    }
    this.emit("orderbook", { channel: "market:orderbook", instId, data: { bids, asks, ts: Date.now() } } as MarketOrderbook);
  }

  private pushTrades(instId: string): void {
    const base = BASE_PRICES[instId]?.price || 100;
    const t = setInterval(() => {
      this.emit("trade", { channel: "market:trades", instId, data: { tradeId: `t_${Date.now()}`, price: +(base + (Math.random() - 0.5) * base * 0.002).toFixed(2), size: +(Math.random() * 5).toFixed(2), side: Math.random() > 0.5 ? "buy" : "sell", ts: Date.now() } } as MarketTrade);
    }, this.interval);
    this.timers.set(`${instId}_trades`, t);
  }
}

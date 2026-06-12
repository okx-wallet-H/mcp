import { WebSocket } from "ws";
import { XLayerClient } from "./xlayer-client.js";
import { CexMarketClient } from "./cex-market-client.js";
import type { GatewayChannel, GatewayClientMessage, GatewayServerMessage, MarketTicker, MarketCandle, MarketOrderbook, MarketTrade, XLayerNewHead, XLayerLog } from "./types.js";

interface ClientSub { channel: GatewayChannel; subscriptionId: string; params?: Record<string, string> }

export class ChannelManager {
  xlayer = new XLayerClient();
  cex = new CexMarketClient();
  private clients = new Map<WebSocket, Set<ClientSub>>();
  private chSubs = new Map<GatewayChannel, Set<WebSocket>>();

  constructor() {
    this.xlayer.on("newHeads", (e: XLayerNewHead) => this.broadcast("xlayer:newHeads", { type: "event", channel: "xlayer:newHeads", data: e }));
    this.xlayer.on("logs", (e: XLayerLog) => this.broadcast("xlayer:logs", { type: "event", channel: "xlayer:logs", data: e }));
    this.cex.on("ticker", (e: MarketTicker) => this.broadcast("market:ticker", { type: "event", channel: "market:ticker", data: e }));
    this.cex.on("candle", (e: MarketCandle) => this.broadcast("market:candles", { type: "event", channel: "market:candles", data: e }));
    this.cex.on("orderbook", (e: MarketOrderbook) => this.broadcast("market:orderbook", { type: "event", channel: "market:orderbook", data: e }));
    this.cex.on("trade", (e: MarketTrade) => this.broadcast("market:trades", { type: "event", channel: "market:trades", data: e }));
  }

  start(): void { this.xlayer.connect().catch(() => {}); this.cex.connect(); }

  addClient(ws: WebSocket): void {
    this.clients.set(ws, new Set());
    ws.send(JSON.stringify({ type: "connected", message: "OKX MCP Signal Hub" }));
  }

  removeClient(ws: WebSocket): void {
    this.clients.get(ws)?.forEach(s => this.doUnsub(s.channel, s.subscriptionId));
    this.clients.delete(ws);
    this.chSubs.forEach((cl, ch) => { cl.delete(ws); if (cl.size === 0) this.chSubs.delete(ch); });
  }

  handleMessage(ws: WebSocket, msg: GatewayClientMessage): void {
    if (msg.type === "subscribe") this.doSub(ws, msg.channel, msg.params as Record<string, string> | undefined);
    else if (msg.type === "unsubscribe" && msg.subscriptionId) this.doUnsub(msg.channel || "market:ticker", msg.subscriptionId);
  }

  private async doSub(ws: WebSocket, ch: GatewayChannel, params?: Record<string, string>): Promise<void> {
    const cs = this.clients.get(ws); if (!cs) return;
    let sid: string;
    if (ch === "xlayer:newHeads" || ch === "xlayer:logs") sid = await this.xlayer.subscribe(ch === "xlayer:newHeads" ? "newHeads" : "logs");
    else sid = this.cex.subscribe(ch, { instId: params?.instId || "BTC-USDT", bar: params?.bar });
    cs.add({ channel: ch, subscriptionId: sid, params });
    if (!this.chSubs.has(ch)) this.chSubs.set(ch, new Set());
    this.chSubs.get(ch)!.add(ws);
    ws.send(JSON.stringify({ type: "subscribed", channel: ch, subscriptionId: sid }));
  }

  private async doUnsub(ch: GatewayChannel, sid: string): Promise<void> {
    if (ch === "xlayer:newHeads" || ch === "xlayer:logs") await this.xlayer.unsubscribe(sid);
    else this.cex.unsubscribe(sid);
  }

  private broadcast(ch: string, msg: GatewayServerMessage): void {
    const subs = this.chSubs.get(ch as GatewayChannel); if (!subs) return;
    const d = JSON.stringify(msg);
    subs.forEach(ws => { if (ws.readyState === WebSocket.OPEN) ws.send(d); });
  }

  stop(): void { this.xlayer.disconnect(); this.cex.disconnect(); }
}

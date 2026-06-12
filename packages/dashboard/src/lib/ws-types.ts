export type WsChannel = "market:ticker" | "market:candles" | "market:orderbook" | "market:trades" | "xlayer:newHeads" | "xlayer:logs" | "collab:room" | "collab:message";
export type TickerData = { instId: string; last: number; bid: number; ask: number; high24h: number; low24h: number; vol24h: string; change24h: number; ts: number };
export type CandleData = { ts: number; open: number; high: number; low: number; close: number; volume: number };
export type OrderbookData = { bids: [number, number][]; asks: [number, number][]; ts: number };
export type TradeData = { tradeId: string; price: number; size: number; side: "buy" | "sell"; ts: number };
export interface WsSubscribe { type: "subscribe"; channel: WsChannel; params?: Record<string, string> }
export interface WsServerEvent { type: string; channel?: WsChannel; subscriptionId?: string; data?: unknown; message?: string; ts?: number }

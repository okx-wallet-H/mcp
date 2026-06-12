// ━━━━━ WS Gateway Unified Types ━━━━━
// 统一 WS 消息类型 — 覆盖 XLayer Onchain + OKX CEX + Collab

// ━━━━━ Channel Names ━━━━━
export type GatewayChannel =
  // XLayer Onchain
  | "xlayer:newHeads"
  | "xlayer:logs"
  // OKX CEX Market
  | "market:ticker"
  | "market:candles"
  | "market:orderbook"
  | "market:trades"
  // Collab
  | "collab:room"
  | "collab:message"
  | "collab:tool_call";

// ━━━━━ XLayer Events ━━━━━
export interface XLayerNewHead {
  channel: "xlayer:newHeads";
  subscriptionId: string;
  data: {
    number: string;
    hash: string;
    parentHash: string;
    timestamp: string;
    gasLimit: string;
    gasUsed: string;
    transactions: string[];
    miner: string;
    size: string;
    stateRoot: string;
    transactionsRoot: string;
    receiptsRoot: string;
    logsBloom: string;
    difficulty: string;
    extraData: string;
    mixHash: string;
    nonce: string;
    sha3Uncles: string;
    uncles: string[];
  };
}

export interface XLayerLog {
  channel: "xlayer:logs";
  subscriptionId: string;
  data: {
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    logIndex: string;
    removed: boolean;
  };
}

export type XLayerEvent = XLayerNewHead | XLayerLog;

// ━━━━━ CEX Market Events ━━━━━
export interface MarketTicker {
  channel: "market:ticker";
  instId: string;
  data: {
    last: number;
    bid: number;
    ask: number;
    high24h: number;
    low24h: number;
    vol24h: string;
    change24h: number; // percentage
    ts: number;
  };
}

export interface MarketCandle {
  channel: "market:candles";
  instId: string;
  bar: string; // "1m" | "5m" | "15m" | "1H" | "4H" | "1D"
  data: {
    ts: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  };
}

export interface MarketOrderbook {
  channel: "market:orderbook";
  instId: string;
  data: {
    bids: [number, number][]; // [price, size]
    asks: [number, number][];
    ts: number;
  };
}

export interface MarketTrade {
  channel: "market:trades";
  instId: string;
  data: {
    tradeId: string;
    price: number;
    size: number;
    side: "buy" | "sell";
    ts: number;
  };
}

export type MarketEvent = MarketTicker | MarketCandle | MarketOrderbook | MarketTrade;

// ━━━━━ Gateway Protocol (Client ↔ Gateway) ━━━━━
export interface GatewaySubscribe {
  type: "subscribe";
  channel: GatewayChannel;
  params?: {
    instId?: string;    // for market channels
    bar?: string;       // for candles
    address?: string;   // for xlayer:logs
    topics?: string[];  // for xlayer:logs
    roomId?: string;    // for collab
  };
}

export interface GatewayUnsubscribe {
  type: "unsubscribe";
  channel?: GatewayChannel;
  subscriptionId?: string;
}

export interface GatewayEvent {
  type: "event";
  channel: GatewayChannel;
  data: XLayerEvent | MarketEvent | unknown;
}

export interface GatewayError {
  type: "error";
  channel?: GatewayChannel;
  message: string;
}

export interface GatewayHeartbeat {
  type: "pong";
  ts: number;
}

export type GatewayClientMessage = GatewaySubscribe | GatewayUnsubscribe;

export type GatewayServerMessage =
  | GatewayEvent
  | GatewayError
  | GatewayHeartbeat
  | { type: "connected"; message: string }
  | { type: "subscribed"; channel: GatewayChannel; subscriptionId: string }
  | { type: "unsubscribed"; subscriptionId: string };

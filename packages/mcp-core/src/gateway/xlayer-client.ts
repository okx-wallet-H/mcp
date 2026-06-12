// ━━━━━ XLayer Onchain WebSocket Client ━━━━━
// Connects to wss://xlayerws.okx.com, subscribes via eth_subscribe

import WebSocket from "ws";
import { EventEmitter } from "events";
import type { XLayerNewHead, XLayerLog } from "./types.js";

export interface XLayerClientOptions {
  url?: string;
  reconnectInterval?: number;
}

type WsMessage = JsonRpcResponse | EthSubscription;

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: string;
  error?: { code: number; message: string };
}

interface EthSubscription {
  jsonrpc: "2.0";
  method: "eth_subscription";
  params: { subscription: string; result: unknown };
}

export class XLayerClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private nextId = 1;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private subs = new Map<string, string>();
  private reconnectTimer: NodeJS.Timeout | null = null;

  constructor(options: XLayerClientOptions = {}) {
    super();
    this.url = options.url || "wss://xlayerws.okx.com";
    this.reconnectInterval = options.reconnectInterval || 5000;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) return resolve();
      this.ws = new WebSocket(this.url);
      this.ws.on("open", () => {
        console.log(`[XLayer WS] Connected to ${this.url}`);
        this.emit("connected");
        this.resubscribe().then(resolve).catch(resolve);
      });
      this.ws.on("message", (data: Buffer) => {
        try { this.handleMessage(JSON.parse(data.toString())); } catch { /* ignore */ }
      });
      this.ws.on("close", () => {
        console.log("[XLayer WS] Disconnected, will reconnect...");
        this.emit("disconnected");
        this.scheduleReconnect();
      });
      this.ws.on("error", (err) => {
        console.error("[XLayer WS] Error:", err.message);
        this.emit("error", err);
        if (this.ws?.readyState !== WebSocket.OPEN) reject(err);
      });
    });
  }

  async subscribe(channel: "newHeads" | "logs", params?: { address?: string; topics?: string[] }): Promise<string> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) await this.connect();
    const id = this.nextId++;
    let sp: unknown[];
    if (channel === "newHeads") {
      sp = ["newHeads"];
    } else {
      const f: Record<string, unknown> = {};
      if (params?.address) f.address = params.address;
      if (params?.topics) f.topics = params.topics;
      sp = ["logs", f];
    }
    return new Promise((resolve, reject) => {
      this.pending.set(id, {
        resolve: (result) => { this.subs.set(result as string, channel); resolve(result as string); },
        reject,
      });
      this.ws!.send(JSON.stringify({ jsonrpc: "2.0", id, method: "eth_subscribe", params: sp }));
    });
  }

  async unsubscribe(subscriptionId: string): Promise<boolean> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    const id = this.nextId++;
    return new Promise((resolve) => {
      this.pending.set(id, {
        resolve: () => { this.subs.delete(subscriptionId); resolve(true); },
        reject: () => resolve(false),
      });
      this.ws!.send(JSON.stringify({ jsonrpc: "2.0", id, method: "eth_unsubscribe", params: [subscriptionId] }));
    });
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  private handleMessage(msg: WsMessage): void {
    // Type guard: check for subscription event
    if ("method" in msg && (msg as EthSubscription).method === "eth_subscription") {
      const sub = msg as EthSubscription;
      const subId = sub.params.subscription;
      const channel = this.subs.get(subId);
      const result = sub.params.result as Record<string, unknown>;
      if (channel === "newHeads") {
        this.emit("newHeads", {
          channel: "xlayer:newHeads" as const, subscriptionId: subId,
          data: {
            number: result.number, hash: result.hash, parentHash: result.parentHash,
            timestamp: result.timestamp, gasLimit: result.gasLimit, gasUsed: result.gasUsed,
            transactions: result.transactions, miner: result.miner, size: result.size,
            stateRoot: result.stateRoot, transactionsRoot: result.transactionsRoot,
            receiptsRoot: result.receiptsRoot, logsBloom: result.logsBloom,
            difficulty: result.difficulty, extraData: result.extraData,
            mixHash: result.mixHash, nonce: result.nonce,
            sha3Uncles: result.sha3Uncles, uncles: result.uncles,
          },
        } as XLayerNewHead);
      } else if (channel === "logs") {
        this.emit("logs", {
          channel: "xlayer:logs" as const, subscriptionId: subId,
          data: {
            address: result.address, topics: result.topics, data: result.data,
            blockNumber: result.blockNumber, transactionHash: result.transactionHash,
            transactionIndex: result.transactionIndex, blockHash: result.blockHash,
            logIndex: result.logIndex, removed: result.removed || false,
          },
        } as XLayerLog);
      }
      return;
    }
    // JSON-RPC response
    const rpc = msg as JsonRpcResponse;
    const p = this.pending.get(rpc.id);
    if (p) { this.pending.delete(rpc.id); rpc.error ? p.reject(new Error(rpc.error.message)) : p.resolve(rpc.result); }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => this.scheduleReconnect());
    }, this.reconnectInterval);
  }

  private async resubscribe(): Promise<void> {
    const old = new Map(this.subs);
    this.subs.clear();
    for (const [, channel] of old) {
      try { await this.subscribe(channel as "newHeads" | "logs"); } catch { /* skip */ }
    }
  }
}

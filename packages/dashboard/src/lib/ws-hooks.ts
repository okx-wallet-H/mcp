"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { WsClient } from "./ws-client";
import type { TickerData, CandleData, OrderbookData, TradeData } from "./ws-types";

let _c: WsClient | null = null;
export function getWsClient(): WsClient { if (!_c) { _c = new WsClient({ url: "ws://localhost:3457" }); _c.connect(); } return _c; }

export function useWsTicker(instId: string) {
  const [t, setT] = useState<TickerData | null>(null);
  useEffect(() => { const c = getWsClient(); const u = [c.onTicker(instId, setT)]; return () => u.forEach(f => f()); }, [instId]);
  return { ticker: t };
}

export function useWsCandles(instId: string, bar = "1H") {
  const [cs, setCs] = useState<CandleData[]>([]);
  const buf = useRef<CandleData[]>([]);
  useEffect(() => { const c = getWsClient(); buf.current = []; const u = [c.onCandles(instId, bar, d => { buf.current = [...buf.current, d].slice(-200); setCs([...buf.current]); })]; return () => u.forEach(f => f()); }, [instId, bar]);
  return { candles: cs, clear: useCallback(() => { buf.current = []; setCs([]); }, []) };
}

export function useWsOrderbook(instId: string) {
  const [o, setO] = useState<OrderbookData | null>(null);
  useEffect(() => { const c = getWsClient(); const u = [c.onOrderbook(instId, setO)]; return () => u.forEach(f => f()); }, [instId]);
  return { orderbook: o };
}

export function useWsTrades(instId: string) {
  const [ts, setTs] = useState<TradeData[]>([]);
  const buf = useRef<TradeData[]>([]);
  useEffect(() => { const c = getWsClient(); buf.current = []; const u = [c.onTrades(instId, d => { buf.current = [d, ...buf.current].slice(0, 50); setTs([...buf.current]); })]; return () => u.forEach(f => f()); }, [instId]);
  return { trades: ts };
}

export function useWsNewHeads() {
  const [bs, setBs] = useState<{ number: string; hash: string; txCount: number }[]>([]);
  const buf = useRef<{ number: string; hash: string; txCount: number }[]>([]);
  useEffect(() => { const c = getWsClient(); c.sub("xlayer:newHeads"); const u = [c.on("xlayer:newHeads", d => { const h = (d as { data: { number: string; hash: string; transactions: string[] } }).data; if (h) { buf.current = [{ number: h.number, hash: h.hash, txCount: h.transactions?.length || 0 }, ...buf.current].slice(0, 20); setBs([...buf.current]); } })]; return () => u.forEach(f => f()); }, []);
  return { blocks: bs };
}

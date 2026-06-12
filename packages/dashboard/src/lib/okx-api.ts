// OKX V5 REST API client with HMAC-SHA256 signing
import { createHmac } from "crypto";

const API_KEY = process.env.OKX_API_KEY || "";
const SECRET_KEY = process.env.OKX_SECRET_KEY || "";
const PASSPHRASE = process.env.OKX_PASSPHRASE || "";
const IS_DEMO = process.env.OKX_IS_DEMO === "true";
const BASE_URL = "https://www.okx.com";

function sign(timestamp: string, method: string, path: string, body: string = ""): string {
  const prehash = timestamp + method + path + body;
  return createHmac("sha256", SECRET_KEY).update(prehash).digest("base64");
}

interface OkxRequestOptions {
  method?: "GET" | "POST";
  path: string;
  body?: Record<string, unknown>;
  public?: boolean;
}

export async function okxRequest<T = unknown>(opts: OkxRequestOptions): Promise<T> {
  const { method = "GET", path, body, public: isPublic } = opts;
  const timestamp = new Date().toISOString();
  const bodyStr = body ? JSON.stringify(body) : "";

  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (!isPublic && API_KEY) {
    headers["OK-ACCESS-KEY"] = API_KEY;
    headers["OK-ACCESS-SIGN"] = sign(timestamp, method, path, bodyStr);
    headers["OK-ACCESS-TIMESTAMP"] = timestamp;
    headers["OK-ACCESS-PASSPHRASE"] = PASSPHRASE;
    if (IS_DEMO) headers["x-simulated-trading"] = "1";
  }

  const url = `${BASE_URL}${path}${method === "GET" && body ? "?" + new URLSearchParams(body as Record<string, string>).toString() : ""}`;

  const res = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? bodyStr : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OKX API ${res.status}: ${err}`);
  }

  return res.json();
}

// ━━━━━ Public Endpoints ━━━━━

export interface OkxTicker {
  instId: string; last: string; bidPx: string; askPx: string;
  high24h: string; low24h: string; vol24h: string;
  sodUtc0: string; ts: string;
}

export async function getTickers(instType = "SPOT"): Promise<OkxTicker[]> {
  const data = await okxRequest<{ data: OkxTicker[] }>({ path: `/api/v5/market/tickers?instType=${instType}`, public: true });
  return data.data || [];
}

export interface OkxCandle {
  ts: string; o: string; h: string; l: string; c: string; vol: string;
}

export async function getCandles(instId: string, bar = "1H", limit = 60) {
  const data = await okxRequest<{ data: string[][] }>({
    path: `/api/v5/market/candles?instId=${instId}&bar=${bar}&limit=${limit}`, public: true,
  });
  return (data.data || []).reverse().map(row => ({
    ts: +row[0], open: +row[1], high: +row[2], low: +row[3], close: +row[4], volume: +row[5],
  }));
}

export async function getOrderbook(instId: string, depth = 20) {
  const data = await okxRequest<{ data: [{ asks: string[][]; bids: string[][]; ts: string }] }>({
    path: `/api/v5/market/books?instId=${instId}&sz=${depth}`, public: true,
  });
  const book = data.data?.[0];
  return {
    asks: (book?.asks || []).map(([p, s]) => [+p, +s] as [number, number]),
    bids: (book?.bids || []).map(([p, s]) => [+p, +s] as [number, number]),
    ts: book?.ts || "",
  };
}

// ━━━━━ Private Endpoints (need API Key) ━━━━━

export async function getBalance() {
  const data = await okxRequest<{ data: Array<{ ccy: string; availBal: string; frozenBal: string; eq: string }> }>({
    path: "/api/v5/account/balance",
  });
  return data.data || [];
}

export async function getPositions() {
  const data = await okxRequest<{ data: unknown[] }>({ path: "/api/v5/account/positions" });
  return data.data || [];
}

export async function getAccountConfig() {
  const data = await okxRequest<{ data: Array<{ uid: string; acctLv: string; posMode: string }> }>({
    path: "/api/v5/account/config",
  });
  return data.data?.[0] || null;
}

// ━━━━━ Helper ━━━━━
export function hasCredentials(): boolean {
  return !!(API_KEY && SECRET_KEY && PASSPHRASE);
}

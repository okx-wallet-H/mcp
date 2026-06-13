"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useWsTicker, useWsCandles, useWsOrderbook } from "@/lib/ws-hooks";
import type { TickerData } from "@/lib/ws-types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const SYMBOLS = ["BTC-USDT","ETH-USDT","SOL-USDT","BNB-USDT","XRP-USDT","DOGE-USDT","AVAX-USDT","LINK-USDT"];

function generateCandles(base: number, count: number) {
  const candles = [];
  let price = base * 0.92;
  for (let i = 0; i < count; i++) {
    const open = price, v = base * 0.008, close = open + (Math.random() - 0.48) * v * 2;
    candles.push({ time: i, open, high: Math.max(open, close) + Math.random() * v, low: Math.min(open, close) - Math.random() * v, close, volume: Math.random() * 100 + 20 });
    price = close;
  }
  return candles;
}

function generateOrderBook(mid: number) {
  const asks = [], bids = [];
  for (let i = 0; i < 10; i++) {
    asks.push({ price: mid + (i + 1) * mid * 0.00015, size: +(Math.random() * 5).toFixed(3), total: 0 });
    bids.push({ price: mid - (i + 1) * mid * 0.00015, size: +(Math.random() * 5).toFixed(3), total: 0 });
  }
  let at = 0, bt = 0;
  asks.forEach(a => { at += a.size; a.total = +at.toFixed(3); });
  bids.forEach(b => { bt += b.size; b.total = +bt.toFixed(3); });
  return { asks, bids };
}

function MiniChart({ data, width, height, color }: { data: number[]; width: number; height: number; color: string }) {
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" /></svg>;
}

// ━━━━━ Recharts Candlestick Shape ━━━━━
type CandleItem = { time: number; open: number; high: number; low: number; close: number; volume: number };
const CandlestickShape = (props: { x?: number; y?: number; width?: number; height?: number; payload?: CandleItem; index?: number }) => {
  const { x = 0, y = 0, width = 0, payload } = props;
  if (!payload) return null;
  const { high, low, open, close } = payload;
  const min = Math.min(...([] as number[])); // placeholder
  const range = 1;
  const isUp = close >= open;
  const color = isUp ? "#1cc8a6" : "#ff5a5f";
  const barW = Math.max(1, width * 0.6);
  const cx = x + width / 2;
  // Y values are handled by recharts automatically via dataKey
  return null; // Recharts handles positioning via Bar
};

function ObRow({ price, size, total, side, maxTotal }: { price: number; size: number; total: number; side: "ask" | "bid"; maxTotal: number }) {
  const pct = (total / maxTotal) * 100;
  return (
    <div className="relative flex justify-between px-3 py-0.5 text-[11px] font-mono group cursor-pointer hover:bg-white/[0.02]">
      <div className={`absolute inset-y-0.5 right-0 rounded-sm ${side === "ask" ? "bg-red-500/[0.04]" : "bg-brand-accent/[0.04]"}`} style={{ width: `${pct}%` }} />
      <span className={`relative z-10 ${side === "ask" ? "text-red-400" : "text-brand-accent"}`}>{price.toFixed(1)}</span>
      <span className="relative z-10 text-neutral-400 tabular-nums">{size}</span>
      <span className="relative z-10 text-neutral-600 tabular-nums w-16 text-right">{total}</span>
    </div>
  );
}

// ━━━━━ Recharts CandleStick Chart ━━━━━
function KlineChart({ data }: { data: CandleItem[] }) {
  if (data.length === 0) return <div className="h-[300px] flex items-center justify-center text-neutral-600 text-xs">Loading...</div>;

  // For recharts Bar, we use separate series for body and wick
  const chartData = data.map(d => ({
    time: d.time,
    bodyLow: Math.min(d.open, d.close),
    bodyHigh: Math.abs(d.close - d.open),
    wickLow: d.low,
    wickHigh: d.high,
    isUp: d.close >= d.open,
  }));

  const CustomBar = (props: { x?: number; y?: number; width?: number; height?: number; payload?: typeof chartData[0] }) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
    if (!payload) return null;
    const color = payload.isUp ? "#1cc8a6" : "#ff5a5f";
    return <rect x={x + width * 0.2} y={y} width={width * 0.6} height={Math.max(1, height)} fill={color} rx={1} />;
  };

  const CustomWick = (props: { x?: number; y?: number; width?: number; height?: number; payload?: typeof chartData[0] }) => {
    const { x = 0, y = 0, width = 0, height = 0, payload } = props;
    if (!payload) return null;
    const color = payload.isUp ? "#1cc8a6" : "#ff5a5f";
    return <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={color} strokeWidth={1} />;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <XAxis dataKey="time" hide />
        <YAxis domain={["dataMin - 50", "dataMax + 50"]} hide />
        <Tooltip
          contentStyle={{ background: "#1a1b22", border: "1px solid #2a2b33", borderRadius: 8, fontSize: 11 }}
          formatter={(value: unknown) => [Number(value).toFixed(2), ""]}
          labelFormatter={(label: unknown) => `#${label}`}
        />
        <Bar dataKey="wickLow" stackId="wick" shape={<CustomWick />} isAnimationActive={false} />
        <Bar dataKey="wickHigh" stackId="wick" shape={<></>} isAnimationActive={false} />
        <Bar dataKey="bodyLow" stackId="body" shape={<CustomBar />} isAnimationActive={false} />
        <Bar dataKey="bodyHigh" stackId="body" shape={<></>} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ━━━━━ Main Page ━━━━━
export default function CexPage() {
  const [selected, setSelected] = useState("BTC-USDT");
  const [period, setPeriod] = useState("1H");
  const { ticker: wsTicker } = useWsTicker(selected);
  const { candles: wsCandles } = useWsCandles(selected, period);
  const { orderbook: wsOb } = useWsOrderbook(selected);

  const [mockCandles, setMockCandles] = useState(() => generateCandles(65234, 60));
  const [mockOb, setMockOb] = useState(() => generateOrderBook(65234));
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [ordType, setOrdType] = useState<"limit" | "market">("limit");
  const [price, setPrice] = useState("65234.5");
  const [amount, setAmount] = useState("");

  const [mockTickers, setMockTickers] = useState<Record<string, TickerData>>(() => {
    const m: Record<string, TickerData> = {};
    SYMBOLS.forEach((s, i) => {
      const b = [65234.5,3421.8,142.5,612.3,0.5234,0.1245,35.67,14.23][i];
      m[s] = { instId:s, last:b, bid:b*0.9999, ask:b*1.0001, high24h:b*1.02, low24h:b*0.98, vol24h:"1B", change24h:(Math.random()*6)-3, ts:Date.now() };
    });
    return m;
  });

  const ticker = wsTicker || mockTickers[selected];
  const displayCandles: CandleItem[] = wsCandles.length > 0
    ? wsCandles.map((c,i) => ({ time:i, open:c.open, high:c.high, low:c.low, close:c.close, volume:c.volume }))
    : mockCandles;

  const orderBook = wsOb
    ? (() => { const asks=wsOb.asks.map(([p,s])=>({price:p,size:s,total:0})), bids=wsOb.bids.map(([p,s])=>({price:p,size:s,total:0})); let at=0,bt=0; asks.forEach(a=>{at+=a.size;a.total=+at.toFixed(3)}); bids.forEach(b=>{bt+=b.size;b.total=+bt.toFixed(3)}); return {asks,bids}; })()
    : mockOb;

  const spread = orderBook.asks[0]?.price - orderBook.bids[0]?.price || 0;
  const mid = orderBook.asks[0] && orderBook.bids[0] ? (orderBook.asks[0].price + orderBook.bids[0].price) / 2 : ticker.last;
  const maxTotal = Math.max(...orderBook.asks.map(a=>a.total), ...orderBook.bids.map(b=>b.total), 1);

  useEffect(() => {
    if (wsTicker) return;
    const iv = setInterval(() => {
      setMockTickers(prev => { const n={...prev}; SYMBOLS.forEach(s=>{ if(n[s]){ const v=n[s].last*0.003; n[s]={...n[s], last:+(n[s].last+(Math.random()-0.48)*v).toFixed(2), ts:Date.now()}; } }); return n; });
    }, 2000);
    return () => clearInterval(iv);
  }, [wsTicker]);

  // Dynamic orderbook refresh
  useEffect(() => { if (wsOb) return; const iv = setInterval(() => setMockOb(generateOrderBook(ticker.last)), 2000); return () => clearInterval(iv); }, [wsOb, ticker.last]);
  // Regenerate candles on period change
  useEffect(() => { if (wsCandles.length > 0) return; setMockCandles(generateCandles(ticker.last, period === "1D" ? 365 : period === "1m" ? 120 : 60)); }, [period, wsCandles.length, ticker.last]);

  const selectCoin = useCallback((sym: string) => { setSelected(sym); const t = mockTickers[sym]; if (t) setPrice(t.last.toFixed(t.last<1?4:1)); }, [mockTickers]);

  const isUp = ticker.change24h >= 0;
  const fmt = (v: number) => v < 1 ? v.toFixed(4) : v.toFixed(1);

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white transition-colors">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">📈 CEX 交易中心</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" /> MCP 已连接 · 180+ 工具
        </span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {SYMBOLS.map(s => { const t = mockTickers[s]; if (!t) return null; return (
          <button key={s} onClick={()=>selectCoin(s)} className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all ${selected===s?"bg-brand-accent/[0.08] border border-brand-accent/20 text-white":"border border-transparent hover:bg-white/[0.03] text-neutral-400"}`}>
            <span className="font-semibold w-10 text-left">{s.replace("-USDT","")}</span>
            <span className="tabular-nums">{fmt(t.last)}</span>
            <span className={`text-[10px] ${t.change24h>=0?"text-brand-accent":"text-red-400"}`}>{t.change24h>=0?"+":""}{t.change24h}%</span>
            <MiniChart data={Array.from({length:20},()=>t.last*(0.98+Math.random()*0.04))} width={48} height={18} color={t.change24h>=0?"#1cc8a6":"#ff5a5f"} />
          </button>
        );})}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-line">
            <div>
              <h2 className="text-sm font-bold text-white">{selected}</h2>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-white tabular-nums">{fmt(ticker.last)}</span>
                <span className={`text-xs font-semibold ${isUp?"text-brand-accent":"text-red-400"}`}>{isUp?"+":""}{ticker.change24h}%</span>
              </div>
            </div>
            <div className="flex gap-1">
              {["1m","5m","15m","1H","4H","1D"].map(b=>(<button key={b} onClick={()=>setPeriod(b)} className={`text-[10px] px-2 py-1 rounded-md transition-all ${period===b?"bg-brand-accent/20 text-brand-accent":"bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]"}`}>{b}</button>))}
            </div>
          </div>
          <div className="p-4">
            <KlineChart data={displayCandles} />
          </div>
          <div className="grid grid-cols-4 gap-4 px-4 pb-4">
            {[
              {label:"24h High",value:ticker.high24h.toFixed(ticker.high24h<1?4:1)},
              {label:"24h Low",value:ticker.low24h.toFixed(ticker.low24h<1?4:1)},
              {label:"24h Vol",value:ticker.vol24h},
              {label:"Spread",value:`${spread.toFixed(ticker.last<1?4:1)} (${((spread/mid)*100).toFixed(3)}%)`},
            ].map(s=><div key={s.label} className="text-center"><p className="text-[9px] text-neutral-600 uppercase">{s.label}</p><p className="text-[11px] text-neutral-300 font-mono tabular-nums mt-0.5">{s.value}</p></div>)}
          </div>
        </div>

        <div className="col-span-4 space-y-4">
          <div className="card overflow-hidden">
            <div className="flex justify-between px-4 py-2.5 border-b border-ink-line"><h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Order Book</h3><span className="text-[10px] text-neutral-500">{selected}</span></div>
            <div className="flex justify-between px-3 py-1.5 text-[9px] text-neutral-600 border-b border-ink-line/50"><span>Price (USDT)</span><span>Size</span><span>Total</span></div>
            <div className="max-h-[260px] overflow-y-auto">
              {orderBook.asks.reverse().map((a,i)=><ObRow key={`a${i}`} {...a} side="ask" maxTotal={maxTotal} />)}
              <div className="flex justify-between px-3 py-2 border-y border-brand-accent/20 bg-brand-accent/[0.03]"><span className="text-sm font-bold text-white tabular-nums">{mid.toFixed(ticker.last<1?4:1)}</span><span className="text-[9px] text-neutral-500">Spread: {spread.toFixed(ticker.last<1?4:1)}</span></div>
              {orderBook.bids.map((b,i)=><ObRow key={`b${i}`} {...b} side="bid" maxTotal={maxTotal} />)}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-3">Quick Trade</h3>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={()=>setSide("buy")} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${side==="buy"?"bg-brand-accent text-black":"bg-ink-soft text-neutral-400 border border-ink-line"}`}>Buy / Long</button>
              <button onClick={()=>setSide("sell")} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${side==="sell"?"bg-red-500 text-white":"bg-ink-soft text-neutral-400 border border-ink-line"}`}>Sell / Short</button>
            </div>
            <div className="flex gap-2 mb-3">
              {(["limit","market"] as const).map(t=><button key={t} onClick={()=>setOrdType(t)} className={`text-[10px] px-2.5 py-1 rounded-lg ${ordType===t?"bg-white/10 text-white":"text-neutral-500"}`}>{t==="limit"?"Limit":"Market"}</button>)}
            </div>
            {ordType==="limit"&&<div className="mb-3"><label className="text-[9px] text-neutral-500 block mb-1">Price (USDT)</label><input value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-ink-soft border border-ink-line rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-accent/30" /></div>}
            <div className="mb-3"><label className="text-[9px] text-neutral-500 block mb-1">Amount ({selected.replace("-USDT","")})</label><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="w-full bg-ink-soft border border-ink-line rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-brand-accent/30" />
              <div className="flex gap-1.5 mt-2">{[25,50,75,100].map(p=><button key={p} onClick={()=>setAmount("0."+(p*10))} className="text-[9px] px-2 py-0.5 rounded-md bg-ink-soft border border-ink-line text-neutral-500 hover:text-white">{p}%</button>)}</div>
            </div>
            <div className="rounded-xl bg-ink-soft p-2.5 mb-3"><div className="flex justify-between text-[10px]"><span className="text-neutral-500">Est. Total</span><span className="text-white font-semibold tabular-nums">{amount&&price?`$${(+amount*+price).toFixed(2)}`:"$0.00"}</span></div></div>
            <button onClick={()=>{if(!amount)return;alert(`MCP: okx_place_order({instId:"${selected}",side:"${side}",ordType:"${ordType}",sz:"${amount}"${ordType==="limit"?`,px:"${price}"`:""}})`);}} className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${side==="buy"?"bg-brand-accent text-black hover:bg-brand-accent/90":"bg-red-500 text-white hover:bg-red-500/90"}`}>调用 MCP: okx_place_order</button>
            <p className="text-[8px] text-neutral-600 text-center mt-2">通过 MCP 工具执行交易 · 需 API Key</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {[["总权益","$45,832.91",""],["可用余额","$12,345.67",""],["当前持仓","3",""],["未实现盈亏","+$1,234.56","text-brand-accent"]].map(([l,v,c])=><div key={l as string} className="card p-4"><p className="text-[10px] text-neutral-500 uppercase tracking-wider">{l}</p><p className={`text-lg font-bold mt-1 tabular-nums ${c||"text-white"}`}>{v}</p></div>)}
      </div>

      <div className="grid grid-cols-6 gap-3 mt-6">
        {[["📊","持仓管理","okx_get_positions"],["📋","历史订单","okx_get_orders_history"],["💰","资金划转","okx_transfer"],["🔧","杠杆设置","okx_set_leverage"],["🤖","网格策略","okx_get_grid_orders_pending"],["👥","跟单交易","okx_get_lead_trader_stats"]].map(([i,l,t])=><div key={l} className="card p-3 text-center cursor-pointer hover:border-brand-accent/20 transition-all group"><span className="text-lg">{i}</span><p className="text-[10px] text-neutral-400 mt-1 group-hover:text-white">{l}</p><p className="text-[8px] text-neutral-700 mt-0.5 font-mono">{t}</p></div>)}
      </div>
    </div>
  );
}

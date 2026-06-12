"use client";
import { useState } from "react";

const TICKERS = [
  { symbol: "BTC", name: "Bitcoin", last: "65,234.5", change: 2.34, high: "66,100", low: "64,200", vol: "24.5B", chart: [62,63,64,65,64.5,65.5,66,65.2,64.8,65.2] },
  { symbol: "ETH", name: "Ethereum", last: "3,421.8", change: 1.87, high: "3,480", low: "3,380", vol: "12.8B", chart: [3.3,3.35,3.4,3.38,3.42,3.45,3.43,3.4,3.38,3.42] },
  { symbol: "SOL", name: "Solana", last: "142.50", change: -2.15, high: "148.2", low: "140.8", vol: "3.2B", chart: [148,146,145,144,143,142,141,142,143,142.5] },
  { symbol: "BNB", name: "BNB", last: "612.30", change: 0.45, high: "618.5", low: "608.2", vol: "1.8B", chart: [610,612,614,613,615,612,611,613,612,612.3] },
  { symbol: "XRP", name: "Ripple", last: "0.5234", change: 0.12, high: "0.5300", low: "0.5180", vol: "890M", chart: [0.52,0.522,0.524,0.523,0.525,0.524,0.523,0.522,0.523,0.5234] },
  { symbol: "DOGE", name: "Dogecoin", last: "0.1245", change: 3.21, high: "0.1280", low: "0.1200", vol: "450M", chart: [0.12,0.121,0.123,0.125,0.124,0.126,0.125,0.124,0.125,0.1245] },
];
const OB = { asks: [[65300.5,1.234],[65280,0.856],[65250.3,2.1],[65230.8,0.543],[65210,1.789],[65190.5,0.321],[65170.2,0.987],[65150,1.456]], bids: [[65100,1.567],[65080.5,0.789],[65060.2,2.345],[65040.8,0.432],[65020,1.123],[65000.5,0.678],[64980.3,1.89],[64960,0.345]] };

function MiniLine({ data, isUp }: { data: number[]; isUp: boolean }) {
  const w=64,h=24,min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(" ");
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={isUp?"#1cc8a6":"#ff5a5f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function ObRow({ price, size, side, max }: { price: number; size: number; side: "ask"|"bid"; max: number }) {
  return <div className="relative flex justify-between px-3 py-1 text-[11px] font-mono"><div className={`absolute inset-y-0.5 right-0 rounded-sm ${side==="ask"?"bg-red-500/[0.06]":"bg-brand-accent/[0.06]"}`} style={{width:`${(size/max)*100}%`}}/><span className={`relative z-10 ${side==="ask"?"text-red-400":"text-brand-accent"}`}>{price.toLocaleString()}</span><span className="relative z-10 text-neutral-400 tabular-nums">{size.toFixed(3)}</span></div>;
}

export default function TradePage() {
  const [sd, setSd] = useState<"buy"|"sell">("buy"); const [ot, setOt] = useState<"limit"|"market">("limit");
  const ma = Math.max(...OB.asks.map(a=>a[1])); const mb = Math.max(...OB.bids.map(b=>b[1]));
  const spr = OB.asks[OB.asks.length-1][0] - OB.bids[0][0];
  const mid = (OB.asks[OB.asks.length-1][0] + OB.bids[0][0]) / 2;
  return (
    <div className="container-page py-8">
      <div className="mb-6"><div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-white">交易看板</h1><span className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent"><span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"/> 实时</span></div><p className="text-sm text-neutral-500 mt-1">实时行情监控与快速交易面板</p></div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {TICKERS.map(t => { const isUp = t.change >= 0; return <div key={t.symbol} className="card p-4 hover:border-white/[0.08] transition-all cursor-pointer">
          <div className="flex justify-between mb-3"><div><p className="text-[13px] font-semibold text-white">{t.symbol}</p><p className="text-[10px] text-neutral-500">{t.name}</p></div><MiniLine data={t.chart} isUp={isUp}/></div>
          <div className="flex items-baseline gap-2"><p className="text-lg font-bold text-white">${t.last}</p><span className={`text-[11px] font-semibold ${isUp?"text-brand-accent":"text-red-400"}`}>{isUp?"+":""}{t.change}%</span></div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-ink-line"><div><p className="text-[9px] text-neutral-600">24h High</p><p className="text-[11px] text-neutral-300">{t.high}</p></div><div><p className="text-[9px] text-neutral-600">24h Low</p><p className="text-[11px] text-neutral-300">{t.low}</p></div></div>
        </div>; })}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="card overflow-hidden">
          <div className="flex justify-between px-4 py-3 border-b border-ink-line"><h3 className="text-xs font-semibold text-white">Order Book</h3><span className="text-[10px] text-neutral-500">BTC-USDT</span></div>
          <div className="px-4 py-2 border-b border-ink-line bg-ink-soft/30"><div className="flex justify-between"><span className="text-[10px] text-neutral-500">Spread</span><span className="text-[11px] font-mono text-white">{spr.toFixed(1)} <span className="text-[9px] text-neutral-500">({(spr/mid*100).toFixed(3)}%)</span></span></div></div>
          {OB.asks.map(([p,s],i)=><ObRow key={`a${i}`} price={p} size={s} side="ask" max={ma}/>)}
          <div className="flex justify-center py-2.5 border-y border-ink-line bg-ink-soft/20"><span className="text-lg font-bold text-white">${mid.toFixed(1)}</span></div>
          {OB.bids.map(([p,s],i)=><ObRow key={`b${i}`} price={p} size={s} side="bid" max={mb}/>)}
        </div>
        <div className="col-span-2 card p-5">
          <div className="flex justify-between mb-4"><h3 className="text-xs font-semibold text-white">Quick Trade · BTC-USDT</h3><span className="text-[10px] text-neutral-500">Balance: 12,345.67 USDT</span></div>
          <div className="grid grid-cols-2 gap-2 mb-4"><button onClick={()=>setSd("buy")} className={`py-3 rounded-xl text-sm font-semibold ${sd==="buy"?"bg-brand-accent text-black":"bg-ink-soft text-neutral-400 border border-ink-line"}`}>Buy / Long</button><button onClick={()=>setSd("sell")} className={`py-3 rounded-xl text-sm font-semibold ${sd==="sell"?"bg-red-500 text-white":"bg-ink-soft text-neutral-400 border border-ink-line"}`}>Sell / Short</button></div>
          <div className="flex gap-2 mb-4">{(["limit","market"] as const).map(t=><button key={t} onClick={()=>setOt(t)} className={`text-[12px] px-3 py-1.5 rounded-lg ${ot===t?"bg-white/10 text-white":"text-neutral-500"}`}>{t==="limit"?"Limit":"Market"}</button>)}</div>
          {ot==="limit"&&<div className="mb-3"><label className="text-[10px] text-neutral-500 block mb-1.5">Price (USDT)</label><input defaultValue={mid.toFixed(1)} className="w-full bg-ink-soft border border-ink-line rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-brand-accent/30"/></div>}
          <div className="mb-3"><label className="text-[10px] text-neutral-500 block mb-1.5">Amount (BTC)</label><input placeholder="0.00" className="w-full bg-ink-soft border border-ink-line rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-brand-accent/30"/><div className="flex gap-2 mt-2">{[25,50,75,100].map(p=><button key={p} className="text-[10px] px-2.5 py-1 rounded-lg bg-ink-soft border border-ink-line text-neutral-400 hover:text-white">{p}%</button>)}</div></div>
          <div className="rounded-xl bg-ink-soft p-3 mb-4"><div className="flex justify-between text-[11px]"><span className="text-neutral-500">Est. Total</span><span className="text-white font-semibold">0.00 USDT</span></div></div>
          <button className={`w-full py-3.5 rounded-xl text-sm font-bold ${sd==="buy"?"bg-brand-accent text-black":"bg-red-500 text-white"}`}>{sd==="buy"?"Buy BTC":"Sell BTC"}</button>
        </div>
      </div>
    </div>
  );
}

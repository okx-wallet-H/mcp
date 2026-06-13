"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SignalsPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { fetch("/api/signals").then(r => r.json()).then(setData).catch(() => {}); }, []);

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">📡 信号策略</span>
        <span className="ml-auto text-[10px] text-neutral-400">{data?.buySignals} buys / {data?.sellSignals} sells</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">信号策略中心</h1>
      <p className="text-sm text-neutral-500 mb-6">Smart Money · Whale · KOL · {data?.totalSignals || 0} signals</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "买入信号", value: data?.buySignals || 0, color: "text-emerald-400" },
          { label: "卖出信号", value: data?.sellSignals || 0, color: "text-red-400" },
          { label: "总信号", value: data?.totalSignals || 0, color: "text-amber-400" },
        ].map(s => (
          <div key={s.label} className="card p-4"><p className="text-[10px] text-neutral-500 uppercase">{s.label}</p><p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p></div>
        ))}
      </div>

      <div className="card mb-6">
        <div className="grid grid-cols-6 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span>Token</span><span>Action</span><span>Strength</span><span>Price</span><span>Source</span><span>Time</span>
        </div>
        {(data?.signals || []).map((s: any) => (
          <div key={s.token + s.time} className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <span className="text-xs text-white font-semibold">{s.token}</span>
            <span className={`text-[10px] font-bold ${s.action==="BUY"?"text-emerald-400":"text-red-400"}`}>{s.action}</span>
            <div className="flex items-center gap-2"><div className="h-1 w-16 rounded-full bg-ink-soft overflow-hidden"><div className={`h-full rounded-full ${s.action==="BUY"?"bg-emerald-400":"bg-red-400"}`} style={{width:`${s.strength}%`}} /></div><span className="text-[10px] text-neutral-400">{s.strength}</span></div>
            <span className="text-[10px] text-neutral-400">${s.price}</span>
            <span className="text-[10px] text-neutral-500">{s.source}</span>
            <span className="text-[9px] text-neutral-600">{new Date(s.time).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">顶級交易員</h3>
      <div className="grid grid-cols-3 gap-3">
        {(data?.topTraders || []).map((t: any) => (
          <div key={t.name} className="card p-4"><p className="text-xs text-white font-semibold">{t.name}</p><div className="flex justify-between mt-2"><span className="text-[10px] text-emerald-400 font-bold">{t.roi}</span><span className="text-[10px] text-neutral-500">{t.winRate} WR</span><span className="text-[9px] text-neutral-600">{t.followers.toLocaleString()} fans</span></div></div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Protocol { name: string; category: string; chains: string[]; volume24h?: string; tvl?: string }

export default function OnchainPage() {
  const [data, setData] = useState<{ protocols: Protocol[]; chains: string[]; dexVolume24h: string; defiTVL: string } | null>(null);
  useEffect(() => { fetch("/api/onchain").then(r => r.json()).then(setData).catch(() => {}); }, []);

  const protocols = data?.protocols || [];
  const chains = data?.chains || [];

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">⛓️ Onchain OS</span>
        <span className="ml-auto text-[10px] text-neutral-500">{protocols.length} protocols</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Onchain OS</h1>
      <p className="text-sm text-neutral-500 mb-6">DEX·DeFi·Bridge·Wallet · {chains.join(" · ")}</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "DEX Volume 24h", value: data?.dexVolume24h || "—", color: "text-blue-400" },
          { label: "DeFi TVL", value: data?.defiTVL || "—", color: "text-emerald-400" },
          { label: "Chains", value: chains.length, color: "text-amber-400" },
          { label: "Protocols", value: protocols.length, color: "text-purple-400" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-[10px] text-neutral-500 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-3">Protocol</span><span className="col-span-2">Category</span>
          <span className="col-span-4">Chains</span><span className="col-span-3">Volume / TVL</span>
        </div>
        {protocols.map(p => (
          <div key={p.name} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <span className="col-span-3 text-xs text-white font-semibold">{p.name}</span>
            <span className="col-span-2 text-[10px] text-neutral-400">{p.category}</span>
            <span className="col-span-4 flex gap-1">{p.chains.map(c => <span key={c} className="text-[9px] px-1.5 py-0.5 rounded bg-ink-soft border border-ink-line text-neutral-500">{c}</span>)}</span>
            <span className="col-span-3 text-[11px] text-white font-mono">{p.volume24h || p.tvl || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

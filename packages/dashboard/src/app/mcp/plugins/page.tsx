"use client";
import { useState } from "react";
import Link from "next/link";

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([
    { id: "cex:OKX CEX", name: "OKX CEX", module: "cex", status: "running", tools: 180, desc: "CEX Trading" },
    { id: "onchain:OKX Onchain", name: "Onchain OS", module: "onchain", status: "stopped", tools: 100, desc: "DEX DeFi Bridge" },
    { id: "outcomes:OKX Outcomes", name: "Outcomes", module: "outcomes", status: "stopped", tools: 10, desc: "Prediction Markets" },
  ]);

  const toggle = (id: string) => {
    setPlugins(prev => prev.map(p =>
      p.id === id ? { ...p, status: p.status === "running" ? "stopped" : "running" as const } : p
    ));
  };

  const running = plugins.filter(p => p.status === "running").length;

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">Plugin Manager</span>
        <span className="ml-auto text-[10px] text-neutral-500">{running} active</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-6">Plugin Manager</h1>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-4">Plugin</span>
          <span className="col-span-2">Module</span>
          <span className="col-span-1">Tools</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-3">Actions</span>
        </div>
        {plugins.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <div className="col-span-4">
              <p className="text-xs font-semibold text-white">{p.name}</p>
              <p className="text-[9px] text-neutral-600">{p.desc}</p>
            </div>
            <span className="col-span-2 text-[10px] text-neutral-400">{p.module.toUpperCase()}</span>
            <span className="col-span-1 text-[11px] text-white font-mono">{p.tools}</span>
            <span className="col-span-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.status === "running" ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-700/30 text-neutral-500"}`}>
                {p.status}
              </span>
            </span>
            <div className="col-span-3 flex gap-2">
              <button onClick={() => toggle(p.id)} className={`text-[10px] px-2 py-0.5 rounded ${p.status === "running" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                {p.status === "running" ? "Stop" : "Start"}
              </button>
              <button className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">Reload</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

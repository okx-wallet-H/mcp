"use client";
import { useState } from "react";
import Link from "next/link";

export default function AgentPage() {
  const [tasks, setTasks] = useState([
    { id: "monitor-btc", type: "monitor", module: "cex", desc: "BTC Price Monitor", schedule: "5min", enabled: true, lastRun: "2m ago" },
    { id: "health-check", type: "maintain", module: "collab", desc: "Plugin Health Check", schedule: "10min", enabled: true, lastRun: "8m ago" },
    { id: "xlayer-blocks", type: "monitor", module: "onchain", desc: "XLayer New Blocks", schedule: "realtime", enabled: true, lastRun: "12s ago" },
  ]);

  const toggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const running = tasks.filter(t => t.enabled).length;

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">AI Agent</span>
        <span className="ml-auto text-[10px] text-neutral-500">{running}/{tasks.length} tasks</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-6">AI Agent</h1>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-4">Task</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1">Module</span>
          <span className="col-span-1">Schedule</span>
          <span className="col-span-2">Last Run</span>
          <span className="col-span-2">Actions</span>
        </div>
        {tasks.map(t => (
          <div key={t.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <div className="col-span-4">
              <p className="text-xs text-white">{t.desc}</p>
              <p className="text-[9px] text-neutral-600 font-mono">{t.id}</p>
            </div>
            <span className="col-span-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.type === "monitor" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"}`}>
                {t.type}
              </span>
            </span>
            <span className="col-span-1 text-[10px] text-neutral-400">{t.module}</span>
            <span className="col-span-1 text-[10px] text-neutral-500">{t.schedule}</span>
            <span className="col-span-2 text-[10px] text-neutral-500">{t.lastRun}</span>
            <div className="col-span-2 flex gap-2">
              <button onClick={() => toggle(t.id)} className={`text-[10px] px-2 py-0.5 rounded ${t.enabled ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                {t.enabled ? "Stop" : "Start"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

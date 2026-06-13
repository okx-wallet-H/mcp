"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AgentTask, AgentResponse } from "@/lib/api-types";

export default function AgentPage() {
  const [data, setData] = useState<AgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { fetch("/api/agent").then(r => r.json()).then(setData).catch(e => setError(e.message)); }, []);

  const tasks = data?.tasks || [];
  const active = data?.activeTasks || 0;
  const total = tasks.length;

  if (!data && !error) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-400 border-t-transparent" /></div>;

  return (
    <div className="container-page py-6">
      {error && <div className="mb-4 text-[11px] bg-red-500/10 text-red-400 px-3 py-2 rounded-xl">⚠ {error}</div>}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">🤖 AI Agent</span>
        <span className="ml-auto flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${data?.runtimeStatus === "running" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {data?.runtimeStatus === "running" ? "Runtime ON" : "Runtime OFF"}
          </span>
        </span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">AI Agent</h1>
      <p className="text-sm text-neutral-500 mb-6">{active}/{total} tasks active · MCP Agent Runtime</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "活跃任务", value: active, sub: `/ ${total}`, color: "#1cc8a6" },
          { label: "监控", value: tasks.filter(t=>t.type==="monitor"&&t.enabled).length, color: "#4b6fff" },
          { label: "维护", value: tasks.filter(t=>t.type==="maintain"&&t.enabled).length, color: "#f0b90b" },
          { label: "Runtime", value: data?.runtimeStatus || "—", color: data?.runtimeStatus==="running"?"#1cc8a6":"#ff5a5f" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-[10px] text-neutral-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
            {s.sub && <p className="text-[9px] text-neutral-600">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-4">Task</span><span className="col-span-2">Type</span><span className="col-span-1">Module</span>
          <span className="col-span-1">Schedule</span><span className="col-span-2">Last Run</span><span className="col-span-2">Status</span>
        </div>
        {tasks.map(t => (
          <div key={t.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <div className="col-span-4"><p className="text-xs text-white">{t.desc}</p><p className="text-[9px] text-neutral-600 font-mono">{t.id}</p></div>
            <span className="col-span-2"><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.type==="monitor"?"bg-blue-500/10 text-blue-400":"bg-purple-500/10 text-purple-400"}`}>{t.type}</span></span>
            <span className="col-span-1 text-[10px] text-neutral-400">{t.module}</span>
            <span className="col-span-1 text-[10px] text-neutral-500">{t.schedule}</span>
            <span className="col-span-2 text-[10px] text-neutral-500">{t.lastRun ? new Date(t.lastRun).toLocaleTimeString() : "—"}</span>
            <span className="col-span-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${t.enabled?"bg-emerald-500/10 text-emerald-400":"bg-neutral-700/30 text-neutral-500"}`}>
                {t.enabled ? "Active" : "Paused"}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

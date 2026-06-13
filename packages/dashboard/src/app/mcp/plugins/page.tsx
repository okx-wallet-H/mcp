"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plugin, PluginsResponse } from "@/lib/api-types";

export default function PluginsPage() {
  const [data, setData] = useState<PluginsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/plugins").then(r => r.json()).then(setData).catch(e => setError(e.message));
  }, []);

  const plugins = data?.plugins || [];
  const running = plugins.filter(p => p.status === "running").length;
  const totalTools = data?.totalTools || 0;

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">🔌 Plugin Manager</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" /> {data?.protocol || "MCP"}
        </span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Plugin Manager</h1>
      <p className="text-sm text-neutral-500 mb-6">MCP Protocol · {running} active · {totalTools} tools available</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "插件数", value: plugins.length, color: "#1cc8a6" },
          { label: "运行中", value: running, color: "#4b6fff" },
          { label: "可用工具", value: totalTools, color: "#f0b90b" },
          { label: "协议", value: data?.protocol || "MCP", color: "#1cc8a6" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-[10px] text-neutral-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-3">Plugin</span>
          <span className="col-span-1">Version</span>
          <span className="col-span-1">Module</span>
          <span className="col-span-1">Tools</span>
          <span className="col-span-2">Transport</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Endpoint</span>
        </div>
        {plugins.map(p => (
          <div key={p.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <div className="col-span-3">
              <p className="text-xs font-semibold text-white">{p.name}</p>
              <p className="text-[9px] text-neutral-600">{p.description}</p>
            </div>
            <span className="col-span-1 text-[10px] text-neutral-400 font-mono">{p.version}</span>
            <span className="col-span-1 text-[10px] text-neutral-400">{p.module.toUpperCase()}</span>
            <span className="col-span-1 text-[11px] text-white font-mono">{p.toolCount}</span>
            <span className="col-span-2 text-[10px] text-neutral-500">{p.transport}</span>
            <span className="col-span-2">
              <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                p.status === "running" ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-700/30 text-neutral-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.status === "running" ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
                {p.status === "running" ? "Running" : "Stopped"}
              </span>
            </span>
            <span className="col-span-2 text-[9px] text-neutral-600 font-mono truncate">{p.endpoint}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function KbPage() {
  const [data, setData] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => { fetch("/api/kb").then(r => r.json()).then(setData).catch(() => {}); }, []);

  const tools = (data?.tools || []).filter((t: any) => filter === "all" || t.category === filter);
  const categories = data?.categories || [];

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">📚 知识库</span>
        <span className="ml-auto text-[10px] text-neutral-400">质量 {data?.qualityScore}%</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">MCP 工具知识库</h1>
      <p className="text-sm text-neutral-500 mb-4">{data?.totalTools || 0} tools · {data?.modules?.join(" · ")}</p>

      <div className="flex gap-1.5 mb-4">
        <button onClick={()=>setFilter("all")} className={`text-[10px] px-2.5 py-1.5 rounded-lg ${filter==="all"?"bg-white/10 text-white":"text-neutral-500"}`}>All</button>
        {categories.map((c: string) => <button key={c} onClick={()=>setFilter(c)} className={`text-[10px] px-2.5 py-1.5 rounded-lg ${filter===c?"bg-white/10 text-white":"text-neutral-500"}`}>{c}</button>)}
      </div>

      <div className="card">
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-4">Tool</span><span className="col-span-3">Category</span><span className="col-span-3">Module</span><span className="col-span-2">Description</span>
        </div>
        {tools.map((t: any) => (
          <div key={t.name} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02] items-center">
            <span className="col-span-4 text-xs text-white font-mono">{t.name}</span>
            <span className="col-span-3 text-[10px] text-neutral-400">{t.category}</span>
            <span className="col-span-3"><span className="text-[9px] px-1.5 py-0.5 rounded bg-ink-soft border border-ink-line text-neutral-500">{t.module}</span></span>
            <span className="col-span-2 text-[10px] text-neutral-500">{t.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MemoryEntry, MemoryResponse } from "@/lib/api-types";

export default function MemoryPage() {
  const [data, setData] = useState<MemoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetch("/api/memory").then(r => r.json()).then(setData).catch(e => setError(e.message)); }, []);

  const entries = data?.entries || [];
  const filtered = entries.filter(e => {
    if (filter !== "all" && e.type !== filter) return false;
    if (search && !e.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">🧠 Memory Engine</span>
        <span className="ml-auto text-[10px] text-neutral-500">{data?.totalEntries || entries.length} entries</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Memory Engine</h1>
      <p className="text-sm text-neutral-500 mb-6">Conversations: {data?.conversations || 0} · Preferences: {data?.preferences || 0} · MCP Protocol</p>

      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memories..." className="flex-1 bg-ink-card border border-ink-line rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent/30" />
        {["all","conversation","preference","context"].map(k => (
          <button key={k} onClick={() => setFilter(k)} className={`text-[10px] px-3 py-2 rounded-xl ${filter===k?"bg-white/10 text-white":"text-neutral-500 hover:text-white"}`}>{k}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {filtered.map(e => (
          <div key={e.id} className="flex items-start gap-3 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02]">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${e.type==="conversation"?"bg-blue-500/10 text-blue-400":e.type==="preference"?"bg-amber-500/10 text-amber-400":"bg-purple-500/10 text-purple-400"}`}>{e.type}</span>
            <div className="flex-1 min-w-0"><p className="text-xs text-white truncate">{e.content}</p></div>
            <span className="text-[9px] text-neutral-600 flex-shrink-0">{new Date(e.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";

interface MemoryEntry {
  id: string; type: string; content: string; timestamp: number; metadata?: Record<string, unknown>;
}

const MOCK_MEMORIES: MemoryEntry[] = [
  { id: "1", type: "conversation", content: "User: BTC price alert set at $65,000", timestamp: Date.now() - 60000, metadata: { role: "user" } },
  { id: "2", type: "conversation", content: "Agent: Monitoring BTC. Current price $63,773", timestamp: Date.now() - 120000, metadata: { role: "agent" } },
  { id: "3", type: "preference", content: "theme:dark", timestamp: Date.now() - 300000, metadata: { key: "theme", value: "dark" } },
  { id: "4", type: "context", content: "Last trade: BTC-USDT swap executed", timestamp: Date.now() - 600000, metadata: { data: {} } },
  { id: "5", type: "conversation", content: "Agent: XLayer block #12345 detected", timestamp: Date.now() - 900000, metadata: { role: "agent" } },
  { id: "6", type: "preference", content: "defaultPair:BTC-USDT", timestamp: Date.now() - 3600000, metadata: { key: "defaultPair", value: "BTC-USDT" } },
];

export default function MemoryPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_MEMORIES.filter(m => {
    if (filter !== "all" && m.type !== filter) return false;
    if (search && !m.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeCounts = {
    all: MOCK_MEMORIES.length,
    conversation: MOCK_MEMORIES.filter(m => m.type === "conversation").length,
    preference: MOCK_MEMORIES.filter(m => m.type === "preference").length,
    context: MOCK_MEMORIES.filter(m => m.type === "context").length,
  };

  return (
    <div className="container-page py-6">
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">🧠 Memory Engine</span>
        <span className="ml-auto text-[10px] text-neutral-500">{MOCK_MEMORIES.length} entries</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Memory Engine</h1>
      <p className="text-sm text-neutral-500 mb-6">Conversation history · Preferences · Context</p>

      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search memories..."
          className="flex-1 bg-ink-card border border-ink-line rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent/30"
        />
        <div className="flex gap-1">
          {Object.entries(typeCounts).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`text-[10px] px-3 py-2 rounded-xl transition-all ${filter === k ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white"}`}
            >
              {k} ({v})
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        {filtered.map(m => (
          <div key={m.id} className="flex items-start gap-3 px-4 py-3 border-b border-ink-line/30 hover:bg-white/[0.02]">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${
              m.type === "conversation" ? "bg-blue-500/10 text-blue-400" :
              m.type === "preference" ? "bg-amber-500/10 text-amber-400" :
              "bg-purple-500/10 text-purple-400"
            }`}>{m.type}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{m.content}</p>
              {m.metadata && <p className="text-[9px] text-neutral-600 mt-0.5">{JSON.stringify(m.metadata)}</p>}
            </div>
            <span className="text-[9px] text-neutral-600 flex-shrink-0">
              {new Date(m.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-neutral-600 text-xs">No memories found</div>
        )}
      </div>
    </div>
  );
}

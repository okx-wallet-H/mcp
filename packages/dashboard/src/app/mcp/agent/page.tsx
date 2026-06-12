"use client";
import { useState } from "react";
import Link from "next/link";

export default function AgentPage() {
  const [tasks] = useState([{ id:"monitor-btc", desc:"BTC price monitor", type:"monitor", enabled:true },{ id:"health-check", desc:"Plugin health check", type:"maintain", enabled:true }]);
  return (<div className="container-page py-6"><h1 className="text-2xl font-bold text-white mb-6">AI Agent</h1><div className="card overflow-hidden">{tasks.map(t=><div key={t.id} className="flex justify-between px-4 py-3 border-b border-ink-line/30"><div><p className="text-xs text-white">{t.desc}</p><p className="text-[9px] text-neutral-600 font-mono">{t.id}</p></div><span className={	ext-[10px] px-2 py-0.5 rounded-full }>{t.enabled?"enabled":"disabled"}</span></div>)}</div></div>);}

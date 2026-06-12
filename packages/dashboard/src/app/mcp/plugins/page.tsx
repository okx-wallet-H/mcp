"use client";
import { useState } from "react";
import Link from "next/link";

export default function PluginsPage() {
  const [plugins] = useState([{ id:"cex", name:"OKX CEX", status:"running", tools:180 },{ id:"onchain", name:"Onchain OS", status:"stopped", tools:100 },{ id:"outcomes", name:"Outcomes", status:"stopped", tools:10 }]);
  return (<div className="container-page py-6"><h1 className="text-2xl font-bold text-white mb-6">Plugin Manager</h1><div className="card overflow-hidden">{plugins.map(p=><div key={p.id} className="flex justify-between px-4 py-3 border-b border-ink-line/30"><div><span className="text-sm text-white">{p.name}</span><span className="text-[10px] text-neutral-500 ml-2">{p.tools} tools</span></div><span className={	ext-[10px] px-2 py-0.5 rounded-full }>{p.status}</span></div>)}</div></div>);}

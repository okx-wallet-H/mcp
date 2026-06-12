"use client";
import { useState, useRef, useEffect } from "react";

interface Message { id: string; from: string; role: string; content: string; ts: number; type: string; toolName?: string; toolResult?: string; }
const ROOMS = [
  { id: "trading", name: "交易策略室", icon: "🏦", desc: "AI+人类协作制定交易策略", n: 3, u: 2 },
  { id: "audit", name: "API 审计室", icon: "🔍", desc: "审查 MCP 工具质量", n: 2, u: 0 },
  { id: "monitor", name: "行情监控室", icon: "📡", desc: "AI 自动监控异动", n: 5, u: 0 },
  { id: "general", name: "公共大厅", icon: "🌐", desc: "开放讨论区", n: 8, u: 1 },
];
const PARTS: Record<string, { name: string; role: string; status: string; avatar: string }[]> = {
  trading: [{ name: "CF", role: "human", status: "online", avatar: "👤" }, { name: "Claude", role: "ai", status: "online", avatar: "🤖" }, { name: "OKX Agent", role: "ai", status: "idle", avatar: "⚡" }],
  audit: [{ name: "CF", role: "human", status: "online", avatar: "👤" }, { name: "Claude", role: "ai", status: "online", avatar: "🤖" }],
  monitor: [{ name: "Monitor Bot", role: "ai", status: "online", avatar: "📡" }, { name: "Risk Engine", role: "ai", status: "online", avatar: "🛡️" }, { name: "News Bot", role: "ai", status: "online", avatar: "📰" }],
  general: [{ name: "CF", role: "human", status: "online", avatar: "👤" }, { name: "Claude", role: "ai", status: "online", avatar: "🤖" }, { name: "Signal Bot", role: "ai", status: "online", avatar: "📊" }],
};
const INIT_MSGS: Record<string, Message[]> = {
  trading: [
    { id: "1", from: "Claude", role: "ai", content: "BTC 永续资金费率转正 (+0.008%)，市场偏多。关注 65k-68k 区间。", ts: Date.now()-3600000, type: "text" },
    { id: "2", from: "CF", role: "human", content: "帮我看 BTC Ticker 和 1H K线", ts: Date.now()-3300000, type: "text" },
    { id: "3", from: "Claude", role: "ai", content: "", ts: Date.now()-3200000, type: "tool_result", toolName: "okx_get_ticker", toolResult: JSON.stringify({ instId: "BTC-USDT", last: "65234.5", high24h: "66100", change24h: "+2.3%" }, null, 2) },
    { id: "4", from: "OKX Agent", role: "ai", content: "收到网格请求：BTC 现货 65k-68k 19格。确认后执行。", ts: Date.now()-2800000, type: "system" },
  ],
  audit: [{ id: "1", from: "Claude", role: "ai", content: "当前审计：质量均分 3.4/6。短板：关键词(0%)、数据量(0%)、关联链(2%)。", ts: Date.now()-7200000, type: "text" }],
  monitor: [{ id: "1", from: "Monitor Bot", role: "ai", content: "🟡 ETH-USDT-SWAP 资金费率 -0.025%，接近极端区域", ts: Date.now()-600000, type: "system" }, { id: "2", from: "Risk Engine", role: "ai", content: "OI 突变：BTC-SWAP 5min +3.2%", ts: Date.now()-300000, type: "system" }],
  general: [{ id: "1", from: "Claude", role: "ai", content: "欢迎来到 AI 协作中枢！实时交流、共享数据、协作决策。", ts: Date.now()-86400000, type: "text" }],
};

export default function CollabPage() {
  const [room, setRoom] = useState("trading"); const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(INIT_MSGS); const endRef = useRef<HTMLDivElement>(null);
  const r = ROOMS.find(r=>r.id===room)!; const pts = PARTS[room]||[]; const rm = msgs[room]||[];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [rm]);

  const send = () => { if (!input.trim()) return; const m: Message = { id: Date.now().toString(), from: "CF", role: "human", content: input.trim(), ts: Date.now(), type: "text" }; setMsgs(p=>({...p,[room]:[...(p[room]||[]),m]})); setInput(""); setTimeout(() => { const ai: Message = { id: (Date.now()+1).toString(), from: "Claude", role: "ai", content: `收到：「${m.content.slice(0,60)}」\n\nWebSocket 已就绪，可通过 MCP 工具获取实时数据。`, ts: Date.now(), type: "text" }; setMsgs(p=>({...p,[room]:[...(p[room]||[]),ai]})); }, 800); };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="w-56 border-r border-ink-line bg-ink-soft/40 flex flex-col">
        <div className="p-4 border-b border-ink-line"><h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">◎ 协作房间</h2><div className="flex items-center gap-2 text-[10px] text-neutral-500 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"/>WebSocket 已连接</div></div>
        <div className="flex-1 overflow-y-auto p-2">
          {ROOMS.map(rr => <button key={rr.id} onClick={()=>setRoom(rr.id)} className={`w-full text-left p-3 rounded-xl mb-1 transition-all ${room===rr.id?"bg-brand-accent/[0.08] border border-brand-accent/20":"hover:bg-white/[0.03] border border-transparent"}`}><div className="flex items-center gap-2.5"><span className="text-lg">{rr.icon}</span><div className="flex-1 min-w-0"><p className="text-[13px] font-semibold text-white truncate">{rr.name}</p><p className="text-[10px] text-neutral-500 truncate">{rr.desc}</p></div>{rr.u>0&&<span className="w-5 h-5 rounded-full bg-brand-accent text-[10px] font-bold text-black flex items-center justify-center">{rr.u}</span>}</div><div className="flex items-center gap-2 mt-2"><span className="text-[10px] text-neutral-600">{rr.n} 参与者</span></div></button>)}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-ink">
        <div className="flex items-center justify-between px-6 py-3 border-b border-ink-line"><div className="flex items-center gap-2.5"><span className="text-lg">{r.icon}</span><div><h1 className="text-sm font-semibold text-white">{r.name}</h1><p className="text-[10px] text-neutral-500">{r.desc}</p></div></div><div className="flex -space-x-1.5">{pts.slice(0,4).map(p=><div key={p.name} className="w-7 h-7 rounded-full border-2 border-ink flex items-center justify-center text-xs bg-ink-card relative" title={p.name}>{p.avatar}<span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-ink" style={{backgroundColor:p.status==="online"?"#1cc8a6":p.status==="idle"?"#f0b90b":"#555"}}/></div>)}</div></div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {rm.map(m => m.type==="system" ? <div key={m.id} className="flex justify-center my-3"><div className="rounded-full bg-brand-accent/[0.06] border border-brand-accent/10 px-4 py-1.5"><p className="text-[11px] text-brand-accent text-center">{m.content}</p></div></div> : m.type==="tool_result" && m.toolResult ? <div key={m.id} className="mb-4 ml-11"><div className="rounded-xl border border-brand-accent/20 bg-brand-accent/[0.04] overflow-hidden"><div className="flex items-center gap-2 px-3 py-2 bg-brand-accent/[0.06] border-b border-brand-accent/10"><span className="text-[10px] font-semibold text-brand-accent uppercase">TOOL: {m.toolName}</span></div><pre className="p-3 text-[11px] font-mono text-neutral-300 overflow-x-auto">{m.toolResult}</pre></div></div> :
          <div key={m.id} className={`flex gap-3 mb-4 ${m.role==="human"?"flex-row-reverse":""}`}><div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm ${m.role==="ai"?"bg-brand-accent/15":"bg-white/10"}`}>{m.role==="ai"?"🤖":"👤"}</div><div className="max-w-[70%]"><div className="flex items-center gap-2 mb-1"><span className="text-[11px] font-semibold text-neutral-400">{m.from}</span><span className={`text-[10px] px-1.5 py-0 rounded-full ${m.role==="ai"?"bg-brand-accent/15 text-brand-accent":"bg-white/10 text-neutral-400"}`}>{m.role==="ai"?"AI":"Human"}</span></div><div className={`rounded-2xl px-4 py-2.5 ${m.role==="human"?"bg-brand-blue/10 border border-brand-blue/20 text-white":"bg-ink-card border border-ink-line text-neutral-200"}`}><p className="text-[13px] leading-relaxed whitespace-pre-wrap">{m.content}</p></div><p className="text-[10px] text-neutral-600 mt-1">{new Date(m.ts).toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})}</p></div></div>)}
          <div ref={endRef}/>
        </div>
        <div className="px-6 py-3 border-t border-ink-line"><div className="flex items-end gap-3"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="输入消息… (Enter 发送)" rows={1} className="flex-1 bg-ink-card border border-ink-line rounded-xl px-4 py-3 text-[13px] text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent/30 resize-none" style={{minHeight:"44px",maxHeight:"120px"}}/><button onClick={send} disabled={!input.trim()} className="px-5 py-3 rounded-xl bg-brand-accent text-black text-[13px] font-semibold hover:bg-brand-accent/90 disabled:opacity-30 transition-all">发送</button></div><p className="text-[10px] text-neutral-600 mt-2">WebSocket 协议: wss://collab-hub/ws · 支持 Markdown · @mention · 工具调用</p></div>
      </div>
      <div className="w-64 border-l border-ink-line bg-ink-soft/40 p-4">
        <h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">参与者 · {pts.length}</h3>
        {pts.map(p=><div key={p.name} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/[0.03]"><span className="text-sm">{p.avatar}</span><span className="text-[12px] text-neutral-300 flex-1 truncate">{p.name}</span><span className={`w-1.5 h-1.5 rounded-full ${p.status==="online"?"bg-brand-accent":p.status==="idle"?"bg-brand-gold":"bg-neutral-700"}`}/></div>)}
        <div className="mt-6"><h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-3">共享数据</h3><div className="rounded-xl bg-ink-card border border-ink-line p-3"><p className="text-[10px] text-neutral-500 mb-2">最近工具调用</p><p className="text-[11px] font-mono text-brand-accent">okx_get_ticker</p><div className="grid grid-cols-2 gap-2 mt-2">{[["BTC","$65,234","#1cc8a6"],["ETH","$3,421","#1cc8a6"],["SOL","$142.5","#ff5a5f"],["BNB","$612.3","#1cc8a6"]].map(([n,pr,c])=><div key={n} className="rounded-lg bg-ink-soft p-2"><p className="text-[10px] text-neutral-500">{n}</p><p className="text-xs font-semibold" style={{color:c}}>{pr}</p></div>)}</div></div></div>
      </div>
    </div>
  );
}

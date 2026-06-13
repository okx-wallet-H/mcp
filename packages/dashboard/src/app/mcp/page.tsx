"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, BarChart3, Target, BookOpen, Radio, Users, Zap, Activity, Brain, ChevronRight } from "lucide-react";

interface StatsData { plugins: number; running: number; tools: number; agentTasks: number; memoryEntries: number }

const MODULES = [
  { id: "cex", icon: TrendingUp, title: "CEX 交易中心", desc: "行情·交易·账户·策略", color: "emerald", tools: "180", href: "/mcp/cex" },
  { id: "onchain", icon: BarChart3, title: "Onchain OS", desc: "DEX·DeFi·桥接·钱包", color: "blue", tools: "100", href: "/mcp/onchain" },
  { id: "outcomes", icon: Target, title: "预测市场", desc: "事件·市场·概率·套利", color: "amber", tools: "10", href: "/mcp/outcomes" },
  { id: "kb", icon: BookOpen, title: "知识库", desc: "API文档·工具目录·审计", color: "purple", tools: "50+", href: "/mcp/kb" },
  { id: "signals", icon: Radio, title: "信号策略", desc: "聪明钱·牛人榜·策略", color: "pink", tools: "30", href: "/mcp/signals" },
  { id: "collab", icon: Users, title: "通讯站", desc: "AI协作·多Agent·WS", color: "sky", tools: "8", href: "/mcp/collab" },
  { id: "plugins", icon: Zap, title: "Plugin Manager", desc: "插件管理·动态加载", color: "violet", tools: "5", href: "/mcp/plugins" },
  { id: "agent", icon: Activity, title: "AI Agent", desc: "智能代理·监控·执行", color: "amber", tools: "5", href: "/mcp/agent" },
  { id: "memory", icon: Brain, title: "Memory Engine", desc: "记忆·偏好·上下文", color: "teal", tools: "6", href: "/mcp/memory" },
];

const COLORS: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  sky: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  violet: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
};

export default function McpPage() {
  const [stats, setStats] = useState<StatsData>({ plugins: 3, running: 1, tools: 180, agentTasks: 5, memoryEntries: 6 });
  const [pct, setPct] = useState(83);

  useEffect(() => {
    fetch("/api/plugins").then(r => r.json()).then(d => setStats(s => ({ ...s, plugins: d.plugins?.length || 3, running: d.runningPlugins || 1, tools: d.totalTools || 180 }))).catch(() => {});
  }, []);

  return (
    <div className="container-page py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Hvip-One 中控台</h1>
          <p className="text-sm text-zinc-400 mt-1">v2.0 · MCP Protocol · {MODULES.length} 模块 · {stats.tools}+ 工具</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent">
          <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>
          {stats.running} plugin{stats.running > 1 ? "s" : ""} running
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "MCP 工具", value: stats.tools, icon: Zap, color: "text-emerald-400" },
          { label: "插件", value: `${stats.running}/${stats.plugins}`, icon: Activity, color: "text-blue-400" },
          { label: "页面模块", value: MODULES.length, icon: TrendingUp, color: "text-amber-400" },
          { label: "Agent 任务", value: stats.agentTasks, icon: Brain, color: "text-purple-400" },
          { label: "WS Gateway", value: ":3457", icon: Radio, color: "text-sky-400" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-1"><p className="text-[10px] text-neutral-500 uppercase">{s.label}</p><s.icon className={`w-4 h-4 ${s.color}`} /></div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Construction Progress */}
      <div className="card p-5">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-xs font-semibold text-white">📐 施工进度</h3>
          <span className="text-xs font-bold text-white">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden mb-4">
          <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: `${pct}%`, transition: "width 1s" }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {[
            { label: "Phase 1: 页面框架 + 生产部署", done: true },
            { label: "Phase 2: MCP 协议对接 (Plugin/Agent/Memory)", done: true },
            { label: "Phase 2: API 端点建设", done: true },
            { label: "Phase 3: 实时数据 + 可视化", done: false, current: true },
            { label: "Phase 4: 用户认证 + 多账户", done: false },
            { label: "Phase 5: AI Agent 全自动运维", done: false },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${s.current ? "bg-emerald-500/[0.06] border border-emerald-500/10" : ""}`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.done ? "bg-emerald-400" : s.current ? "bg-blue-400 animate-pulse" : "bg-neutral-700"}`} />
              <span className={s.done ? "text-neutral-400" : s.current ? "text-white font-semibold" : "text-neutral-600"}>{s.label}</span>
              {s.current && <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">进行中</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">模块导航</h3>
      <div className="grid grid-cols-3 gap-3">
        {MODULES.map(m => {
          const Icon = m.icon;
          const c = (COLORS[m.color] || "").split(" ");
          return (
            <Link key={m.id} href={m.href} className="group">
              <div className="card p-4 h-full hover:border-emerald-500/20 transition-all duration-200 cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl ${c[1]} border ${c[2]} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${c[0]}`} />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-[13px] font-semibold text-white mb-1">{m.title}</h4>
                <p className="text-[11px] text-neutral-500 mb-2">{m.desc}</p>
                <span className="text-[9px] text-neutral-700 bg-ink-soft px-1.5 py-0.5 rounded">{m.tools}+ tools</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Target, BookOpen, Radio, Users, ChevronRight, CheckCircle2, Circle, Loader2, Zap, Activity } from "lucide-react";

const MODULES = [
  { id: "cex", icon: TrendingUp, title: "CEX 交易中心", desc: "行情 · 交易 · 账户 · 策略", color: "emerald", tools: 180, href: "/mcp/cex" },
  { id: "onchain", icon: BarChart3, title: "Onchain OS", desc: "DEX · DeFi · 桥接 · 钱包 · 安全", color: "blue", tools: 100, href: "/mcp/onchain" },
  { id: "outcomes", icon: Target, title: "预测市场", desc: "事件 · 市场 · 概率 · 套利", color: "amber", tools: 10, href: "/mcp/outcomes" },
  { id: "kb", icon: BookOpen, title: "知识库", desc: "API 文档 · 工具目录 · 审计", color: "purple", tools: 301, href: "/mcp/kb" },
  { id: "signals", icon: Radio, title: "信号策略", desc: "聪明钱 · 牛人榜 · 策略市场", color: "pink", tools: 30, href: "/mcp/signals" },
  { id: "collab", icon: Users, title: "Agent 通讯站", desc: "AI 协作 · 多Agent · WS实时", color: "sky", tools: 8, href: "/mcp/collab" },
  { id: "plugins", icon: Zap, title: "Plugin Manager", desc: "插件管理 · 动态加载 · 启停", color: "violet", tools: 5, href: "/mcp/plugins" },
  { id: "agent", icon: Activity, title: "AI Agent", desc: "智能代理 · 监控 · 执行", color: "amber", tools: 5, href: "/mcp/agent" },
  { id: "memory", icon: BookOpen, title: "Memory Engine", desc: "记忆 · 偏好 · 上下文", color: "teal", tools: 6, href: "/mcp/memory" },
];

const STEPS = [
  { label: "需求分析 + 框架设计", done: true },
  { label: "工作区配置 + STATUS.md", done: true },
  { label: "6 模块页面框架", done: true },
  { label: "shadcn/ui 组件系统", done: true },
  { label: "UI 美化升级", done: false, current: true },
  { label: "后端 API 对接", done: false },
];

const colors: Record<string, string> = {
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
  const done = STEPS.filter(s => s.done).length;
  const pct = Math.round((done / STEPS.length) * 100);

  return (
    <div className="container-page py-8 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">MCP 中控面板</h1>
          <p className="text-sm text-zinc-400 mt-1">OKX MCP Console · 6 模块 · 301+ 工具 · hvip-mcp-server v0.2.40</p>
        </div>
        <Badge variant="success" className="gap-1.5 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          在线
        </Badge>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "MCP 工具总数", value: "301", icon: Zap, color: "text-emerald-400" },
          { label: "页面模块", value: "7", icon: Activity, color: "text-blue-400" },
          { label: "完成进度", value: `${pct}%`, icon: TrendingUp, color: "text-amber-400" },
          { label: "WS 网关", value: ":3457", icon: Radio, color: "text-purple-400" },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-normal text-zinc-400">{s.label}</CardTitle>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Progress ── */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-zinc-500">任务进度</span>
            <span className="text-sm font-bold text-white">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
            <div className="h-full rounded-full transition-all bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: `${pct}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              任务清单
            </CardTitle>
            <CardDescription>{done}/{STEPS.length} 完成</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg text-[12px] ${s.current ? "bg-emerald-500/[0.06] border border-emerald-500/10" : ""}`}>
                {s.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> :
                 s.current ? <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin flex-shrink-0" /> :
                 <Circle className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0" />}
                <span className={s.done ? "text-zinc-500 line-through" : s.current ? "text-white font-semibold" : "text-zinc-600"}>{s.label}</span>
                {s.current && <Badge variant="success" className="ml-auto text-[9px]">进行中</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-3">
          {MODULES.map(m => {
            const Icon = m.icon;
            const c = colors[m.color].split(" ");
            return (
              <Link key={m.id} href={m.href} className="group">
                <Card className="h-full hover:border-emerald-500/20 transition-all duration-200 cursor-pointer">
                  <CardHeader className="flex-row items-start justify-between pb-2">
                    <div className={`w-9 h-9 rounded-xl ${c[1]} border ${c[2]} flex items-center justify-center`}>
                      <Icon className={`w-4.5 h-4.5 ${c[0]}`} />
                    </div>
                    <Badge variant="outline" className="text-[9px]">就绪</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-1 text-sm">{m.title}</CardTitle>
                    <CardDescription className="mb-3">{m.desc}</CardDescription>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-zinc-600">{m.tools}+ 工具</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

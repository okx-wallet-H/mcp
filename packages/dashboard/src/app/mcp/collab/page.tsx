"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ━━━━━ Agent 列表 ━━━━━
const AGENTS = [
  { id: "cline", name: "Cline", role: "AI", status: "online", avatar: "🤖", desc: "主控 AI · 代码生成 · 项目构建", tasks: 9, lastActive: "刚刚" },
  { id: "trader", name: "Trade Agent", role: "AI", status: "online", avatar: "📈", desc: "交易执行 · 策略管理 · 风险控制", tasks: 3, lastActive: "5m ago" },
  { id: "monitor", name: "Monitor Agent", role: "AI", status: "online", avatar: "📡", desc: "行情监控 · 异动告警 · 7x24", tasks: 12, lastActive: "刚刚" },
  { id: "audit", name: "Audit Agent", role: "AI", status: "idle", avatar: "🔍", desc: "工具审计 · 质量评分 · 缺口追踪", tasks: 57, lastActive: "1h ago" },
  { id: "signal", name: "Signal Agent", role: "AI", status: "online", avatar: "📊", desc: "信号聚合 · 多空分析 · 情绪追踪", tasks: 6, lastActive: "3m ago" },
  { id: "cf", name: "CF", role: "Human", status: "online", avatar: "👤", desc: "项目主导 · 决策 · 审核", tasks: 0, lastActive: "刚刚" },
];

// ━━━━━ 协作房间 ━━━━━
const ROOMS = [
  { id: "trading", name: "交易策略室", icon: "🏦", agents: 3, msgs: 24, active: true, desc: "AI+人类协作制定交易策略" },
  { id: "audit", name: "API 审计室", icon: "🔍", agents: 2, msgs: 8, active: false, desc: "审查 MCP 工具质量" },
  { id: "monitor", name: "行情监控室", icon: "📡", agents: 3, msgs: 56, active: true, desc: "AI 自动监控异动" },
  { id: "build", name: "项目构建室", icon: "🏗️", agents: 2, msgs: 32, active: true, desc: "项目开发进度追踪" },
  { id: "general", name: "公共大厅", icon: "🌐", agents: 6, msgs: 12, active: false, desc: "开放讨论区" },
];

// ━━━━━ 活动日志 ━━━━━
const ACTIVITY_LOG = [
  { time: "00:54", agent: "Cline", action: "完成 P2: Onchain OS + Outcomes 页面", type: "build" },
  { time: "00:48", agent: "Cline", action: "完成 P1: CEX交易中心 + 知识库", type: "build" },
  { time: "00:47", agent: "Cline", action: "创建 /mcp/cex 蜡烛图+订单簿+交易面板", type: "code" },
  { time: "00:44", agent: "Cline", action: "安装 hvip-mcp-server v0.2.40", type: "install" },
  { time: "00:42", agent: "Trade Agent", action: "扫描 BTC 永续资金费率: +0.008%", type: "monitor" },
  { time: "00:40", agent: "Monitor Agent", action: "ETH OI 突变告警: 5min +2.8%", type: "alert" },
];

export default function CollabPage() {
  const [tab, setTab] = useState("overview");
  const [wsStatus, setWsStatus] = useState<"connected"|"connecting"|"disconnected">("connecting");

  useEffect(() => {
    const t = setTimeout(() => setWsStatus("connected"), 1500);
    return () => clearTimeout(t);
  }, []);

  const tabs = [
    { id: "overview", icon: "📋", label: "总览" },
    { id: "agents", icon: "🤖", label: "Agent 状态" },
    { id: "rooms", icon: "💬", label: "协作房间" },
    { id: "activity", icon: "📜", label: "活动日志" },
  ];

  return (
    <div className="container-page py-6">
      {/* ── 面包屑 + WS 状态 ── */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white transition-colors">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">🤝 Agent 通讯站</span>
        <span className="ml-auto flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full ${
            wsStatus === "connected" ? "bg-brand-accent/10 text-brand-accent" :
            wsStatus === "connecting" ? "bg-amber-500/10 text-amber-400" :
            "bg-red-500/10 text-red-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${wsStatus === "connected" ? "bg-brand-accent animate-pulse" : wsStatus === "connecting" ? "bg-amber-400 animate-ping" : "bg-red-400"}`} />
            WS: {wsStatus === "connected" ? "已连接" : wsStatus === "connecting" ? "连接中…" : "断开"}
          </span>
          <span className="text-[10px] text-neutral-600">ws://localhost:3457</span>
        </span>
      </div>

      {/* ── Tab 导航 ── */}
      <div className="flex gap-1 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] transition-all ${tab === t.id ? "bg-white/10 text-white font-semibold" : "text-neutral-500 hover:text-white"}`}>
            <span className="text-sm">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── 总览 ── */}
      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "在线 Agent", value: AGENTS.filter(a => a.status === "online").length, sub: `/ ${AGENTS.length} 总数`, color: "#1cc8a6" },
              { label: "活跃房间", value: ROOMS.filter(r => r.active).length, sub: `/ ${ROOMS.length} 总数`, color: "#4b6fff" },
              { label: "WebSocket", value: "已连接", sub: "ws://localhost:3457", color: "#1cc8a6" },
              { label: "今日消息", value: ROOMS.reduce((s, r) => s + r.msgs, 0), sub: "跨5个房间", color: "#f0b90b" },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[9px] text-neutral-600">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* 消息流预览 */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-white mb-3">📡 实时消息流</h3>
            <div className="space-y-2">
              {ACTIVITY_LOG.slice(0, 4).map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-ink-soft">
                  <span className="text-[10px] text-neutral-600 w-10 tabular-nums">{log.time}</span>
                  <span className="text-xs">{AGENTS.find(a => a.id === "cline")?.avatar || "🤖"}</span>
                  <span className="text-[11px] font-semibold text-white w-20">{log.agent}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    log.type === "build" ? "bg-purple-500/10 text-purple-400" :
                    log.type === "code" ? "bg-blue-500/10 text-blue-400" :
                    log.type === "install" ? "bg-green-500/10 text-green-400" :
                    log.type === "monitor" ? "bg-amber-500/10 text-amber-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{log.type}</span>
                  <span className="text-[11px] text-neutral-400 flex-1">{log.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Agent 状态 ── */}
      {tab === "agents" && (
        <div className="grid grid-cols-3 gap-3">
          {AGENTS.map(agent => (
            <div key={agent.id} className={`card p-4 transition-all ${agent.status === "online" ? "border-brand-accent/10" : "opacity-70"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{agent.avatar}</span>
                  <div>
                    <h3 className="text-xs font-bold text-white">{agent.name}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${agent.role === "AI" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"}`}>{agent.role}</span>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full ${
                  agent.status === "online" ? "bg-brand-accent/10 text-brand-accent" :
                  agent.status === "idle" ? "bg-amber-500/10 text-amber-400" :
                  "bg-neutral-700/50 text-neutral-500"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "online" ? "bg-brand-accent animate-pulse" : agent.status === "idle" ? "bg-amber-400" : "bg-neutral-500"}`} />
                  {agent.status === "online" ? "在线" : agent.status === "idle" ? "空闲" : "离线"}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 mb-3">{agent.desc}</p>
              <div className="flex justify-between text-[9px]">
                <span className="text-neutral-600">任务: {agent.tasks}</span>
                <span className="text-neutral-600">活跃: {agent.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 协作房间 ── */}
      {tab === "rooms" && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {ROOMS.map(room => (
              <div key={room.id} className={`card p-4 hover:border-brand-accent/20 transition-all cursor-pointer ${room.active ? "" : "opacity-60"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{room.icon}</span>
                    <div>
                      <h3 className="text-xs font-bold text-white">{room.name}</h3>
                      <p className="text-[9px] text-neutral-500">{room.desc}</p>
                    </div>
                  </div>
                  {room.active && (
                    <span className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent">
                      <span className="w-1 h-1 rounded-full bg-brand-accent animate-pulse" /> 活跃
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-[9px] mt-3 pt-3 border-t border-ink-line">
                  <span className="text-neutral-500">{room.agents} Agents</span>
                  <span className="text-neutral-500">{room.msgs} 消息</span>
                  <Link href="/collab" className="text-brand-accent hover:underline">进入房间 →</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs text-neutral-400">💡 协作通过 WebSocket 实时通信</p>
            <p className="text-[9px] text-neutral-600 mt-1">协议: JSON-RPC over WS · 房间模型 · 工具调用共享 · Agent 间协作</p>
          </div>
        </div>
      )}

      {/* ── 活动日志 ── */}
      {tab === "activity" && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-line">
            <h3 className="text-xs font-semibold text-white">📜 Agent 活动日志</h3>
            <span className="text-[9px] text-neutral-500">{ACTIVITY_LOG.length} 条记录</span>
          </div>
          {ACTIVITY_LOG.map((log, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-ink-line/30 hover:bg-white/[0.02] transition-colors">
              <span className="text-[10px] text-neutral-600 w-12 tabular-nums">{log.time}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                log.type === "build" ? "bg-purple-400" :
                log.type === "code" ? "bg-blue-400" :
                log.type === "install" ? "bg-green-400" :
                log.type === "monitor" ? "bg-amber-400" :
                "bg-red-400"
              }`} />
              <span className="text-xs">{AGENTS.find(a => a.id === "cline")?.avatar || "🤖"}</span>
              <span className="text-[11px] font-semibold text-white w-24">{log.agent}</span>
              <span className="text-[10px] text-neutral-400 flex-1">{log.action}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                log.type === "build" ? "bg-purple-500/10 text-purple-400" :
                log.type === "code" ? "bg-blue-500/10 text-blue-400" :
                log.type === "install" ? "bg-green-500/10 text-green-400" :
                log.type === "monitor" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}>{log.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, TrendingUp, ArrowLeftRight, Landmark, Wallet, Shield, Radio, Search, Zap, Layers, Globe, Bot } from "lucide-react";

// ━━━━━ Onchain OS Module Cards ━━━━━
const MODULES = [
  { icon: TrendingUp,    label: "DEX 行情",    desc: "代币价格 · K线 · 指数",       tools: "okx_get_ticker",       color: "emerald", href: "#" },
  { icon: ArrowLeftRight, label: "Swap 交易",   desc: "聚合DEX · 最优路由 · 报价",   tools: "okx_dex_swap",          color: "blue",    href: "#" },
  { icon: Landmark,       label: "DeFi 投资",   desc: "理财 · 质押 · 借贷 · APY",    tools: "okx_defi_invest",       color: "amber",   href: "#" },
  { icon: Layers,         label: "DeFi 持仓",   desc: "持仓概览 · 协议详情",         tools: "okx_defi_portfolio",    color: "purple",  href: "#" },
  { icon: ArrowLeftRight, label: "跨链桥",      desc: "跨链转账 · 费用对比 · 追踪",   tools: "okx_dex_bridge",        color: "sky",     href: "#" },
  { icon: Wallet,         label: "钱包管理",   desc: "余额 · 转账 · 充值 · Gas",     tools: "okx_agentic_wallet",    color: "pink",    href: "#" },
  { icon: Shield,         label: "安全扫描",   desc: "代币 · 交易 · DApp · 签名",    tools: "okx_security",          color: "red",     href: "#" },
  { icon: Radio,          label: "社交信号",   desc: "新闻 · 情绪 · KOL · 热度",     tools: "okx_dex_social",        color: "orange",  href: "#" },
  { icon: Globe,          label: "DApp 发现",  desc: "20+ 协议 · 一键安装",         tools: "okx_dapp_discovery",    color: "teal",    href: "#" },
  { icon: Zap,            label: "聪明钱",     desc: "大户追踪 · 信号 · 牛人榜",     tools: "okx_dex_signal",        color: "amber",   href: "#" },
  { icon: Search,         label: "代币探索",   desc: "热门 · 趋势 · 风险 · 持仓",    tools: "okx_dex_token",         color: "blue",    href: "#" },
  { icon: Bot,            label: "Meme 掘金",  desc: "新盘 · 开发者 · 绑定曲线",    tools: "okx_dex_trenches",      color: "pink",    href: "#" },
];

const STATS = [
  { label: "链上工具", value: "100+", icon: Zap },
  { label: "支持链", value: "20+", icon: Globe },
  { label: "聚合DEX", value: "500+", icon: Layers },
  { label: "DApp协议", value: "20+", icon: Bot },
];

const colorMap: Record<string, string> = {
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  blue:    "text-blue-400 bg-blue-500/10 border-blue-500/20",
  amber:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  purple:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  sky:     "text-sky-400 bg-sky-500/10 border-sky-500/20",
  pink:    "text-pink-400 bg-pink-500/10 border-pink-500/20",
  red:     "text-red-400 bg-red-500/10 border-red-500/20",
  orange:  "text-orange-400 bg-orange-500/10 border-orange-500/20",
  teal:    "text-teal-400 bg-teal-500/10 border-teal-500/20",
};

export default function OnchainPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MODULES : MODULES.filter(m => m.color === filter);

  return (
    <div className="container-page py-6">
      {/* ── 面包屑 ── */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white transition-colors">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">⛓️ Onchain OS</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> 100+ 链上工具
        </span>
      </div>

      {/* ── 头部 ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Onchain OS</h1>
          <p className="text-sm text-neutral-500 mt-1">
            DEX · DeFi · 桥接 · 钱包 · 安全 — 聚合 500+ DEX，覆盖 20+ 链
          </p>
        </div>
      </div>

      {/* ── 统计卡片 ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{s.label}</p>
              <s.icon className="w-4 h-4 text-neutral-600" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── XLayer 链上状态 (WS 已就绪) ── */}
      <div className="card p-5 mb-6 border-l-2 border-blue-500/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">XLayer 链上信号基站</h3>
            <p className="text-[11px] text-neutral-500">
              wss://xlayerws.okx.com · eth_subscribe 就绪 · <span className="text-blue-400">ws://localhost:3457</span>
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            已连接
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-[11px]">
          {[
            { label: "新区块",   sub: "eth_subscribe('newHeads')" },
            { label: "事件日志", sub: "eth_subscribe('logs')" },
            { label: "待处理TX", sub: "pending (即将支持)" },
          ].map(c => (
            <div key={c.label} className="bg-ink-soft rounded-xl p-3 border border-ink-line">
              <span className="text-white font-semibold">{c.label}</span>
              <p className="text-neutral-600 mt-0.5 font-mono text-[9px]">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 模块筛选 ── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {["all", "emerald", "blue", "amber", "purple", "pink", "sky", "red", "orange", "teal"].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-[10px] px-3 py-1.5 rounded-lg transition-all ${
              filter === c ? "bg-white/10 text-white" : "text-neutral-500 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {c === "all" ? "全部" : c === "emerald" ? "🟢 行情" : c === "blue" ? "🔵 交易" : c === "amber" ? "🟡 投资" :
             c === "purple" ? "🟣 持仓" : c === "pink" ? "🩷 钱包" : c === "sky" ? "🔷 桥接" :
             c === "red" ? "🔴 安全" : c === "orange" ? "🟠 社交" : "🟢 DApp"}
          </button>
        ))}
      </div>

      {/* ── 模块卡片网格 ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {filtered.map(m => {
          const Icon = m.icon;
          const c = colorMap[m.color]?.split(" ") || [];
          return (
            <div
              key={m.label}
              className="card p-4 group cursor-pointer hover:border-white/[0.1] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${c[1]} border ${c[2]} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${c[0]}`} />
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-700 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1">{m.label}</h3>
              <p className="text-[11px] text-neutral-500 mb-2">{m.desc}</p>
              <span className="text-[9px] text-neutral-700 font-mono bg-ink-soft px-1.5 py-0.5 rounded">{m.tools}</span>
            </div>
          );
        })}
      </div>

      {/* ── 快捷操作 ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Token 价格查询",    icon: "💹", desc: "查看任意代币实时价格和K线" },
          { label: "跨链 Swap",        icon: "🔄", desc: "500+ DEX 聚合最优路由" },
          { label: "跨链资产桥接",      icon: "🌉", desc: "Stargate / Across / Relay" },
          { label: "安全扫描检测",      icon: "🛡️", desc: "代币/交易/DApp 风险检测" },
        ].map(q => (
          <div key={q.label} className="card p-4 text-center cursor-pointer hover:border-blue-500/20 transition-all group">
            <span className="text-2xl">{q.icon}</span>
            <p className="text-xs font-semibold text-white mt-2 group-hover:text-blue-400 transition-colors">{q.label}</p>
            <p className="text-[10px] text-neutral-600 mt-1">{q.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

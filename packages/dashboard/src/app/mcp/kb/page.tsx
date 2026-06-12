"use client";
import { useState } from "react";
import Link from "next/link";

// ━━━━━ 工具目录数据 ━━━━━
const TOOLS = [
  // CEX Market (~60 tools)
  { name: "okx_get_ticker", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取单个或多个产品的实时行情Ticker，包含最新价、买一价、卖一价、24h成交量等", quality: 5 },
  { name: "okx_get_tickers", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取某类产品的全量行情列表", quality: 5 },
  { name: "okx_get_orderbook", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品的订单簿深度，含买卖双方挂单价格和数量", quality: 5 },
  { name: "okx_get_candles", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品K线数据（OHLCV）", quality: 5 },
  { name: "okx_get_trades", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品最新成交记录", quality: 4 },
  { name: "okx_get_history_candles", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品历史K线数据（最近3个月以前）", quality: 4 },
  { name: "okx_get_history_trades", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品历史成交记录（最近3个月）", quality: 4 },
  { name: "okx_get_system_status", module: "cex", category: "系统", auth: "PUBLIC", risk: "READ", desc: "获取OKX系统维护状态", quality: 4 },
  { name: "okx_get_block_tickers", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取大宗交易实时行情", quality: 3 },
  { name: "okx_get_block_ticker", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取大宗交易单个产品实时行情", quality: 3 },
  { name: "okx_get_books_full", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取产品全深度订单簿（所有档位）", quality: 4 },
  { name: "okx_get_index_tickers", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取指数行情列表（多交易所加权均价）", quality: 3 },
  { name: "okx_get_index_candles", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取指数K线数据", quality: 3 },
  { name: "okx_get_history_index_candles", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取指数历史K线（3个月以前）", quality: 3 },
  { name: "okx_get_mark_price", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取标记价格", quality: 3 },
  { name: "okx_get_index_price", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取指数价格（多交易所加权均价）", quality: 3 },
  { name: "okx_get_open_interest", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取合约持仓量", quality: 4 },
  { name: "okx_get_funding_rate", module: "cex", category: "行情", auth: "PUBLIC", risk: "READ", desc: "获取永续合约当前及预测资金费率", quality: 4 },
  { name: "okx_get_instruments", module: "cex", category: "产品", auth: "PUBLIC", risk: "READ", desc: "获取OKX可交易产品列表", quality: 5 },
  { name: "okx_search_instruments", module: "cex", category: "产品", auth: "PUBLIC", risk: "READ", desc: "按关键词搜索可交易产品", quality: 4 },

  // CEX Trade (~20 tools)
  { name: "okx_place_order", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "在OKX下单", quality: 5 },
  { name: "okx_cancel_order", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "撤销指定订单", quality: 5 },
  { name: "okx_amend_order", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "修改未成交订单的价格或数量", quality: 4 },
  { name: "okx_batch_orders", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "批量下单（最多20笔）", quality: 4 },
  { name: "okx_batch_cancel_orders", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "批量撤销订单", quality: 4 },
  { name: "okx_close_position", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "市价全平某仓位", quality: 5 },
  { name: "okx_mass_cancel", module: "cex", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "批量撤销某产品类型下所有挂单", quality: 3 },
  { name: "okx_order_precheck", module: "cex", category: "交易", auth: "API_KEY", risk: "READ", desc: "下单预检（验证订单参数是否合法）", quality: 3 },

  // CEX Account (~20 tools)
  { name: "okx_get_balance", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询交易账户余额", quality: 5 },
  { name: "okx_get_positions", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询当前所有持仓信息", quality: 5 },
  { name: "okx_get_orders_history", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询最近的历史成交订单列表", quality: 4 },
  { name: "okx_get_account_config", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询账户当前配置", quality: 4 },
  { name: "okx_get_leverage_info", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询指定产品的当前杠杆倍数设置", quality: 3 },
  { name: "okx_set_leverage", module: "cex", category: "账户", auth: "API_KEY", risk: "ADMIN", desc: "设置某产品的杠杆倍数", quality: 4 },
  { name: "okx_get_fee_rates", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "查询账户当前手续费率", quality: 3 },
  { name: "okx_get_asset_valuation", module: "cex", category: "账户", auth: "API_KEY", risk: "READ", desc: "获取OKX账户总资产估值", quality: 3 },

  // CEX Strategy (~10 tools)
  { name: "okx_get_grid_ai_param", module: "cex", category: "策略", auth: "PUBLIC", risk: "READ", desc: "获取OKX智能网格推荐参数", quality: 4 },
  { name: "okx_get_grid_orders_pending", module: "cex", category: "策略", auth: "API_KEY", risk: "READ", desc: "查询当前运行中的网格策略列表", quality: 4 },
  { name: "okx_create_grid_order", module: "cex", category: "策略", auth: "API_KEY", risk: "WRITE", desc: "创建网格交易订单", quality: 4 },
  { name: "okx_create_recurring_plan", module: "cex", category: "策略", auth: "API_KEY", risk: "WRITE", desc: "创建定投计划（DCA）", quality: 4 },
  { name: "okx_get_signal_bots_pending", module: "cex", category: "策略", auth: "API_KEY", risk: "READ", desc: "查询当前运行中的信号交易机器人", quality: 3 },
  { name: "okx_get_lead_trader_stats", module: "cex", category: "策略", auth: "PUBLIC", risk: "READ", desc: "查询指定带单员的绩效统计", quality: 4 },

  // Onchain (~12 representative tools)
  { name: "okx_get_ticker", module: "onchain", category: "行情", auth: "PUBLIC", risk: "READ", desc: "DEX 行情数据（通过 onchainos 接口）", quality: 4 },
  { name: "okx_dex_swap", module: "onchain", category: "交易", auth: "API_KEY", risk: "WRITE", desc: "DEX 聚合交易", quality: 4 },
  { name: "okx_defi_invest", module: "onchain", category: "DeFi", auth: "API_KEY", risk: "WRITE", desc: "DeFi 投资产品发现与执行", quality: 4 },
  { name: "okx_defi_portfolio", module: "onchain", category: "DeFi", auth: "API_KEY", risk: "READ", desc: "DeFi 持仓查询", quality: 4 },
  { name: "okx_dex_bridge", module: "onchain", category: "桥接", auth: "API_KEY", risk: "WRITE", desc: "跨链桥接", quality: 4 },
  { name: "okx_agentic_wallet", module: "onchain", category: "钱包", auth: "API_KEY", risk: "WRITE", desc: "Agentic Wallet 操作", quality: 4 },
  { name: "okx_security", module: "onchain", category: "安全", auth: "API_KEY", risk: "READ", desc: "安全扫描", quality: 4 },
  { name: "okx_dex_signal", module: "onchain", category: "信号", auth: "API_KEY", risk: "READ", desc: "聪明钱/大户信号追踪", quality: 4 },
  { name: "okx_dex_trenches", module: "onchain", category: "Meme", auth: "PUBLIC", risk: "READ", desc: "Meme代币新盘扫描", quality: 3 },
  { name: "okx_dex_social", module: "onchain", category: "社交", auth: "PUBLIC", risk: "READ", desc: "社交层信号（新闻/情绪/热度）", quality: 3 },

  // Outcomes (~6 tools)
  { name: "outcomes_list_events", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "列出OKX预测市场所有事件", quality: 4 },
  { name: "outcomes_get_event", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "获取单个预测市场事件的完整信息", quality: 4 },
  { name: "outcomes_get_market", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "获取单个预测市场详情", quality: 4 },
  { name: "outcomes_get_ticker", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "获取预测市场单边实时报价", quality: 4 },
  { name: "outcomes_get_candles", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "获取预测市场K线数据", quality: 3 },
  { name: "outcomes_check_arbitrage", module: "outcomes", category: "预测", auth: "API_KEY", risk: "READ", desc: "检测预测市场无风险套利机会", quality: 4 },

  // Signals (~6 tools)
  { name: "okx_dex_signal", module: "signals", category: "信号", auth: "API_KEY", risk: "READ", desc: "聪明钱/KOL 信号追踪", quality: 4 },
  { name: "okx_get_long_short_ratio", module: "signals", category: "信号", auth: "PUBLIC", risk: "READ", desc: "获取合约多空账户比例", quality: 3 },
  { name: "okx_get_top_trader_long_short_ratio", module: "signals", category: "信号", auth: "PUBLIC", risk: "READ", desc: "获取精英交易员多空持仓比例", quality: 3 },
  { name: "okx_get_put_call_ratio", module: "signals", category: "信号", auth: "PUBLIC", risk: "READ", desc: "获取期权Put/Call比", quality: 3 },
  { name: "okx_get_taker_flow", module: "signals", category: "信号", auth: "PUBLIC", risk: "READ", desc: "获取主动买卖成交数据", quality: 3 },
  { name: "okx_sentiment_tracker", module: "signals", category: "信号", auth: "API_KEY", risk: "READ", desc: "市场情绪追踪", quality: 4 },

  // Collab (~4 tools)
  { name: "okx_ws_collab_join", module: "collab", category: "协作", auth: "PUBLIC", risk: "READ", desc: "加入协作房间", quality: 3 },
  { name: "okx_ws_collab_send", module: "collab", category: "协作", auth: "PUBLIC", risk: "READ", desc: "发送协作消息", quality: 3 },
  { name: "okx_ws_tool_call", module: "collab", category: "协作", auth: "API_KEY", risk: "WRITE", desc: "协作中共享工具调用", quality: 3 },
  { name: "okx_audit_log", module: "collab", category: "审计", auth: "API_KEY", risk: "READ", desc: "导出审计日志", quality: 3 },
];

// ━━━━━ 模块配置 ━━━━━
const MODULES = {
  all: { label: "全部", color: "#888" },
  cex: { label: "📈 CEX", color: "#1cc8a6" },
  onchain: { label: "⛓️ Onchain", color: "#4b6fff" },
  outcomes: { label: "🎯 Outcomes", color: "#f0b90b" },
  signals: { label: "📡 Signals", color: "#f472b6" },
  collab: { label: "🤝 Collab", color: "#38bdf8" },
};

const AUTH_BADGES: Record<string, string> = {
  PUBLIC: "bg-green-500/10 text-green-400",
  API_KEY: "bg-blue-500/10 text-blue-400",
};

const RISK_BADGES: Record<string, string> = {
  READ: "bg-white/[0.04] text-neutral-400",
  WRITE: "bg-amber-500/10 text-amber-400",
  ADMIN: "bg-red-500/10 text-red-400",
};

function qualityColor(q: number) {
  if (q >= 5) return "#1cc8a6";
  if (q >= 4) return "#4b6fff";
  if (q >= 3) return "#f0b90b";
  return "#ff5a5f";
}

// ━━━━━ 主页面 ━━━━━
export default function KbPage() {
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "quality">("name");

  const filtered = TOOLS
    .filter(t => {
      const matchMod = module === "all" || t.module === module;
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.includes(search);
      return matchMod && matchSearch;
    })
    .sort((a, b) => sortKey === "quality" ? b.quality - a.quality : a.name.localeCompare(b.name));

  // 统计
  const totalTools = TOOLS.length;
  const filteredCount = filtered.length;
  const avgQuality = +(filtered.reduce((s, t) => s + t.quality, 0) / filtered.length).toFixed(1) || 0;
  const p0Gaps = TOOLS.filter(t => t.quality <= 2).length;

  // 模块统计
  const moduleStats = Object.entries(MODULES).filter(([k]) => k !== "all").map(([key, val]) => ({
    key, label: val.label, color: val.color,
    count: TOOLS.filter(t => t.module === key).length,
    avgQ: +(TOOLS.filter(t => t.module === key).reduce((s, t) => s + t.quality, 0) / TOOLS.filter(t => t.module === key).length || 0).toFixed(1),
  }));

  return (
    <div className="container-page py-6">
      {/* ── 面包屑 ── */}
      <div className="flex items-center gap-2 mb-4 text-xs">
        <Link href="/mcp" className="text-neutral-500 hover:text-white transition-colors">中控台</Link>
        <span className="text-neutral-700">/</span>
        <span className="text-white font-semibold">📚 知识库</span>
        <span className="ml-auto text-[10px] text-neutral-500">{totalTools} 工具 · 质量均分 {avgQuality}/6</span>
      </div>

      {/* ── 审计面板 ── */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {[
          { label: "工具总数", value: totalTools, color: "#1cc8a6" },
          { label: "质量均分", value: avgQuality + "/6", color: qualityColor(avgQuality) },
          { label: "P0 缺口", value: p0Gaps, color: p0Gaps > 0 ? "#ff5a5f" : "#1cc8a6" },
          ...moduleStats.slice(0, 3).map(m => ({
            label: m.label, value: `${m.count}工具 ${m.avgQ}/6`, color: m.color,
          })),
        ].map(s => (
          <div key={s.label} className="card p-3 text-center">
            <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── 搜索 + 筛选 ── */}
      <div className="flex gap-3 mb-4">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜索工具名称或描述…"
          className="flex-1 bg-ink-card border border-ink-line rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-brand-accent/30"
        />
        <div className="flex gap-1">
          {Object.entries(MODULES).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setModule(key)}
              className={`text-[10px] px-3 py-2 rounded-xl transition-all ${
                module === key ? "bg-white/10 text-white font-semibold" : "text-neutral-500 hover:text-white"
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>
        <select
          value={sortKey}
          onChange={e => setSortKey(e.target.value as any)}
          className="bg-ink-card border border-ink-line rounded-xl px-3 py-2 text-[10px] text-neutral-400 focus:outline-none"
        >
          <option value="name">按名称排序</option>
          <option value="quality">按质量排序</option>
        </select>
        <span className="flex items-center text-[10px] text-neutral-600 tabular-nums whitespace-nowrap">
          {filteredCount} / {totalTools}
        </span>
      </div>

      {/* ── 工具列表 ── */}
      <div className="card overflow-hidden">
        {/* 表头 */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line text-[9px] text-neutral-500 uppercase tracking-wider">
          <span className="col-span-4">工具名称</span>
          <span className="col-span-5">描述</span>
          <span className="col-span-1 text-center">模块</span>
          <span className="col-span-1 text-center">鉴权</span>
          <span className="col-span-1 text-center">质量</span>
        </div>

        {/* 列表行 */}
        <div className="max-h-[500px] overflow-y-auto">
          {filtered.map((t, i) => (
            <div
              key={t.name + i}
              className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-ink-line/30 hover:bg-white/[0.02] transition-colors items-center"
            >
              <span className="col-span-4 text-[11px] font-mono text-brand-accent truncate">{t.name}</span>
              <span className="col-span-5 text-[10px] text-neutral-400 leading-relaxed truncate">{t.desc}</span>
              <span className="col-span-1 text-center">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: MODULES[t.module as keyof typeof MODULES]?.color + "15", color: MODULES[t.module as keyof typeof MODULES]?.color }}>
                  {MODULES[t.module as keyof typeof MODULES]?.label}
                </span>
              </span>
              <span className="col-span-1 text-center">
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${AUTH_BADGES[t.auth] || ""}`}>{t.auth === "PUBLIC" ? "公开" : "Key"}</span>
              </span>
              <span className="col-span-1 text-center">
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 6 }, (_, idx) => (
                    <span
                      key={idx}
                      className="w-1.5 h-2 rounded-sm"
                      style={{
                        background: idx < t.quality ? qualityColor(t.quality) : "transparent",
                        border: idx < t.quality ? "none" : "1px solid rgba(255,255,255,0.05)",
                      }}
                    />
                  ))}
                </span>
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-neutral-600 text-xs">未找到匹配的工具</div>
          )}
        </div>
      </div>

      {/* ── 质量分布 ── */}
      <div className="grid grid-cols-6 gap-3 mt-4">
        {[5, 4, 3, 2, 1, 0].map(score => {
          const count = filtered.filter(t => t.quality === score).length;
          return (
            <div key={score} className="card p-3 text-center">
              <p className="text-[9px] text-neutral-500">{score}分</p>
              <div className="flex justify-center gap-0.5 my-1">
                {Array.from({ length: score }, (_, i) => (
                  <span key={i} className="w-2 h-2 rounded-sm" style={{ background: qualityColor(score) }} />
                ))}
              </div>
              <p className="text-xs font-bold" style={{ color: qualityColor(score) }}>{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

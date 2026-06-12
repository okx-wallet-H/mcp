// MCP 全景图数据模块

export interface Module {
  icon: string;
  name: string;
  totalEndpoints: number;
  covered: number;
  avgQuality: number;
  p0: number;
  color: string;
}

export const MODULES: Module[] = [
  { icon: "🏦", name: "CEX 交易",      totalEndpoints: 180, covered: 156, avgQuality: 5, p0: 0, color: "emerald" },
  { icon: "⛓️", name: "Onchain",       totalEndpoints: 100, covered: 89,  avgQuality: 4, p0: 1, color: "blue" },
  { icon: "🎯", name: "预测市场",      totalEndpoints: 10,  covered: 10,  avgQuality: 5, p0: 0, color: "amber" },
  { icon: "📚", name: "知识库",        totalEndpoints: 301, covered: 301, avgQuality: 6, p0: 0, color: "purple" },
  { icon: "📡", name: "信号策略",      totalEndpoints: 30,  covered: 24,  avgQuality: 4, p0: 1, color: "pink" },
  { icon: "🤝", name: "Agent 通讯站",  totalEndpoints: 8,   covered: 5,   avgQuality: 3, p0: 1, color: "sky" },
];

export const PROGRESS = 4;
export const TOTAL_STEPS = 6;
export const ACTIVITY = 12;

export const QUALITY = [
  { label: "P0 未修复",  color: "#ef4444" },
  { label: "待完善",     color: "#f59e0b" },
  { label: "基础覆盖",   color: "#eab308" },
  { label: "稳定可用",   color: "#22c55e" },
  { label: "高质量",     color: "#10b981" },
  { label: "生产级",     color: "#06b6d4" },
  { label: "完美",       color: "#8b5cf6" },
];

export function getTotalCovered(): number {
  return MODULES.reduce((sum, m) => sum + m.covered, 0);
}

export function getTotalEndpoints(): number {
  return MODULES.reduce((sum, m) => sum + m.totalEndpoints, 0);
}

export function getCoveragePct(): number {
  const covered = getTotalCovered();
  const total = getTotalEndpoints();
  return total > 0 ? Math.round((covered / total) * 100) : 0;
}

export function covColor(covered: number, total: number): string {
  if (total === 0) return "#6b7280";
  const pct = covered / total;
  if (pct >= 0.95) return "#10b981";
  if (pct >= 0.8) return "#22c55e";
  if (pct >= 0.6) return "#eab308";
  if (pct >= 0.4) return "#f59e0b";
  return "#ef4444";
}

export function qualityColor(score: number): string {
  if (score >= 6) return "#8b5cf6";
  if (score >= 5) return "#06b6d4";
  if (score >= 4) return "#10b981";
  if (score >= 3) return "#22c55e";
  if (score >= 2) return "#eab308";
  return "#f59e0b";
}

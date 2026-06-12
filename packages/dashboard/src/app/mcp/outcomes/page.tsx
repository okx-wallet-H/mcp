import Link from "next/link";

export default function OutcomesPage() {
  return (
    <div className="container-page py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mcp" className="text-sm text-neutral-500 hover:text-white transition-colors">← 中控台</Link>
        <span className="text-neutral-700">/</span>
        <h1 className="text-2xl font-bold text-white">🎯 预测市场</h1>
      </div>
      <p className="text-neutral-500 mb-6">Outcomes API — 事件 · 市场 · 概率 · 套利（构建中）</p>
      <div className="grid grid-cols-3 gap-4">
        {["事件浏览", "市场详情", "套利扫描", "YES/NO 走势", "事件合约", "概率分析"].map((item) => (
          <div key={item} className="card p-4 text-center text-sm text-neutral-400">{item}</div>
        ))}
      </div>
    </div>
  );
}

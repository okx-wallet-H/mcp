import { SignalsMarketCard } from "@/components/mcp/SignalsMarketCard";
import Link from "next/link";

const MARKETPLACE_CARDS = [
    {
        name: "稳盈先锋",
        title: "ETHUSDT 永续 · 合约马丁格尔",
        trend: "做空",
        level: "20x",
        split: "分润 30%",
        performance: "+640.64%",
        profit: "+1,151,978.18 USDT",
        runtime: "244 日 19 小时 55 分",
        drawdown: "0.06%",
        size: "2,714,380.82 USDT",
        symbol: "ETH/USDT",
        followers: "8,323",
        url: "https://www.okx.com/zh-hans/trading-bot/marketplace",
        spark: [0, 2, 1.5, 3.5, 2.7, 4, 3.2, 4.8, 4.4, 5],
    },
    {
        name: "趋势猎手",
        title: "BTCUSDT 永续 · 跟单策略",
        trend: "多头",
        level: "10x",
        split: "分润 25%",
        performance: "+412.12%",
        profit: "+934,210.34 USDT",
        runtime: "180 日 3 小时 21 分",
        drawdown: "0.14%",
        size: "1,820,145.66 USDT",
        symbol: "BTC/USDT",
        followers: "6,908",
        url: "https://www.okx.com/zh-hans/trading-bot/marketplace",
        spark: [0, 1.5, 2.2, 2.1, 3.4, 3.9, 4.7, 4.5, 4.9, 5.2],
    },
];

export default function SignalsPage() {
    return (
        <div className="container-page py-10">
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-neutral-500">策略市场 · 跟单精选</div>
                    <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">信号策略广场</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-400">汇聚最热跟单策略、策略市场精选与智能交易信号。立即查看高收益策略与风控表现，让你的策略入口更可靠。</p>
                </div>
                <Link
                    href="https://www.okx.com/zh-hans/trading-bot/marketplace"
                    className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-accent/30 hover:bg-white/10"
                    target="_blank"
                    rel="noreferrer"
                >
                    进入 OKX 策略市场
                </Link>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.35fr_0.75fr]">
                <div className="space-y-6">
                    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 shadow-[0_40px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                        <div className="bg-gradient-to-r from-brand-accent/15 via-white/5 to-blue-500/15 px-6 py-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-accent">热门跟单策略</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-white">优选收益榜 · 高等级风控</h2>
                                </div>
                                <div className="inline-flex items-center rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-neutral-300">
                                    现实收益 & 风险复核
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-5 p-6 xl:grid-cols-2">
                            {MARKETPLACE_CARDS.map((item) => (
                                <SignalsMarketCard key={item.title} item={item} />
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-[28px] border border-white/10 bg-[#10121a]/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">策略亮点</p>
                            <h3 className="mt-4 text-xl font-semibold text-white">精选参数一览</h3>
                            <div className="mt-5 space-y-4">
                                {[
                                    { label: "风控等级", value: "A级", accent: "text-brand-accent" },
                                    { label: "近7日胜率", value: "82%", accent: "text-brand-accent" },
                                    { label: "可用跟单", value: "3,280 USDT 起", accent: "text-blue-400" },
                                ].map((item) => (
                                    <div key={item.label} className="rounded-3xl bg-white/5 p-4">
                                        <div className="text-sm text-neutral-400">{item.label}</div>
                                        <div className={`mt-2 text-lg font-semibold ${item.accent}`}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-[#10121a]/90 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl">
                            <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">策略导航</p>
                            <h3 className="mt-4 text-xl font-semibold text-white">快速入口</h3>
                            <div className="mt-5 space-y-3">
                                {[
                                    { label: "最新收益榜", href: "https://www.okx.com/zh-hans/trading-bot/marketplace" },
                                    { label: "跟单策略列表", href: "https://www.okx.com/zh-hans/trading-bot/marketplace" },
                                    { label: "我的复制设置", href: "https://www.okx.com/zh-hans/trading-bot/marketplace" },
                                ].map((item) => (
                                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="block rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-brand-accent/20 hover:bg-white/10">
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-[32px] border border-white/10 bg-[#11131c]/90 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">今日热度</p>
                                <p className="mt-3 text-3xl font-semibold text-white">+12.6%</p>
                            </div>
                            <div className="rounded-3xl bg-brand-accent/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">跟单热榜</div>
                        </div>
                        <div className="mt-6 space-y-4 text-sm text-neutral-300">
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-neutral-400">最受欢迎</p>
                                <p className="mt-2 font-medium text-white">ETH 合约马丁格尔</p>
                            </div>
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-neutral-400">明星老师</p>
                                <p className="mt-2 font-medium text-white">稳盈先锋</p>
                            </div>
                            <div className="rounded-3xl bg-white/5 p-4">
                                <p className="text-neutral-400">预估收益</p>
                                <p className="mt-2 font-medium text-white">+34.8% / 30日</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-[#11131c]/90 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                        <p className="text-xs uppercase tracking-[0.24em] text-neutral-500">风险提示</p>
                        <h3 className="mt-4 text-xl font-semibold text-white">策略市场提醒</h3>
                        <p className="mt-4 text-sm leading-7 text-neutral-400">跟单策略存在杠杆与回撤风险，建议先查看策略历史、选定风控等级，再根据自身风险偏好逐步跟单。</p>
                        <div className="mt-5 rounded-3xl bg-white/5 p-4 text-sm text-neutral-300">
                            <p className="font-medium text-white">安全提示</p>
                            <p className="mt-2">仅参考历史收益，不构成投资建议。请谨慎选择策略并控制仓位。</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

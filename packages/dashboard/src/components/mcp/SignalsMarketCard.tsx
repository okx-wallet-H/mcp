import { SignalsSparkline } from "@/components/mcp/SignalsSparkline";

export type SignalsMarketCardProps = {
    item: {
        name: string;
        title: string;
        trend: string;
        level: string;
        split: string;
        performance: string;
        profit: string;
        runtime: string;
        drawdown: string;
        size: string;
        symbol: string;
        followers: string;
        url: string;
        spark: number[];
    };
};

export function SignalsMarketCard({ item }: SignalsMarketCardProps) {
    return (
        <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-3xl border border-white/10 bg-[#11131c] p-5 transition duration-200 hover:-translate-y-1 hover:border-brand-accent/20"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-neutral-500">{item.trend} · {item.level}</div>
                    <h3 className="mt-3 text-xl font-semibold text-white leading-tight">{item.title}</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white">{item.split}</div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-neutral-400">策略收益</p>
                    <p className="mt-2 text-3xl font-semibold text-brand-accent">{item.performance}</p>
                </div>
                <div className="rounded-3xl bg-white/5 px-4 py-3 text-right text-sm text-neutral-300">
                    <p>带单规模</p>
                    <p className="mt-2 text-white font-semibold">{item.size}</p>
                </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white/5 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-neutral-500">
                    <span>趋势图</span>
                    <span>{item.symbol}</span>
                </div>
                <div className="mt-4">
                    <SignalsSparkline data={item.spark} />
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3 text-sm text-neutral-400">
                <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">运行时长</p>
                    <p className="mt-2 text-white font-medium">{item.runtime}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">最大回撤</p>
                    <p className="mt-2 text-white font-medium">{item.drawdown}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">关注人数</p>
                    <p className="mt-2 text-white font-medium">{item.followers}</p>
                </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm text-neutral-300">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">策略作者</p>
                    <p className="mt-2 text-white font-medium">{item.name}</p>
                </div>
                <span className="rounded-full bg-white/5 px-4 py-2 text-[11px] font-semibold text-white">查看详情</span>
            </div>
        </a>
    );
}

export function SignalsSparkline({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / (max - min || 1)) * 100;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg className="h-14 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sparkline-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#1cc8a6" />
                    <stop offset="100%" stopColor="#4b6fff" />
                </linearGradient>
            </defs>
            <polyline
                fill="none"
                stroke="url(#sparkline-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
}

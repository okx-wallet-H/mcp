import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OKX MCP Console",
  description: "MCP-native platform for OKX trading, knowledge base, agent network",
};

const nav = [
  { label: "中控台", href: "/mcp" },
  { label: "CEX", href: "/mcp/cex" },
  { label: "Onchain", href: "/mcp/onchain" },
  { label: "知识库", href: "/mcp/kb" },
  { label: "通讯站", href: "/mcp/collab" },
  { label: "插件", href: "/mcp/plugins" },
  { label: "Agent", href: "/mcp/agent" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-ink antialiased">
        <header className="sticky top-0 z-50 glass border-b border-white/[0.04]">
          <div className="container-page flex h-14 items-center justify-between">
            <Link href="/mcp" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 text-black font-black text-sm shadow-lg shadow-emerald-500/20">M</span>
              <span className="text-sm font-bold tracking-wide text-gradient">OKX MCP Console</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="text-[12px] text-zinc-400 px-3 py-1.5 rounded-lg transition-all hover:text-white hover:bg-white/[0.04]">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

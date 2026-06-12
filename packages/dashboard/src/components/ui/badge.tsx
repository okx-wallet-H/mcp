import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }) {
  const variants: Record<string, string> = {
    default: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
    destructive: "bg-red-500/10 text-red-400 border-red-500/20",
    outline: "bg-transparent text-zinc-400 border-zinc-700",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors", variants[variant], className)} {...props} />
  );
}

export { Badge };

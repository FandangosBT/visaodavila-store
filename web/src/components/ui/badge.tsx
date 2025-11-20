import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "neutral" | "accent" | "success";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const styles: Record<Variant, string> = {
    neutral: "bg-zinc-100 text-zinc-700",
    accent: "bg-accent/10 text-accent",
    success: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] px-1.5 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}


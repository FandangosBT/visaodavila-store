import * as React from "react";
import { cn } from "@/lib/cn";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700",
        className,
      )}
      {...props}
    />
  );
}


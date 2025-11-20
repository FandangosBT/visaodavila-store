import * as React from "react";
import { cn } from "@/lib/cn";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Radio({ label, className, id, ...props }: RadioProps) {
  const input = (
    <input
      id={id}
      type="radio"
      className={cn(
        "h-4 w-4 border-zinc-300 text-primary focus:ring-2 focus:ring-primary",
        className,
      )}
      {...props}
    />
  );

  if (!label) return input;
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-zinc-700">
      {input}
      {label}
    </label>
  );
}


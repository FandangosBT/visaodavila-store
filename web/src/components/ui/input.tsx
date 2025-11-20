import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const input = (
      <input
        id={id}
        ref={ref}
        className={cn(
          "w-full rounded-[var(--radius-md)] border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100",
          error && "border-red-400 focus:ring-red-400",
          className,
        )}
        {...props}
      />
    );

    if (!label) return input;
    return (
      <label className="block text-sm font-medium text-zinc-700">
        {label}
        <div className="mt-1">{input}</div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </label>
    );
  },
);
Input.displayName = "Input";


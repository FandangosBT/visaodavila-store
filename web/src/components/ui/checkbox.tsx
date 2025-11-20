import * as React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const input = (
    <input
      id={id}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-zinc-300 text-primary focus:ring-2 focus:ring-primary",
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


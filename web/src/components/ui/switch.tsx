"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Switch({ label, className, id, ...props }: SwitchProps) {
  const [checked, setChecked] = React.useState<boolean>(Boolean(props.defaultChecked));
  React.useEffect(() => {
    if (typeof props.checked === "boolean") setChecked(props.checked);
  }, [props.checked]);

  const input = (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => setChecked((c) => !c)}
      className={cn(
        "inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-zinc-300",
        className,
      )}
    >
      <span
        className={cn(
          "ml-0.5 inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );

  if (!label) return input;
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-zinc-700">
      {input}
      {label}
    </label>
  );
}


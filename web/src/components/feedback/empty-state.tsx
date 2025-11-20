import * as React from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "Nada por aqui",
  description = "Tente ajustar os filtros ou volte mais tarde.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-zinc-300 p-10 text-center",
        className,
      )}
    >
      <div className="heading-3">{title}</div>
      <p className="mt-2 text-body text-zinc-500">{description}</p>
      {actionLabel && (
        <Button className="mt-6" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}


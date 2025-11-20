"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div className={cn("absolute inset-x-0 top-16 mx-auto w-full max-w-lg p-4", className)}>
        <div className="rounded-[var(--radius-lg)] border border-zinc-200 bg-white shadow-xl">
          {title && (
            <div className="border-b px-4 py-3 text-sm font-semibold text-zinc-800">
              {title}
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}


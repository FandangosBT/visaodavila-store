"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type Side = "left" | "right";

interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  side?: Side;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, side = "right", title, children, className }: DrawerProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const closeRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();
  const prevFocus = React.useRef<HTMLElement | null>(null);
  const [ready, setReady] = React.useState(false);
  const reduced = React.useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    [],
  );
  const [mountNode, setMountNode] = React.useState<Element | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    const to = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
      }
    };
    document.addEventListener("keydown", onKey, true);
    setReady(true);
    return () => {
      window.clearTimeout(to);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey, true);
      prevFocus.current?.focus?.();
      setReady(false);
    };
  }, [open, onClose]);

  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.createElement("div");
    el.className = "drawer-portal";
    document.body.appendChild(el);
    setMountNode(el);
    return () => {
      document.body.removeChild(el);
      setMountNode(null);
    };
  }, []);

  if (!open || !mountNode) return null;
  const sideClasses = side === "right" ? "right-0" : "left-0";

  function trapTab(e: React.KeyboardEvent) {
    if (e.key !== "Tab") return;
    const root = panelRef.current;
    if (!root) return;
    const focusable = Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("aria-hidden"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !root.contains(active)) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (active === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  const transformClasses = [
    // Mobile bottom sheet animation (vertical only)
    ready ? "translate-y-0" : "translate-y-full",
    // On desktop, do not animate vertically
    "md:translate-y-0",
    // Desktop drawer animation (horizontal only)
    ready ? "md:translate-x-0" : side === "right" ? "md:translate-x-full" : "md:-translate-x-full",
  ].join(" ");

  const content = (
    <div className="fixed inset-0 z-[60]">
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          ready ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
        onClick={onClose}
        style={reduced ? ({ transitionDuration: "0ms" } as React.CSSProperties) : undefined}
      />
      <div
        ref={panelRef}
        className={cn(
          // Desktop (md+): lateral
          "absolute md:top-0 md:h-full md:w-[22rem] md:max-w-full md:border-l md:border-zinc-200 md:shadow-xl",
          sideClasses,
          // Mobile (sm-): bottom sheet
          "bottom-0 w-full rounded-t-[var(--radius-lg)] bg-white md:rounded-none",
          // Transitions
          "transition-transform duration-200 will-change-transform",
          transformClasses,
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onKeyDown={trapTab}
        style={reduced ? ({ transitionDuration: "0ms" } as React.CSSProperties) : undefined}
      >
        {title && (
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
            <div id={titleId} className="text-sm font-semibold text-zinc-800">
              {title}
            </div>
            <button
              ref={closeRef}
              aria-label="Fechar"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        )}
        <div className="flex h-[calc(100%-2.75rem)] flex-col">{/* header ~44px */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, mountNode);
}

"use client";
import * as React from "react";

export function Topbar() {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/settings")
      .then((r) => r.json())
      .then((s) => {
        const msg = s?.topbarMessage ?? s?.[0]?.topbarMessage;
        if (msg) setMessage(msg);
      })
      .catch(() => {});
  }, []);

  if (!message) return null;
  return (
    <div className="w-full bg-brand px-4 py-2 text-center text-sm text-white">
      {message}
    </div>
  );
}


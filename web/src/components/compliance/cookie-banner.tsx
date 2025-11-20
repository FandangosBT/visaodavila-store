"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const KEY = "consent:cookies";

export function CookieBanner() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    try {
      const val = localStorage.getItem(KEY);
      setShow(val !== "accepted");
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {}
    setShow(false);
  }

  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-4 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-center text-sm text-zinc-700 sm:text-left">
          Usamos cookies para melhorar sua experiência. Veja nossa{" "}
          <Link href="/politica-de-privacidade" className="text-primary underline">
            política de privacidade
          </Link>
          .
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShow(false)}>
            Agora não
          </Button>
          <Button onClick={accept}>Aceitar</Button>
        </div>
      </div>
    </div>
  );
}


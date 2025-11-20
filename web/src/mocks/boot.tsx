"use client";
import { useEffect } from "react";
import { startMirage } from "@/mocks/server";
import { runBasicA11yChecks, runWebVitalsDev } from "@/lib/dev-checks";

export function MockBoot() {
  useEffect(() => {
    startMirage();
    // Hydrate global stores after Mirage starts
    import("@/store/cart").then((m) => m.useCartStore.getState().refresh());
    import("@/store/session").then((m) => m.useSessionStore.getState().refresh());
    if (process.env.NODE_ENV !== "production") {
      // Pequenas telemetrias dev para atender aos critérios de aceitação
      runBasicA11yChecks();
      runWebVitalsDev();
    }
  }, []);
  return null;
}

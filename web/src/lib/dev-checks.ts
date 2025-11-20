export function runBasicA11yChecks() {
  try {
    const issues: string[] = [];
    // Images
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
    imgs.forEach((img) => {
      const alt = img.getAttribute("alt");
      if (alt === null || alt === "") issues.push("Imagem sem atributo alt");
    });

    // Buttons
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
    buttons.forEach((b) => {
      const label = (b.textContent || "").trim();
      const aria = b.getAttribute("aria-label");
      if (!label && !aria) issues.push("Botão sem nome acessível");
    });

    // Links
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
    links.forEach((a) => {
      const label = (a.textContent || "").trim();
      const aria = a.getAttribute("aria-label");
      if (!label && !aria) issues.push("Link sem nome acessível");
    });

    // Skip to content target
    if (!document.getElementById("conteudo")) issues.push("Falta alvo de pulo para conteúdo (#conteudo)");

    // Carousel region
    const carousel = document.querySelector('[aria-roledescription="carousel"]');
    if (!carousel) issues.push("Carousel sem aria-roledescription='carousel'");

    if (issues.length) {
      // Dev-only summary (simula um check do axe crítico mínimo)
      // eslint-disable-next-line no-console
      console.warn("A11y (básico) — problemas encontrados:", issues);
    } else {
      // eslint-disable-next-line no-console
      console.info("A11y (básico) — OK");
    }
  } catch {
    // ignore
  }
}

export function runWebVitalsDev() {
  try {
    let lcp = 0;
    let cls = 0;
    if ((window as any).PerformanceObserver) {
      const poLcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as any;
        if (last && typeof last.renderTime === "number") {
          lcp = last.renderTime || last.loadTime || last.startTime || 0;
        } else if (last) {
          lcp = last.startTime || 0;
        }
      });
      try { poLcp.observe({ type: "largest-contentful-paint", buffered: true } as any); } catch {}

      const poCls = new PerformanceObserver((list) => {
        for (const e of list.getEntries() as any) {
          if (!e.hadRecentInput) cls += e.value || 0;
        }
      });
      try { poCls.observe({ type: "layout-shift", buffered: true } as any); } catch {}

      const report = () => {
        // eslint-disable-next-line no-console
        console.info("Web Vitals (dev)", { LCP_ms: Math.round(lcp), CLS: Number(cls.toFixed(3)) });
      };
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") report();
      });
      setTimeout(report, 3500);
    }
  } catch {
    // ignore
  }
}


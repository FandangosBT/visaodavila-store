"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { getJSON } from "@/lib/api";

type Banner = { id: string; imageUrl: string; href?: string; title?: string; subtitle?: string };

export function HeroCarousel() {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [active, setActive] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const reduced = React.useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    [],
  );
  const touchStartX = React.useRef<number | null>(null);

  React.useEffect(() => {
    getJSON<Banner[]>("/banners").then(setBanners).catch(() => setBanners([]));
  }, []);

  React.useEffect(() => {
    if (hover || reduced) return;
    const id = window.setInterval(() => {
      setActive((i) => (banners.length ? (i + 1) % banners.length : 0));
    }, 4000);
    return () => window.clearInterval(id);
  }, [banners.length, hover, reduced]);

  if (!banners.length) return null;

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-lg)] bg-zinc-100 lg:aspect-[16/7]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setHover(true)}
      onBlurCapture={() => setHover(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setHover(true);
        if (e.key === "ArrowLeft") setActive((i) => (i - 1 + banners.length) % banners.length);
        if (e.key === "ArrowRight") setActive((i) => (i + 1) % banners.length);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        if (start == null) return;
        const dx = e.changedTouches[0]?.clientX - start;
        if (Math.abs(dx) > 40) {
          if (dx > 0) setActive((i) => (i - 1 + banners.length) % banners.length);
          else setActive((i) => (i + 1) % banners.length);
        }
        touchStartX.current = null;
      }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques da loja"
      aria-live="off"
      tabIndex={0}
   >
      {banners.map((b, i) => (
        <Slide key={b.id} banner={b} active={i === active} index={i} />
      ))}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2" role="tablist" aria-label="Indicadores do carousel">
        {banners.map((b, i) => (
          <button
            key={b.id || i}
            role="tab"
            aria-label={`Slide ${i + 1} de ${banners.length}${b.title ? ` — ${b.title}` : ""}`}
            aria-controls={`slide-${b.id || i}`}
            aria-current={i === active ? "true" : undefined}
            className={`h-2 w-2 rounded-full transition-colors ${i === active ? "bg-white" : "bg-white/60"}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
      <button
        aria-label="Anterior"
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        onClick={() => setActive((i) => (i - 1 + banners.length) % banners.length)}
      >
        ‹
      </button>
      <button
        aria-label="Próximo"
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
        onClick={() => setActive((i) => (i + 1) % banners.length)}
      >
        ›
      </button>
    </div>
  );
}

function Slide({ banner, active, index }: { banner: Banner; active: boolean; index: number }) {
  const content = (
    <div
      className="absolute inset-0 transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
      aria-hidden={!active}
      role="group"
      id={`slide-${banner.id || index}`}
    >
      <Image
        src={banner.imageUrl}
        alt={banner.title ?? "banner"}
        fill
        className="object-cover"
        sizes="100vw"
        priority={index === 0}
      />
      {(banner.title || banner.subtitle) && (
        <div className="absolute left-6 top-6 rounded bg-black/50 px-4 py-3 text-white">
          {banner.title && <div className="text-xl font-semibold">{banner.title}</div>}
          {banner.subtitle && <div className="mt-0.5 text-sm text-zinc-200">{banner.subtitle}</div>}
          <div className="mt-3">
            <Link
              href={banner.href || "/"}
              className="inline-flex items-center rounded-[var(--radius-md)] bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Ver ofertas
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return content;
}

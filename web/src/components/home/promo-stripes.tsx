export function PromoStripes() {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <a
        href="#"
        aria-label="Ver combos 2 por 207. Economize até 18% no combo"
        className="group flex items-center justify-between rounded-[var(--radius-lg)] bg-zinc-900 px-6 py-4 text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
      >
        <div className="flex items-center gap-4">
          {/* Ícone inline leve */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-8 w-8 shrink-0 text-white/90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M3 3h4l2 4h10l2.5 5H7.5" />
            <circle cx="9" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
          </svg>
          <div>
            <div className="text-sm uppercase tracking-wide text-zinc-300">Combo especial</div>
            <div className="text-2xl font-semibold leading-tight">2 por R$ 207</div>
            <div className="text-xs text-zinc-200/90">Economize até 18% no combo</div>
          </div>
        </div>
        <span className="text-sm underline-offset-4 group-hover:underline">Ver ofertas →</span>
      </a>
      <a
        href="#"
        aria-label="Ver combos 2 por 255. Economize até 12% no combo"
        className="group flex items-center justify-between rounded-[var(--radius-lg)] bg-primary px-6 py-4 text-white transition-colors hover:bg-sky-600 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <div className="flex items-center gap-4">
          {/* Selo/estrela inline para destaque */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-8 w-8 shrink-0 text-white/90"
            fill="currentColor"
          >
            <path d="M12 2 9.19 8.63 2 9.27l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-6.99L22 9.27l-7.19-.64L12 2z" />
          </svg>
          <div>
            <div className="text-sm uppercase tracking-wide text-sky-100">Combo especial</div>
            <div className="text-2xl font-semibold leading-tight">2 por R$ 255</div>
            <div className="text-xs text-sky-50/90">Economize até 12% no combo</div>
          </div>
        </div>
        <span className="text-sm underline-offset-4 group-hover:underline">Ver ofertas →</span>
      </a>
    </div>
  );
}

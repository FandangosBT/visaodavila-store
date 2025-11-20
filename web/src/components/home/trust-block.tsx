export function TrustBlock() {
  return (
    <section className="mt-12 rounded-[var(--radius-lg)] border border-zinc-200 p-6">
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-zinc-800">Pagamento seguro</div>
          <p className="text-sm text-zinc-600">Cartão, Pix e Boleto</p>
          <div className="mt-2 flex items-center gap-2 text-zinc-500">
            <span className="rounded bg-zinc-100 px-2 py-1 text-xs">PIX</span>
            <span className="rounded bg-zinc-100 px-2 py-1 text-xs">VISA</span>
            <span className="rounded bg-zinc-100 px-2 py-1 text-xs">MASTERCARD</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-800">Entrega rápida</div>
          <p className="text-sm text-zinc-600">Envio para todo o Brasil</p>
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-800">Compra garantida</div>
          <p className="text-sm text-zinc-600">Ambiente seguro com criptografia</p>
        </div>
      </div>
    </section>
  );
}


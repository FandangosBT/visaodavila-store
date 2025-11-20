"use client";
import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";

function SvgPix() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 7 12 2l5 5-5 5-5-5zm0 10 5 5 5-5-5-5-5 5z" />
    </svg>
  );
}
function SvgVisa() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path fill="#fff" d="M6 14h2l.6-4H6zm10.8-2.8c-.5-.2-1-.4-1.1-.6-.1-.1-.1-.3.2-.3.4-.1 1.1 0 1.6.2l.2-1.3c-.4-.1-1-.2-1.6-.2-1.7 0-2.9.9-2.9 2.1 0 .9.9 1.4 1.6 1.7.7.3.9.5.9.7 0 .4-.5.6-1 .6-.7 0-1.2-.1-1.8-.4l-.2 1.3c.5.2 1.1.3 1.9.3 1.8 0 3-1 3-2.2-.1-1-.8-1.5-1.7-1.9z" />
    </svg>
  );
}
function SvgMaster() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" opacity=".5" />
    </svg>
  );
}
function SvgBoleto() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M7 8v8M10 8v8M13 8v8M16 8v8" />
    </svg>
  );
}

export function Footer() {
  const router = useRouter();
  const prefetch = React.useCallback((href: string) => router.prefetch?.(href), [router]);
  const toTop = React.useCallback(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50 py-10 text-sm text-zinc-600">
      <Container>
        {/* Mobile (accordions) */}
        <div className="sm:hidden space-y-3">
          <div>
            <div className="text-base font-semibold text-zinc-800">Visão da Vila</div>
            <p className="mt-2">Moda e estilo com preços especiais.</p>
          </div>
          <details className="rounded-[var(--radius-md)] border border-zinc-200 bg-white/40">
            <summary className="cursor-pointer px-4 font-medium text-zinc-800 inline-flex items-center justify-between min-h-[44px]">Institucional</summary>
            <nav aria-label="Institucional">
              <ul className="space-y-1 px-4 pb-3">
                <li><Link className="link-underline" href="/sobre" onMouseEnter={() => prefetch('/sobre')} onFocus={() => prefetch('/sobre')}>Sobre nós</Link></li>
                <li><Link className="link-underline" href="/trocas-e-devolucoes" onMouseEnter={() => prefetch('/trocas-e-devolucoes')} onFocus={() => prefetch('/trocas-e-devolucoes')}>Política de Troca</Link></li>
                <li><Link className="link-underline" href="/frete-e-prazos" onMouseEnter={() => prefetch('/frete-e-prazos')} onFocus={() => prefetch('/frete-e-prazos')}>Frete e Prazos</Link></li>
                <li><Link className="link-underline" href="/politica-de-privacidade" onMouseEnter={() => prefetch('/politica-de-privacidade')} onFocus={() => prefetch('/politica-de-privacidade')}>Privacidade</Link></li>
              </ul>
            </nav>
          </details>
          <details className="rounded-[var(--radius-md)] border border-zinc-200 bg-white/40">
            <summary className="cursor-pointer px-4 font-medium text-zinc-800 inline-flex items-center justify-between min-h-[44px]">Atendimento</summary>
            <nav aria-label="Atendimento">
              <ul className="space-y-1 px-4 pb-3">
                <li><Link className="link-underline" href="#">Contato</Link></li>
                <li><Link className="link-underline" href="#">WhatsApp</Link></li>
                <li><Link className="link-underline" href="#">Ajuda</Link></li>
              </ul>
            </nav>
          </details>
          <details className="rounded-[var(--radius-md)] border border-zinc-200 bg-white/40">
            <summary className="cursor-pointer px-4 font-medium text-zinc-800 inline-flex items-center justify-between min-h-[44px]">Pagamentos</summary>
            <nav aria-label="Pagamentos">
              <ul className="px-4 pb-3 mt-2 flex flex-wrap items-center gap-3">
                <li className="text-zinc-700" aria-label="PIX">
                  <SvgPix />
                  <span className="sr-only">PIX</span>
                </li>
                <li className="text-zinc-700" aria-label="VISA">
                  <SvgVisa />
                  <span className="sr-only">VISA</span>
                </li>
                <li className="text-zinc-700" aria-label="MASTERCARD">
                  <SvgMaster />
                  <span className="sr-only">MASTERCARD</span>
                </li>
                <li className="text-zinc-700" aria-label="BOLETO">
                  <SvgBoleto />
                  <span className="sr-only">BOLETO</span>
                </li>
              </ul>
            </nav>
          </details>
        </div>

        {/* Desktop (grid) */}
        <div className="hidden gap-8 sm:grid sm:grid-cols-4">
          <div>
            <h3 className="heading-3 text-zinc-800">Visão da Vila</h3>
            <p className="mt-2">Moda e estilo com preços especiais.</p>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://instagram.com/visaodavila"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="icon-link text-zinc-700 hover:text-zinc-900 p-2 -m-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@visaodavila"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="icon-link text-zinc-700 hover:text-zinc-900 p-2 -m-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M14 3c.6 2.4 2.1 3.9 4.5 4.5V11c-1.9 0-3.5-.6-4.5-1.6V15a5 5 0 1 1-5-5c.7 0 1.3.1 2 .4V13a3 3 0 1 0 3 3V3h0z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@visaodavila"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="icon-link text-zinc-700 hover:text-zinc-900 p-2 -m-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C18 4.7 12 4.7 12 4.7s-6 0-7.5.4A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.5.4 7.5.4 7.5.4s6 0 7.5-.4a3 3 0 0 0 2.1-2.1c.3-1.5.4-3.2.4-4.8 0-1.6-.1-3.3-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>
            </div>
          </div>
          <nav aria-label="Institucional">
            <h3 className="heading-3 text-zinc-800">Institucional</h3>
            <ul className="mt-2 space-y-1">
              <li><Link className="link-underline" href="/sobre" onMouseEnter={() => prefetch('/sobre')} onFocus={() => prefetch('/sobre')}>Sobre nós</Link></li>
              <li><Link className="link-underline" href="/trocas-e-devolucoes" onMouseEnter={() => prefetch('/trocas-e-devolucoes')} onFocus={() => prefetch('/trocas-e-devolucoes')}>Política de Troca</Link></li>
              <li><Link className="link-underline" href="/frete-e-prazos" onMouseEnter={() => prefetch('/frete-e-prazos')} onFocus={() => prefetch('/frete-e-prazos')}>Frete e Prazos</Link></li>
              <li><Link className="link-underline" href="/politica-de-privacidade" onMouseEnter={() => prefetch('/politica-de-privacidade')} onFocus={() => prefetch('/politica-de-privacidade')}>Privacidade</Link></li>
            </ul>
          </nav>
          <nav aria-label="Atendimento">
            <h3 className="heading-3 text-zinc-800">Atendimento</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <a className="link-underline" href="mailto:contato@visaodavila.store" aria-label="Enviar e-mail para contato@visaodavila.store">Contato</a>
              </li>
              <li>
                <a className="link-underline" href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp">WhatsApp</a>
              </li>
              <li><Link className="link-underline" href="#">Ajuda</Link></li>
              <li>
                <a className="link-underline" href="tel:+5511999999999" aria-label="Ligar para telefone de atendimento">Telefone</a>
              </li>
            </ul>
            <p className="mt-2 text-xs text-zinc-500">Seg–Sex, 9h–18h • São Paulo/SP</p>
          </nav>
          <nav aria-label="Pagamentos">
            <h3 className="heading-3 text-zinc-800">Pagamentos</h3>
            <ul className="mt-2 flex flex-wrap items-center gap-3">
              <li className="text-zinc-700" aria-label="PIX">
                <SvgPix />
                <span className="sr-only">PIX</span>
              </li>
              <li className="text-zinc-700" aria-label="VISA">
                <SvgVisa />
                <span className="sr-only">VISA</span>
              </li>
              <li className="text-zinc-700" aria-label="MASTERCARD">
                <SvgMaster />
                <span className="sr-only">MASTERCARD</span>
              </li>
              <li className="text-zinc-700" aria-label="BOLETO">
                <SvgBoleto />
                <span className="sr-only">BOLETO</span>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div>© {new Date().getFullYear()} Visão da Vila. Todos os direitos reservados.</div>
            <div className="mt-1">CNPJ 12.345.678/0001-99 • IE: Isento • Emitimos NF-e</div>
          </div>
          <button
            type="button"
            onClick={toTop}
            className="link-underline text-zinc-800 hover:text-zinc-900"
            aria-label="Voltar ao topo"
          >
            Voltar ao topo ↑
          </button>
        </div>
        {/* JSON-LD Organization (SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Visão da Vila Store",
                url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                sameAs: [
                  "https://instagram.com/visaodavila",
                  "https://www.tiktok.com/@visaodavila",
                  "https://youtube.com/@visaodavila",
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+55-11-99999-9999",
                    contactType: "customer service",
                    areaServed: "BR",
                    availableLanguage: ["Portuguese"],
                  },
                ],
              },
              null,
              0,
            ),
          }}
        />
      </Container>
    </footer>
  );
}

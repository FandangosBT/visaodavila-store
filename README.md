# Visão da Vila Store — Mockup

Mockup de e‑commerce (frontend) inspirado em https://www.xandaooutlet.com.br/.

- Stack: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Mocks: MirageJS + seeds faker
- Estados: Zustand (UI, carrinho, sessão, preferências)
- Testes: Vitest + Testing Library

## Início rápido

```
# instalar deps
cd web
npm install

# desenvolvimento
npm run dev

# build produção + start
npm run build
npm start

# preview (build+start)
npm run preview

# testes
npm run test

# typecheck
npm run typecheck
```

## Estrutura

- `web/src/app` — rotas (home, categoria, produto, carrinho, checkout, conta, admin)
- `web/src/mocks` — MirageJS (servidor mock + seeds)
- `web/src/components` — componentes UI e páginas
- `web/src/store` — zustand stores
- `web/src/lib` — utilitários (formatação, máscaras, api)
- `docs/` — documentação auxiliar

## Notas

- Todas as integrações são mockadas (sem pagamentos reais, frete real, etc.).
- JSON‑LD básico para Product e Breadcrumb; sitemap e robots gerados.
- Acessibilidade: foco visível, navegação por teclado e aria/roles nos principais componentes.

## Próximos passos (sugestão)

Veja `docs/roadmap.md` para integrações reais e melhorias.


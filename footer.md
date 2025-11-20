# Checklist — Footer (Diagnóstico e Melhorias)

Rastreamento baseado na validação em http://localhost:3000 (MCP Playwright) e nas diretrizes do Awwards.md (Design, UX, Conteúdo, Criatividade, Performance, Acessibilidade).

## 1) Diagnóstico (Playwright)
- [x] Footer encontrado via `footer` (role implícito `contentinfo`).
- [x] Colunas observadas: marca/descrição; Institucional; Atendimento; Pagamentos; copyright.
- [x] Links totais: ~7 (Sobre, Trocas, Frete, Privacidade, Contato, WhatsApp, Ajuda).
- [x] Meios de pagamento exibidos como texto: PIX, VISA, MASTER, BOLETO (sem ícones Inline/SVG dedicados).
- [x] Headings semânticos ausentes (títulos de coluna não são `h3`).
- [x] Links “Contato/WhatsApp” estão como `#` (placeholder).
- [x] Estados de foco/hover específicos do footer não padronizados (não usa `.link-underline`; foco global ok).
- [x] Social links ausentes (Instagram/TikTok/YouTube) e microcopy de atendimento reduzido.
- [x] Mobile: stacking em 1 coluna (< sm) OK; sem accordion; ordem de leitura condizente com DOM.

## 2) Plano de Melhoria — Awwwards
### Design & Hierarquia
- [x] Promover títulos das colunas para `h3` com tipografia utilitária (`.heading-3`) e espaçamento consistente (desktop).
- [x] Sub-superfície discreta (bg-zinc-50 + border-zinc-200) aplicada ao container do footer.
- [x] Aplicar `.link-underline` a links do footer, com opacidade/timing suaves (respeita `prefers-reduced-motion`).

### UX & Navegação
- [x] Estruturar cada coluna como `nav` com `aria-label` (Institucional, Atendimento, Pagamentos) no desktop.
- [x] Adicionar botão “Voltar ao topo” com foco acessível e `aria-label` (scroll suave com fallback para reduced-motion).
- [x] Mobile: colunas em accordions via `<details>`/`<summary>` (teclável, sem JS; desktop mantém grid).

### Conteúdo & Confiança
- [x] Completar “Contato” com `mailto:` e telefone clicável (`tel:`), horários e cidade/UF.
- [x] Adicionar links para redes sociais (Instagram, TikTok, YouTube) com ícones SVG e `aria-label`.
- [x] Adicionar CNPJ/Inscrição Estadual e política fiscal/nota (mock) para credibilidade.

### Criatividade & Microinterações
- [x] Sutileza no hover dos ícones (leve scale/opacity) e nas listas (sub-linha animada).
- [x] “Voltar ao topo” com easing suave e `scroll-behavior`/`prefers-reduced-motion`.

### Acessibilidade (WCAG 2.1 AA)
- [x] Garantir nomes acessíveis em todos os links e ícones sociais (usar `aria-label`).
- [x] Listas de pagamento como `ul > li` + ícones SVG com `aria-hidden` e rótulo textual (sr-only).
- [x] Foco visível consistente e ordem de tabulação previsível (utilitário global + estrutura de navegação).

### Performance
- [x] Ícones de pagamento e sociais como SVG inline (sem requests externos).
- [x] Prefetch leve em links institucionais no hover/focus (router.prefetch em hover/focus).
- [x] Evitar imagens pesadas; usar apenas vetores no footer.

### SEO & Dados Estruturados
- [x] Adicionar JSON-LD `Organization` com `name`, `url`, `sameAs` (redes sociais) e `contactPoint` (mock).
- [x] Manter links para políticas indexáveis (Trocas, Frete, Privacidade).

### Responsividade
- [x] Grid: 1 col (xs), 2 col (sm), 3–4 col (lg) com espaçamento claro.
- [x] Tap targets ≥ 44px e `:focus-visible` robusto em mobile (summary com `min-h-[44px]`, ícones com padding `p-2`).

## 3) Critérios de Aceitação (Footer)
- [x] A11y: Sem erros críticos; navegação por teclado total; headings e nav com `aria-label` corretos.
- [x] UX: Links claros com microinterações sutis; botão “Voltar ao topo”.
- [x] Conteúdo: Contatos reais (mailto/tel), redes sociais e legal (CNPJ mock).
- [x] Performance: Apenas SVG inline; sem requests adicionais.
- [x] SEO: JSON-LD `Organization` válido e páginas institucionais acessíveis.

## 4) Validação (Playwright)
- [x] Verificar presença de `footer` e colunas/títulos `h3`.
- [x] Contar links > 10 e existência de `mailto:`/`tel:`.
- [x] Confirmar `nav[aria-label="Institucional|Atendimento|Pagamentos"]`.
- [x] Confirmar botão “Voltar ao topo” e comportamento (scroll ao topo).
- [x] Validar presença de JSON-LD `Organization` no DOM.

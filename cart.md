# Checklist — Mini‑cart (Diagnóstico e Melhorias)

Rastreamento para evoluir o modal/drawer do carrinho segundo Awwwards.md (Design, UX, Conteúdo, Criatividade, Performance, Acessibilidade) e achados via MCP Playwright.

## 1) Diagnóstico (Playwright)
- [x] Abre via botão “Carrinho” no header.
- [x] role="dialog" e `aria-modal="true"` presentes no Drawer.
- [x] Focus trap (Tab/Shift+Tab) implementado; foco fica dentro do drawer.
- [x] Escape fecha o dialog e restaura foco no trigger.
- [x] Botão de fechar (X) adicionado ao cabeçalho do drawer.
- [x] Footer de ações sticky; CTAs permanecem visíveis.
- [x] Stepper ≥ 44px com `aria-label` contextual.
- [x] “Remover” com `aria-label` + Undo (~3s).
- [x] Item mostra preço unitário/"economia" e benefício de frete grátis (barra).

## 2) Objetivo
- Elevar o mini‑cart com acessibilidade AA, foco/teclado robustos, hierarquia e feedback claros, microinterações leves e performance sem regressões.

## 3) Plano de Melhoria — Awwwards
### Drawer (acessibilidade/estrutura)
- [x] Adicionar `aria-labelledby` e conectar ao título do drawer.
- [x] Incluir botão “Fechar” (X) focável no cabeçalho; fechar com Escape.
- [x] Implementar focus trap dentro do drawer e restaurar foco no trigger ao fechar.
- [x] Bloquear scroll do body; overlay com fade.
- [x] Responsividade: sm → bottom sheet (rounded + safe-area); md+ → ~22rem lateral.

### Lista de Itens
- [x] Card com thumb, nome (truncate), variações, preço unitário, economia (quando sale) e total.
- [x] Stepper ≥ 44px com ícones “−/＋” e `aria-label` contextual (aumentar/diminuir de {produto}).
- [x] Ação “Remover” como ícone com `aria-label` + Undo (~3s) inline.
- [x] Estado de carregamento por item (opacity) durante updates; debounce para updateQty (350ms) com atualização otimista.

### Resumo (sticky footer)
- [x] Subtotal e barra “Faltam R$ X para frete grátis” (regra mock, ex.: R$199).
- [x] CTAs sticky: “Ver carrinho” (outline) e “Finalizar compra” (primário).
- [x] Link “Continuar comprando” que fecha o drawer.

### Estado Vazio
- [x] Mensagem com CTA “Ver novidades” / “Explorar coleções”.

## 4) Microinterações & Motion
- [x] Drawer: slide‑in + overlay fade (200ms) com respeito a `prefers-reduced-motion`.
- [x] Stepper: feedback de clique (active:scale-95) e rótulo “Atualizando…” + aria-live.
- [x] Undo de remoção: barra de tempo decrescente (~3s).

## 5) Acessibilidade (WCAG 2.1 AA)
- [x] Focus trap + Escape; `aria-labelledby` conectado ao título; `aria-live` para updates.
- [x] Botões com nomes acessíveis e alvos ≥ 44px (stepper h-11 w-11).
- [x] Leitura consistente por teclado; ordem de tabulação previsível (header → lista → footer sticky).

## 6) Performance
- [x] Atualização otimista (quantidade e remoção) + reconciliação; evita re‑fetch completo.
- [x] Next/Image com contêiner dimensionado (h-16 w-16) evita CLS.
- [x] Debounce/batching de alterações de quantidade (350ms).

## 7) Critérios de Aceitação
- [x] A11y: Escape fecha; foco inicial no X/título; foco preso dentro do drawer; labels adequados.
- [x] UX: Stepper confortável; Undo de remoção; CTAs visíveis (footer sticky); mensagem de frete grátis.
- [x] Conteúdo: preço unitário, total e economia quando houver sale.
- [x] Performance: sem saltos de layout; sem requisições redundantes em cascata.
- [x] Responsividade: uso confortável no mobile; safe‑areas; tap targets ≥ 44px.

## 8) Validação (Playwright)
- [x] Abrir drawer, verificar `role="dialog"`, `aria-labelledby`, foco no botão fechar.
- [x] Testar Tab/Shift+Tab (focus trap) e remoção com Undo (banner/Desfazer visíveis).
- [x] Botões de quantidade com `aria-label` contextual; tamanho ≥ 44px.
- [x] Footer sticky com subtotal, “faltam R$ X…”, CTAs e link “Continuar comprando”.

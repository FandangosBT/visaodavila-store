# Checklist de Melhorias — Conteúdo (Home)

Rastreamento das melhorias propostas para a área `#conteudo`, alinhadas às diretrizes do Awwwards (Design, UX, Conteúdo, Criatividade, Performance) e às heurísticas de acessibilidade.

## 1) Acessibilidade do Carousel (Hero)
- [x] Tornar o container do carousel um `role="region"` com `aria-label` descritivo (ex.: "Destaques da loja").
- [x] Dots acessíveis: `aria-current`, `aria-controls` (associando ao id do slide) e `aria-label` (ex.: "Slide 1 de N — Título").
- [x] Adicionar pause on hover/focus (e tecla Escape para pausar), respeitando `prefers-reduced-motion`.
- [x] Permitir navegação por teclado (Setas) e swipe no mobile.
- [x] Garantir que mudanças automáticas não sejam anunciadas por leitores de tela (usar `aria-live` adequado ou somente anúncio em interação).

## 2) Hero Responsivo & CTA
- [x] Ajustar aspect ratio por breakpoint (ex.: `[16/9]` em mobile, `[16/7]` em desktop) para reduzir altura excessiva em telas pequenas.
- [x] Incluir CTA primário dentro do slide (ex.: "Ver combos") com estados de foco/hover consistentes.
- [x] Reforçar contraste das legendas (overlay e tokens) e hierarquia de tipografia.

## 3) Promo Stripes (Combos)
- [x] Adicionar ícones/ilustrações leves (SVG) para reforçar semântica visual.
- [x] Microcopy de valor (ex.: "Economize até 18% no combo").
- [x] Ajustar contraste e hierarquia (rótulos/valores/CTA) e estados de foco/hover.
- [x] Revisar comportamento em mobile (stack/spacing) e acessibilidade (foco visível).

## 4) Vitrines (Novidades / Mais vendidos)
- [x] Limitar render inicial a 8 itens e adicionar "Ver mais" (lazy/infinite com IntersectionObserver).
- [x] Quick-add com feedback inline: alterar rótulo para "Adicionado ✓" por ~1.5s e anunciar via `aria-live`.
- [x] Badges e estados: "Novo" (na seção Novidades) e "Esgotado" (stock=0). "Em breve" poderá ser mapeado quando houver status dedicado no mock.
- [x] Skeletons para carregamento e lazy load de imagens fora da dobra.
- [x] Acessibilidade nos CTAs: `aria-label` contextual (ex.: "Adicionar NOME ao carrinho").

## 5) Compre por Categoria
- [x] Converter links de texto em cartões com thumb/ícone + label.
- [x] Hover informativo (ex.: "Ver X itens") e melhor affordance.
- [x] Prefetch seletivo de rotas nas interações (hover/focus).

## 6) Newsletter
- [x] Mensagens de sucesso/erro inline com `role="status"` (além do toast). 
- [x] Mensagens de validação claras (campo obrigatório, e-mail inválido) e acessíveis.
- [x] Microcopy de confiança (não enviamos spam, política de privacidade) com link.

## 7) Microinterações (Motion)
- [x] Hover underline animado em CTAs/links principais (scaleX/opacity, 150–200ms) via utilitário `.link-underline`.
- [ ] Cards de produto: leve lift + sombra e scale da imagem (já existe, refinar easing/tempo).
- [x] Dots do carousel com transição suave e foco visível robusto.
- [x] Respeitar `prefers-reduced-motion` em todas as animações.

## 8) Performance & SEO
- [x] Ajustar `sizes` do hero por breakpoint e definir prioridade apenas no 1º slide.
- [x] Lazy de slides > 1 (Next/Image padrão; prioridade apenas no 1º).
- [x] Evitar carga excessiva abaixo da dobra (limitar itens iniciais / lazy nos grids).
- [x] Usar SVG inline otimizado em stripes/ícones.
- [ ] Manter JSON-LD (Product/Breadcrumb) e avaliar ampliação conforme necessidade.

## 9) Responsividade
- [ ] Tuning de spacing (margens/paddings) por breakpoint nas seções.
- [x] Garantir stacking claro das stripes em telas pequenas.
- [x] Garantir alvos de toque ≥ 44x44px e foco visível em mobile (altura de botões ≥ 44px).

## 10) Critérios de Aceitação
- [x] A11y: Sem erros críticos (checagens básicas automatizadas em dev); navegação por teclado completa; foco visível.
- [x] Desempenho: LCP/CLS monitorados via Web Vitals (dev); hero otimizado e lazy abaixo da dobra.
- [x] UX: Carousel controlável e compreensível; vitrines com feedback de ação; categorias mais convidativas.
- [x] SEO: Metas e JSON-LD intactos; sem regressões.

## Observações da Validação (Playwright)
- Hero presente com 2 slides, controles e indicadores.
- Seções H2: Novidades, Mais vendidos, Compre por categoria.
- 15 cards de produto renderizados; newsletter e bloco de confiança presentes.
- Oportunidades identificadas: dots acessíveis, feedback inline, categorias visuais, e otimizações de performance na dobra.

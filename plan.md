# Plano de Ação — Mockup Loja Virtual (frontend + dados mockados)

Objetivo: construir um mockup completo de e-commerce inspirado no estilo/estrutura da referência (https://www.xandaooutlet.com.br/), contendo Home (vitrine), Área do Cliente e Painel Admin. Somente frontend, com dados e APIs simuladas (mock).

Observações:
- Escopo: frontend apenas, sem integrações reais de pagamento/entrega; tudo mockado.
- Linguagem/UI sugerida: React + Next.js + TypeScript + Tailwind CSS (ou equivalente) para agilidade; pode ser ajustado conforme preferência.
- Dados/serviços: MSW (Mock Service Worker) ou MirageJS, e/ou JSON local para simular APIs.
- Foco em: performance, acessibilidade, SEO básico e fidelidade visual/UX às melhores partes da referência.

---

## 0) Descoberta e Mapeamento de Referência
- [x] Listar os principais elementos da Home de referência (topbar, header, menu, busca, banners/hero com carrossel, faixas promocionais, coleções, grid de produtos, newsletter, rodapé com selos e políticas).
- [x] Mapear padrões de UI/UX: tipografia, cores, espaçamentos, badges de desconto, vitrines por categoria, "2 por R$..." e selos de confiança.
- [x] Identificar microinterações: hover em cards, quick-view/quick-add, carrosséis, skeletons de carregamento.
- [x] Listar páginas/fluxos complementares: PDP (produto), lista de produtos/categoria, carrinho, checkout simplificado (mock), conta do cliente, painel admin.

## 1) Setup do Projeto
- [x] Criar app com Next.js + TypeScript.
- [x] Configurar Tailwind CSS (ou outra lib CSS) e variáveis de tema (cores, tipografia, espaçamentos).
- [x] Adicionar ESLint + Prettier e scripts de formatação/lint.
- [x] Configurar aliases de paths e estrutura de pastas (app/ ou pages/, components/, lib/, mocks/, data/ etc.).
- [x] Adicionar configuração de imagens responsivas (Next/Image) e fontes (Google Fonts).

## 2) Design System e Fundações
- [x] Definir tokens (cores, fontes, radius, sombras) alinhados ao estilo da referência.
- [x] Criar componentes base: Button, Input, Select, Checkbox, Radio, Switch, Badge, Tag, Tooltip, Modal, Drawer, Toast.
- [x] Tipografia: estilos para títulos, subtítulos, parágrafos, preço, etiqueta de desconto.
- [x] Grid e containers responsivos; breakpoints mobile-first.
- [x] Estados de carregamento (Skeleton) e vazios (Empty States) padronizados.

## 3) Mocks e Simulação de APIs
- [x] Escolher estratégia: MirageJS (intercepta fetch no browser), com inicialização no cliente.
- [x] Criar schemas mock: produtos, categorias, coleções, banners, usuários, pedidos (localStorage), configurações da loja.
- [x] Popular dados iniciais (faker/seed): tamanhos, cores, estoque, preço, promocional, rating, imagens.
- [x] Endpoints simulados: `/products`, `/products/:id`, `/categories`, `/collections`, `/cart`, `/orders`, `/users`, `/auth`, `/banners`, `/settings`.
- [x] Persistência no navegador (localStorage) para carrinho e sessão; pedidos por usuário em localStorage.

## 4) Header, Navegação e Busca
- [x] Topbar de anúncio/promoção (ex.: frete, cupom, combos "2 por R$...").
- [x] Header com logo, busca, ícones (conta, wishlist, carrinho) e indicador de itens no carrinho.
- [x] Menu de navegação (mega-menu ou dropdowns) com categorias e coleções em destaque.
- [x] Busca com autocomplete (mock): sugestões de produtos/categorias.
- [x] Acessibilidade: navegação por teclado e aria-labels.

## 5) Home (Vitrine)
- [x] Hero principal com carrossel de banners (desktop/mobile), CTA e indicadores.
- [x] Faixas promocionais (ex.: "2 por R$207", "2 por R$255").
- [x] Seções destacadas: "Novidades", "Mais vendidos", "Coleções", "Compre por categoria" (com carrosséis ou grids).
- [x] Cards de produto: imagem, nome, preço cheio e promocional, parcelas simuladas, badge de desconto, variações (cores/tamanhos) e quick-add ao carrinho.
- [x] Bloco de confiança: selos de pagamento, segurança, depoimentos/ratings.
- [x] Newsletter (mock) com validação e feedback.
- [x] Rodapé: links institucionais, políticas, contatos, redes sociais, ícones de pagamento e selo de segurança (visuais).

## 6) Lista de Produtos (Categoria/Busca)
- [x] Página de listagem com título, breadcrumbs, contagem de resultados.
- [x] Filtros (mock): categoria, preço, tamanho, cor, ordenação (preço, novidades, relevância).
- [x] Paginação ou infinite scroll.
- [x] Preservação de estado via query string (filtros/ordenação).
- [x] Empty state e skeletons.

## 7) Página de Produto (PDP)
- [x] Galeria com carrossel/zoom e thumbs; imagens responsivas.
- [x] Preço, promo, parcelas mock, variações (tamanho/cor) com disponibilidade.
- [x] CTA: adicionar ao carrinho; feedback de sucesso/erro.
- [x] Cálculo de frete (mock) por CEP com prazos e valores simulados.
- [x] Detalhes: descrição, tabela de medidas, composição, cuidados.
- [x] Avaliações (mock) com média e lista; formulário (mock) de avaliação.
- [x] Produtos relacionados (carrossel).

## 8) Carrinho e Checkout (Mock)
- [x] Drawer de carrinho (mini-cart) e página de carrinho completa.
- [x] Itens com variações, quantidade, remover, subtotal.
- [x] Aplicar cupom (mock) e cálculo de frete (mock) no carrinho.
- [x] Checkout em etapas (mock): identificação, endereço, entrega, pagamento, revisão.
- [x] Métodos de pagamento visuais (simbolizar PIX/cartão/boleto) — apenas UI.
- [x] Resumo do pedido e confirmação (mock) com número de pedido gerado.

## 9) Área do Cliente (Mock)
- [x] Autenticação mock (login, cadastro, recuperação de senha — apenas UX/fluxo).
- [x] Dashboard do cliente com saudações e últimos pedidos (mock).
- [x] Perfil: dados pessoais, preferências.
- [x] Endereços: CRUD mock com validação.
- [x] Pedidos: listagem, detalhes, status e tracking (mock), opção de troca/devolução (mock).

## 10) Painel Admin (Mock)
- [x] Login admin (mock) com role básica.
- [x] Dashboard: KPIs (faturamento, pedidos, ticket médio; todos mock) e gráficos simples.
- [x] Produtos: listagem, busca, filtros e CRUD mock (nome, preço, promo, estoque, imagens, variações, associações a categorias/coleções).
- [x] Categorias/Coleções: CRUD mock e ordenação.
- [x] Pedidos: listagem, detalhes, mudança de status (mock), exportação CSV (mock).
- [x] Clientes: listagem e detalhes (mock).
- [x] Conteúdo/Banners: gerenciador de hero/slots promocionais (upload simulado; usar urls locais/mockadas).
- [x] Configurações da loja: tema (cores, logo, tipografia), políticas, mensagens de topbar.

## 11) Estados, Armazenamento e Utilidades
- [x] Gerenciar estado global (Zustand) para carrinho, sessão mock, preferências e UI (drawers/modals).
- [x] Persistir carrinho/sessão em localStorage; hidratação no primeiro load (via Mirage + boot e stores refresh).
- [x] Helpers: formatação de preço (BRL), parcelas, máscaras (CEP, CPF), datas (pt-BR).
- [ ] Internacionalização básica pt-BR (i18n ready) e metadados SEO por página.

## 12) Acessibilidade, Performance e SEO
- [x] Semântica HTML e aria-attributes; navegação por teclado, foco visível (skip-link, focus-visible, roles nos componentes).
- [x] Contraste de cores adequado; testes rápidos (base de cores e foco visível preparados).
- [x] Imagens otimizadas com Next/Image (lazy por padrão) e prefetch de rotas críticas.
- [x] Code splitting pontual para evitar hidratação desnecessária onde possível.
- [x] Metatags Open Graph/Twitter e JSON-LD para Product e BreadcrumbList (mock URLs).
- [x] Sitemap estático (mock) e robots.txt.

## 13) Testes e Qualidade
- [x] Testes unitários (helpers/cart/utils e ProductCard render). Vitest + RTL + jsdom.
- [x] Teste de integração leve (interação de add-to-cart no ProductCard com fetch mock).
- [ ] Smoke tests e2e (opcional) cobrindo Home → PDP → Carrinho → Checkout (mock).
- [x] Checagem de tipos TypeScript e lint no CI local (scripts typecheck/test).

## 14) Conteúdo, Ajustes Finais e Documentação
- [x] Revisar textos em pt-BR, rótulos, placeholders e mensagens de erro.
- [x] Polir microinterações e animações (carrosséis, hover, feedbacks).
- [x] Adicionar aviso de cookies/privacidade (mock) e link para políticas.
- [x] Página(s) institucional(is): Sobre, Trocas e Devoluções, Frete e Prazos (conteúdo mock).
- [x] README com instruções de uso, scripts e estrutura.

## 15) Entrega e Próximos Passos
- [x] Script de build/preview estático e/ou execução local.
- [x] Checklist final de acessibilidade e SEO.
- [x] Mapa de evolução para integrações reais (pagamentos, frete, estoque) — fora do escopo atual.

---

### Estrutura Sugerida de Pastas

```
root/
  app/ (ou pages/)
    (rotas: /, /categoria/[slug], /produto/[slug], /carrinho, /checkout, /conta/*, /admin/*)
  components/
  features/ (home, catalog, product, cart, checkout, account, admin)
  data/ (json estáticos para seed)
  mocks/ (MSW/Mirage, handlers, seeds)
  lib/ (utils: formatPrice, storage, analytics mock, i18n)
  styles/ (globals, tailwind)
  public/ (imagens mock)
  tests/
```

### Critérios de Aceite (exemplos)
- Home replica os blocos-chave da referência (hero, faixas promocionais, vitrines e rodapé) com responsividade fiel.
- Fluxo mock de compra (adicionar item → carrinho → checkout → confirmação) funcional na UI.
- Área do cliente e admin navegáveis, com dados/cruds simulados coerentes.
- Acessibilidade mínima: navegação por teclado e foco; labels adequados.
- Performance aceitável em Lighthouse (sem bloqueios óbvios; imagens lazy).

### Fora do Escopo (neste momento)
- Integrações reais com gateways de pagamento, antifraude e cálculo de frete oficial.
- Emissão de notas, ERP/OMS/WMS e SEO avançado contínuo.

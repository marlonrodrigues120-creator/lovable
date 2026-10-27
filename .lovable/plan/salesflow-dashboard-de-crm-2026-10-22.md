# SalesFlow — Dashboard de CRM

Tela de Dashboard completa em português (R$, dd/mm/aaaa), com dados de exemplo, sem backend ou login.

## O que será construído
- **Menu lateral** com logo "SalesFlow" e itens: Dashboard (ativo), Leads, Clientes, Negócios, Atividades, Relatórios, Configurações. Recolhe para ícones no desktop e vira menu hambúrguer no celular. Cada item abre uma página simples "Em breve".
- **Topo**: título "Dashboard", busca, seletor de período (7 dias, 30 dias, 90 dias, Este ano), notificações, avatar e botão de modo escuro.
- **4 cards de indicadores** (Receita, Conversão, Clientes em potencial, Leads) com ícone colorido e variação verde/vermelha; grade 1/2/4 colunas.
- **Gráficos**: "Receita ao longo do tempo" (linha com área, 12 meses) e "Leads por origem" (colunas arredondadas).
- **Últimas atividades**: 8 itens com ícone por tipo e tempo relativo, link "Ver todas"; à direita no desktop, abaixo no celular.
- Skeletons de carregamento breves e animações de entrada suaves.
- Visual limpo: azul-índigo como cor principal, fonte Inter, fundo cinza claro, cards brancos arredondados, modo escuro.

## Detalhes técnicos
- Rotas: `index.tsx` (dashboard), `leads.tsx`, `clientes.tsx`, `negocios.tsx`, `atividades.tsx`, `relatorios.tsx`, `configuracoes.tsx`, cada uma com `head()` própria.
- Layout compartilhado em `__root.tsx` com shadcn `SidebarProvider` (`collapsible="icon"`), `lang="pt-BR"`, link da fonte Inter.
- Componentes em `src/components/dashboard/`: `StatCard`, `RevenueChart`, `LeadsBySourceChart`, `ActivityFeed`, `AppSidebar`, `Header`.
- Dados em `src/data/mockDashboard.ts`; formatação com `Intl.NumberFormat('pt-BR')`.
- Instalar `recharts` e componentes shadcn necessários (sidebar, card, select, input, avatar, skeleton, button, dropdown, sheet, tooltip).
- Tokens de cor (oklch) em `src/styles.css` para claro/escuro, incluindo cores de sucesso/perigo e gráficos.

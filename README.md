# TOSmartFinanceWEB
# SmartFinance — Frontend

> Interface web para gestão de finanças pessoais com inteligência artificial.  
> Construída com **React 18 + TypeScript + Tailwind CSS**.

---

## Índice

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Início Rápido](#início-rápido)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura de Estado](#arquitetura-de-estado)
- [Páginas e Funcionalidades](#páginas-e-funcionalidades)
- [Design System](#design-system)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Deploy (Azure Static Web Apps)](#deploy-azure-static-web-apps)

---

## Visão Geral

O frontend do SmartFinance é uma SPA (Single Page Application) que comunica com o backend via API Gateway. Oferece uma interface limpa para gestão de contas, transações e orçamentos, com dashboards de relatórios e um assistente de IA integrado.

### Funcionalidades principais

- **Autenticação** — login com email/password ou Google OAuth2
- **Dashboard** — resumo financeiro do mês com gráficos interativos
- **Contas** — gestão de múltiplas contas bancárias (conta corrente, poupança, cartão de crédito)
- **Transações** — listagem paginada com filtros avançados, criação manual e importação CSV
- **Orçamentos** — definição de limites por categoria com alertas visuais
- **Relatórios** — análise por categoria, tendência mensal, taxa de poupança
- **Assistente IA** — insights automáticos, previsão de gastos e chat financeiro

---

## Stack Tecnológica

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 |
| Linguagem | TypeScript 5 (strict mode) |
| Build | Vite 5 |
| Estilos | Tailwind CSS 3 |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query v5) |
| Client state | Zustand |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| HTTP client | Axios |
| Datas | date-fns |
| Testes | Vitest + React Testing Library |
| Linting | ESLint + Prettier |

---

## Pré-requisitos

- **Node.js 20+** — [Download](https://nodejs.org/)
- **npm 10+** — incluído no Node.js
- **Backend a correr** — ver `../backend/README.md`

Verificar instalação:
```bash
node -v   # v20...
npm -v    # 10...
```

---

## Início Rápido

### 1. Instalar dependências
```bash
cd smartfinance/frontend
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# VITE_API_URL=http://localhost:8080 (já configurado por default)
```

### 3. Iniciar em modo desenvolvimento
```bash
npm run dev
```

A aplicação fica disponível em **http://localhost:5173**.

### 4. Verificar que o backend está acessível
```bash
curl http://localhost:8080/actuator/health
# {"status":"UP"}
```

### Scripts disponíveis

```bash
npm run dev          # Servidor de desenvolvimento com HMR
npm run build        # Build de produção para /dist
npm run preview      # Preview do build de produção localmente
npm run type-check   # TypeScript sem emitir ficheiros (tsc --noEmit)
npm run lint         # ESLint em todo o /src
npm run lint:fix     # ESLint com auto-fix
npm run test         # Testes com Vitest (modo watch)
npm run test:run     # Testes uma vez (CI)
npm run test:ui      # Vitest UI no browser
npm run coverage     # Relatório de cobertura
```

---

## Variáveis de Ambiente

```env
# .env.local (desenvolvimento)
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

```env
# .env.production
VITE_API_URL=https://api.smartfinance.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> Todas as variáveis de ambiente no Vite têm de começar com `VITE_` para ficarem disponíveis no bundle.

---

## Estrutura do Projeto

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
│
└── src/
    ├── main.tsx                    # Entry point — providers globais
    ├── App.tsx                     # Router principal
    │
    ├── api/                        # Camada de acesso à API
    │   ├── client.ts               # Axios — interceptors e refresh automático
    │   ├── auth.api.ts
    │   ├── accounts.api.ts
    │   ├── transactions.api.ts
    │   ├── categories.api.ts
    │   ├── reports.api.ts
    │   ├── budgets.api.ts
    │   ├── ai.api.ts
    │   └── notifications.api.ts
    │
    ├── hooks/                      # React Query hooks por domínio
    │   ├── useAuth.ts
    │   ├── useAccounts.ts
    │   ├── useTransactions.ts
    │   ├── useCategories.ts
    │   ├── useReports.ts
    │   ├── useBudgets.ts
    │   ├── useAI.ts
    │   └── useNotifications.ts
    │
    ├── store/                      # Zustand — estado global não-servidor
    │   ├── auth.store.ts           # Utilizador autenticado e access token
    │   └── ui.store.ts             # Sidebar, toasts, theme
    │
    ├── types/                      # TypeScript types e interfaces
    │   ├── auth.types.ts
    │   ├── account.types.ts
    │   ├── transaction.types.ts
    │   ├── category.types.ts
    │   ├── report.types.ts
    │   ├── budget.types.ts
    │   └── api.types.ts            # ApiError, PaginatedResponse<T>
    │
    ├── pages/                      # Um componente por rota
    │   ├── auth/
    │   │   ├── LoginPage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── dashboard/
    │   │   └── DashboardPage.tsx
    │   ├── accounts/
    │   │   ├── AccountsPage.tsx
    │   │   └── AccountDetailPage.tsx
    │   ├── transactions/
    │   │   ├── TransactionsPage.tsx
    │   │   └── TransactionDetailPage.tsx
    │   ├── categories/
    │   │   └── CategoriesPage.tsx
    │   ├── budgets/
    │   │   └── BudgetsPage.tsx
    │   ├── reports/
    │   │   └── ReportsPage.tsx
    │   ├── ai/
    │   │   └── AIAssistantPage.tsx
    │   └── settings/
    │       └── SettingsPage.tsx
    │
    ├── components/
    │   ├── ui/                     # Design system — primitivos reutilizáveis
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Select.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Card.tsx
    │   │   ├── Table.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── Toast.tsx
    │   │   └── EmptyState.tsx
    │   ├── layout/
    │   │   ├── AppLayout.tsx       # Layout principal com sidebar
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   └── AuthLayout.tsx
    │   ├── charts/
    │   │   ├── ExpensesByCategory.tsx
    │   │   ├── MonthlyTrend.tsx
    │   │   └── BudgetProgress.tsx
    │   ├── transactions/
    │   │   ├── TransactionList.tsx
    │   │   ├── TransactionItem.tsx
    │   │   ├── TransactionForm.tsx
    │   │   ├── TransactionFilters.tsx
    │   │   └── CsvImportModal.tsx
    │   ├── accounts/
    │   │   ├── AccountCard.tsx
    │   │   └── AccountForm.tsx
    │   ├── budgets/
    │   │   ├── BudgetCard.tsx
    │   │   └── BudgetForm.tsx
    │   └── ai/
    │       ├── InsightCard.tsx
    │       └── ChatWidget.tsx
    │
    ├── utils/
    │   ├── currency.ts             # formatCurrency(1800, 'EUR') → "€1.800,00"
    │   ├── date.ts                 # formatDate, getMonthRange, etc.
    │   └── cn.ts                   # clsx + tailwind-merge
    │
    └── constants/
        ├── routes.ts               # ROUTES — paths centralizadas
        └── queryKeys.ts            # React Query keys
```

---

## Arquitetura de Estado

O estado da aplicação está dividido em duas camadas com responsabilidades distintas:

### Server State — TanStack Query
Tudo o que vem da API é gerido pelo React Query. Cada domínio tem o seu hook dedicado em `/hooks`:

```typescript
// Exemplo de uso numa página
function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const { data, isLoading, isError } = useTransactions(filters);

  // data é automaticamente cacheado, revalidado e sincronizado
}
```

**Estratégia de cache:**
- Transações: 1 minuto (`staleTime`)
- Categorias: 10 minutos (mudam raramente)
- Relatórios: 5 minutos
- Insights AI: 30 minutos

**Invalidação inteligente:** ao criar/editar uma transação, são automaticamente invalidadas as queries de transações, contas (saldo) e relatórios.

### Client State — Zustand
Apenas estado que não é servidor: utilizador autenticado, token em memória, UI (sidebar, toasts).

```typescript
// auth.store — token em memória, user em localStorage (sem dados sensíveis)
const { user, isAuthenticated } = useAuthStore();

// ui.store — estado de UI efémero
const { addToast, toggleSidebar } = useUIStore();
```

> **Nota de segurança:** o `accessToken` nunca é persistido em `localStorage`. Vive apenas em memória (Zustand). O `refreshToken` é um `HttpOnly cookie` gerido pelo browser — invisível ao JavaScript.

### Fluxo de autenticação

```
Login → accessToken (memória) + refreshToken (HttpOnly cookie)
          │
          ▼
Request com Authorization: Bearer <accessToken>
          │
    Token expirado (401)?
          │
          ▼
POST /auth/refresh (cookie enviado automaticamente)
          │
     Novo accessToken → atualiza memória → retry request original
          │
    Refresh inválido?
          │
          ▼
     Logout → redirect /login
```

---

## Páginas e Funcionalidades

### Dashboard
Resumo financeiro do mês selecionado com KPI cards, gráfico de despesas por categoria (pie chart), tendência mensal (bar chart), últimas transações e estado dos orçamentos. Inclui insights gerados por IA.

### Transações
Listagem paginada com filtros por conta, categoria, tipo, intervalo de datas, valor mínimo/máximo e pesquisa por texto. Suporta criação manual e importação de CSV no formato dos principais bancos portugueses (CGD, BPI, Millennium BCP).

### Relatórios
Análise detalhada por período selecionável: breakdown por categoria, comparação com mês anterior, taxa de poupança, e tendência dos últimos 12 meses.

### Orçamentos
Definição de limites mensais ou anuais por categoria, com indicadores visuais de progresso e alertas em tempo real quando o threshold configurado é atingido.

### Assistente IA
Painel dividido em: insights automáticos do mês, previsão de gastos para os próximos meses, e chat livre em português com contexto financeiro do utilizador.

---

## Design System

### Paleta de cores

| Token | Hex | Uso |
|---|---|---|
| `primary-600` | `#16a34a` | Botões, links, foco |
| `income` | `#22c55e` | Valores de receita |
| `expense` | `#ef4444` | Valores de despesa |
| `transfer` | `#3b82f6` | Transferências |
| `gray-50` | `#f9fafb` | Fundo de página |

### Princípios de UI

- **Skeleton loading** em vez de spinners para listas e cards
- **Empty states** com ação clara quando não há dados
- **Toast notifications** para feedback de ações (sucesso/erro)
- **Optimistic updates** em criação de transações (UI atualiza antes da resposta)
- Layout **responsivo** — sidebar colapsa em mobile

### Utilitário `cn()`
```typescript
import { cn } from '../utils/cn';

// Combina classes Tailwind sem conflitos
<div className={cn('px-4 py-2', isActive && 'bg-primary-100', className)} />
```

---

## Testes

### Correr testes
```bash
npm run test         # Modo watch (desenvolvimento)
npm run test:run     # Uma vez (CI)
npm run coverage     # Com relatório de cobertura
```

### Estrutura
```
src/
└── __tests__/
    ├── components/
    │   ├── TransactionItem.test.tsx
    │   ├── AccountCard.test.tsx
    │   └── Button.test.tsx
    ├── hooks/
    │   ├── useTransactions.test.ts
    │   └── useAuth.test.ts
    └── utils/
        ├── currency.test.ts
        └── date.test.ts
```

### Convenções de testes

- Testar **comportamento**, não implementação
- Usar `screen.getByRole` em vez de `getByTestId` sempre que possível
- Mockar a camada `/api` — nunca fazer chamadas HTTP reais em testes
- Cada teste deve ser independente — sem estado partilhado entre testes

```typescript
// Exemplo de padrão correto
test('mostra valor negativo a vermelho para despesas', () => {
  render(<TransactionItem transaction={mockExpense} />);
  expect(screen.getByText('-€45,30')).toHaveClass('text-expense');
});
```

---

## CI/CD

O pipeline está definido em `.github/workflows/frontend-ci.yml`.

### Passos do pipeline

```
push/PR → type-check → lint → test → build → (main) deploy Azure
```

### Checks obrigatórios antes de merge

- `tsc --noEmit` sem erros
- ESLint sem erros
- Todos os testes passam
- Build de produção bem-sucedido

---

## Deploy (Azure Static Web Apps)

### Setup inicial
```bash
# Instalar Azure CLI
az login

# Criar Static Web App
az staticwebapp create \
  --name smartfinance-frontend \
  --resource-group smartfinance-rg \
  --source https://github.com/teu-user/smartfinance \
  --location "West Europe" \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist"
```

### Variáveis de ambiente em produção

No portal Azure → Static Web Apps → Configuration:
```
VITE_API_URL = https://api.smartfinance.yourdomain.com
VITE_GOOGLE_CLIENT_ID = ...
```

### Build automático

A partir do setup inicial, cada push para `main` dispara automaticamente o build e deploy via GitHub Actions.

---

## Contribuição

1. Cria branch a partir de `develop`: `git checkout -b feature/nome`
2. Segue as convenções de código — TypeScript strict, sem `any`
3. Adiciona testes para novos componentes e hooks
4. `npm run type-check && npm run lint && npm run test:run` têm de passar
5. Cria Pull Request para `develop`

---

## Licença

MIT © SmartFinance

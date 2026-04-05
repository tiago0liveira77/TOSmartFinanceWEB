# SmartFinance — Frontend (React 18 + TypeScript + Tailwind)

## CONTEXTO PARA O CLAUDE

Estás a desenvolver o frontend do SmartFinance. É uma SPA em React 18 com TypeScript estrito, comunicando com o backend via API Gateway (porta 8080). Lê este ficheiro antes de qualquer implementação.

---

## SETUP INICIAL

```bash
# Criar projeto
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Dependências principais
npm install \
  react-router-dom@6 \
  @tanstack/react-query@5 \
  zustand \
  axios \
  react-hook-form \
  @hookform/resolvers \
  zod \
  recharts \
  date-fns \
  clsx \
  tailwind-merge

# Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Testes
npm install -D vitest @testing-library/react @testing-library/user-event jsdom

# Dev experience
npm install -D @types/node
```

---

## ESTRUTURA DE PASTAS

```
frontend/src/
├── main.tsx                    ← Entry point, providers
├── App.tsx                     ← Router principal
├── vite-env.d.ts
│
├── api/                        ← Camada de comunicação com backend
│   ├── client.ts               ← Instância Axios configurada
│   ├── auth.api.ts             ← Chamadas auth-service
│   ├── accounts.api.ts         ← Chamadas finance-service
│   ├── transactions.api.ts
│   ├── categories.api.ts
│   ├── reports.api.ts
│   ├── budgets.api.ts
│   ├── ai.api.ts
│   └── notifications.api.ts
│
├── hooks/                      ← React Query hooks (1 ficheiro por domínio)
│   ├── useAuth.ts
│   ├── useAccounts.ts
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   ├── useReports.ts
│   ├── useBudgets.ts
│   ├── useAI.ts
│   └── useNotifications.ts
│
├── store/                      ← Zustand stores (estado global não-server)
│   ├── auth.store.ts           ← user, isAuthenticated
│   └── ui.store.ts             ← sidebar open, theme, toasts
│
├── types/                      ← TypeScript types/interfaces
│   ├── auth.types.ts
│   ├── account.types.ts
│   ├── transaction.types.ts
│   ├── category.types.ts
│   ├── report.types.ts
│   ├── budget.types.ts
│   └── api.types.ts            ← ApiError, PaginatedResponse<T>
│
├── pages/                      ← Componentes de página (1 por route)
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
├── components/                 ← Componentes reutilizáveis
│   ├── ui/                     ← Primitivos de UI (design system)
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
│   │   ├── AppLayout.tsx        ← Layout com sidebar + header
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── AuthLayout.tsx       ← Layout para login/register
│   ├── charts/
│   │   ├── ExpensesByCategory.tsx  ← Pie chart
│   │   ├── MonthlyTrend.tsx        ← Bar/Line chart
│   │   └── BudgetProgress.tsx      ← Progress bars
│   ├── accounts/
│   │   ├── AccountCard.tsx
│   │   └── AccountForm.tsx
│   ├── transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionItem.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── CsvImportModal.tsx
│   ├── budgets/
│   │   ├── BudgetCard.tsx
│   │   └── BudgetForm.tsx
│   └── ai/
│       ├── InsightCard.tsx
│       └── ChatWidget.tsx
│
├── utils/
│   ├── currency.ts             ← formatCurrency(amount, 'EUR')
│   ├── date.ts                 ← formatDate, getMonthRange
│   └── cn.ts                   ← clsx + tailwind-merge helper
│
└── constants/
    ├── routes.ts               ← ROUTES object com todas as paths
    └── queryKeys.ts            ← React Query keys centralizados
```

---

## TIPOS TYPESCRIPT

### api.types.ts
```typescript
export interface ApiError {
  status: number;
  code: string;          // "USER_NOT_FOUND", "INVALID_TOKEN", etc.
  message: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

### transaction.types.ts
```typescript
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  notes: string | null;
  date: string;           // ISO date "2024-01-15"
  isRecurring: boolean;
  aiCategorized: boolean;
  aiConfidence: number | null;
  createdAt: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId?: string;
  amount: number;
  type: TransactionType;
  description: string;
  notes?: string;
  date: string;
  isRecurring?: boolean;
  recurrenceRule?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}
```

### report.types.ts
```typescript
export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;         // 0-100 (percentage)
  topCategories: CategorySummary[];
  comparedToPreviousMonth: {
    incomeChange: number;       // percentage change
    expensesChange: number;
  };
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;              // "2024-01"
  income: number;
  expenses: number;
  balance: number;
}
```

---

## AXIOS CLIENT

```typescript
// api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,    // Necessário para HttpOnly cookie do refresh token
});

// Request interceptor: adiciona Bearer token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh automático em 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Outros requests aguardam o refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = response.data;
        useAuthStore.getState().setAccessToken(accessToken);

        failedQueue.forEach(({ resolve }) => resolve(accessToken));
        failedQueue = [];

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        failedQueue.forEach(({ reject }) => reject(refreshError));
        failedQueue = [];
        useAuthStore.getState().logout();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

---

## ZUSTAND STORES

### auth.store.ts
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken) =>
        set({ accessToken }),
      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'sf-auth',
      partialize: (state) => ({ user: state.user }),
      // Nota: NÃO persistir accessToken (segurança)
      // O token vive só em memória, o refresh token é HttpOnly cookie
    }
  )
);
```

### ui.store.ts
```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

interface UIStore {
  sidebarOpen: boolean;
  toasts: Toast[];
  toggleSidebar: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

---

## REACT QUERY — HOOKS

### useTransactions.ts
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filters],
    queryFn: () => transactionsApi.list(filters),
    staleTime: 1000 * 60,    // 1 minuto
    placeholderData: keepPreviousData,  // evita flash ao mudar página
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: (newTransaction) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REPORTS] });
    },
    onError: (error) => {
      // Toast de erro via ui.store
    }
  });
}

export function useImportCSV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => transactionsApi.importCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    }
  });
}
```

### queryKeys.ts
```typescript
export const QUERY_KEYS = {
  // Auth
  USER_ME: 'user-me',

  // Finance
  ACCOUNTS: 'accounts',
  ACCOUNT_DETAIL: 'account-detail',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BUDGETS: 'budgets',

  // Reports
  REPORTS: 'reports',
  MONTHLY_SUMMARY: 'monthly-summary',
  MONTHLY_TREND: 'monthly-trend',
  BUDGET_STATUS: 'budget-status',

  // AI
  AI_INSIGHTS: 'ai-insights',
  AI_FORECAST: 'ai-forecast',

  // Notifications
  NOTIFICATIONS: 'notifications',
} as const;
```

---

## ROUTING

```typescript
// App.tsx
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  // Rotas públicas
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }]
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }]
  },

  // Rotas protegidas
  {
    path: '/',
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'accounts/:id', element: <AccountDetailPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'budgets', element: <BudgetsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ]
  }
]);

// ProtectedRoute.tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
```

---

## FORMULÁRIOS — REACT HOOK FORM + ZOD

### Exemplo: CreateTransactionForm
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createTransactionSchema = z.object({
  accountId: z.string().uuid('Conta inválida'),
  categoryId: z.string().uuid().optional(),
  amount: z
    .string()
    .transform(Number)
    .pipe(z.number().positive('Valor deve ser positivo')),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  description: z
    .string()
    .min(2, 'Mínimo 2 caracteres')
    .max(500, 'Máximo 500 caracteres'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  notes: z.string().max(2000).optional(),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

export function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
  });

  const { mutate, isPending } = useCreateTransaction();

  const onSubmit = (data: CreateTransactionFormData) => {
    mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* campos com error handling */}
    </form>
  );
}
```

---

## DESIGN SYSTEM — TAILWIND

### Paleta de cores (tailwind.config.ts)
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
      },
      income: '#22c55e',       // verde
      expense: '#ef4444',      // vermelho
      transfer: '#3b82f6',     // azul
    }
  }
}
```

### Componente Button reutilizável
```typescript
// components/ui/Button.tsx
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-gray-600 hover:bg-gray-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
```

---

## PÁGINAS — DETALHES

### DashboardPage
```
Layout:
┌─────────────────────────────────────────────┐
│  Bom dia, [Nome]!     Mês: Janeiro 2024  ▼  │
├──────────┬──────────┬──────────┬────────────┤
│ Receitas │ Despesas │  Saldo   │  Poupança  │ ← KPI Cards
│ €1.800   │  €1.200  │  €600    │    33%     │
├──────────┴──────────┴──────────┴────────────┤
│                                             │
│  [Gráfico: Despesas por Categoria]  [Trend] │
│  (Pie Chart)                  (Bar Chart)   │
│                                             │
├─────────────────────┬───────────────────────┤
│  Últimas Transações │   Status Orçamentos   │
│  [Lista 5 items]    │   [Progress bars]     │
│                     │                       │
├─────────────────────┴───────────────────────┤
│  💡 Insights AI: "Gastaste 20% mais em...   │
└─────────────────────────────────────────────┘
```

### TransactionsPage
```
Layout:
┌─────────────────────────────────────────────┐
│  Transações           [+ Nova] [↑ Importar] │
├─────────────────────────────────────────────┤
│  🔍 Pesquisar...    [Conta ▼] [Tipo ▼] [📅] │
│  [Categoria ▼]  [Min €] [Max €]  [Limpar]  │
├─────────────────────────────────────────────┤
│  Data      Descrição    Categoria   Valor   │
│  15 Jan    Continente   🛒 Alim.  -€45.30   │
│  16 Jan    Salário      💼 Rend.  +€1800    │
│  ...                                        │
├─────────────────────────────────────────────┤
│         < 1 2 3 ... 10 >    50 resultados   │
└─────────────────────────────────────────────┘
```

### AIAssistantPage
```
Layout:
┌──────────────────┬──────────────────────────┐
│  INSIGHTS        │  CHAT FINANCEIRO          │
│  Janeiro 2024    │                           │
│                  │  ┌────────────────────┐  │
│  💡 Gastaste 20% │  │ Como posso poupar  │  │
│  mais em food... │  │ mais este mês?     │  │
│                  │  └────────────────────┘  │
│  💡 O teu rate   │         ↓                │
│  de poupança...  │  ┌────────────────────┐  │
│                  │  │ Com base nos teus  │  │
│  PREVISÃO        │  │ dados, vejo que... │  │
│  Próx. 3 meses   │  └────────────────────┘  │
│  [Gráfico prev.] │                           │
│                  │  [Escreve aqui...] [→]   │
└──────────────────┴──────────────────────────┘
```

---

## TRATAMENTO DE ESTADOS

### Loading
```typescript
// Sempre usar Skeleton em vez de spinner para listas
// Exemplo: TransactionList com loading
function TransactionList() {
  const { data, isLoading } = useTransactions(filters);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }
  // ...
}
```

### Empty State
```typescript
// Sempre mostrar empty state com ação quando lista vazia
function EmptyTransactions() {
  return (
    <EmptyState
      icon={<ReceiptIcon />}
      title="Sem transações"
      description="Adiciona a tua primeira transação ou importa um CSV do teu banco."
      action={<Button onClick={openModal}>+ Nova transação</Button>}
    />
  );
}
```

### Error Boundary
```typescript
// Envolver cada page com ErrorBoundary
// Mostrar mensagem amigável + botão de retry
```

---

## TESTES FRONTEND

### Setup (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### Exemplo de teste de componente
```typescript
// __tests__/TransactionItem.test.tsx
import { render, screen } from '@testing-library/react';
import { TransactionItem } from '../components/transactions/TransactionItem';

const mockTransaction: Transaction = {
  id: '1',
  description: 'Supermercado Continente',
  amount: 45.30,
  type: 'EXPENSE',
  date: '2024-01-15',
  categoryName: 'Alimentação',
  categoryColor: '#ff0000',
  // ...
};

test('renders transaction with correct amount', () => {
  render(<TransactionItem transaction={mockTransaction} />);
  expect(screen.getByText('Supermercado Continente')).toBeInTheDocument();
  expect(screen.getByText('-€45,30')).toBeInTheDocument();
});

test('shows income in green', () => {
  const income = { ...mockTransaction, type: 'INCOME', amount: 1800 };
  render(<TransactionItem transaction={income} />);
  const amount = screen.getByText('+€1.800,00');
  expect(amount).toHaveClass('text-income');
});
```

### Exemplo de teste de hook
```typescript
// __tests__/useTransactions.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useTransactions } from '../hooks/useTransactions';

// Mock da API
vi.mock('../api/transactions.api', () => ({
  transactionsApi: {
    list: vi.fn().mockResolvedValue({
      content: [mockTransaction],
      totalElements: 1,
    })
  }
}));

test('fetches transactions', async () => {
  const { result } = renderHook(() => useTransactions({}), {
    wrapper: createQueryWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.content).toHaveLength(1);
});
```

---

## VARIÁVEIS DE AMBIENTE

```bash
# .env.local
VITE_API_URL=http://localhost:8081
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# .env.production
VITE_API_URL=https://api.smartfinance.yourdomain.com
```

---

## CI/CD FRONTEND

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run type-check    # tsc --noEmit
      - run: npm run lint          # eslint
      - run: npm run test          # vitest run
      - run: npm run build         # vite build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
          app_location: "/frontend"
          output_location: "dist"
```

---

## ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

### Sprint 1 (Semana 1-2) — Fundações
1. Setup Vite + TypeScript + Tailwind
2. Design system base: Button, Input, Card, Modal
3. AppLayout + Sidebar + Header
4. Auth pages: Login + Register
5. Axios client com interceptors
6. Zustand auth store
7. ProtectedRoute + routing completo

### Sprint 2 (Semana 3) — Core UI
8. Dashboard skeleton com KPI cards
9. Accounts: lista e formulário
10. Categories: lista e formulário
11. React Query setup + hooks base

### Sprint 3 (Semana 4-5) — Transações
12. TransactionList com paginação e filtros
13. TransactionForm (criar/editar)
14. CSV Import modal
15. TransactionItem com categorias e cores

### Sprint 4 (Semana 6) — Relatórios
16. Recharts: ExpensesByCategory (Pie)
17. Recharts: MonthlyTrend (Bar + Line)
18. ReportsPage completa
19. BudgetsPage com progress bars

### Sprint 5 (Semana 7) — AI
20. InsightCards no dashboard
21. AIAssistantPage com chat
22. ForecastChart

### Sprint 6 (Semana 8) — Qualidade
23. Testes de componentes críticos
24. Error boundaries
25. Loading states e empty states
26. Mobile responsiveness
27. Performance: lazy loading de páginas

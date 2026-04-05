export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: (id: string) => `/accounts/${id}`,
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: (id: string) => `/transactions/${id}`,
  CATEGORIES: '/categories',
  BUDGETS: '/budgets',
  REPORTS: '/reports',
  AI: '/ai',
  SETTINGS: '/settings',
} as const;

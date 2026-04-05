import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { AccountsPage } from '@/pages/accounts/AccountsPage';
import { AccountDetailPage } from '@/pages/accounts/AccountDetailPage';
import { TransactionsPage } from '@/pages/transactions/TransactionsPage';
import { TransactionDetailPage } from '@/pages/transactions/TransactionDetailPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { BudgetsPage } from '@/pages/budgets/BudgetsPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { AIAssistantPage } from '@/pages/ai/AIAssistantPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },

  // Protected routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'accounts', element: <AccountsPage /> },
      { path: 'accounts/:id', element: <AccountDetailPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transactions/:id', element: <TransactionDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'budgets', element: <BudgetsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'ai', element: <AIAssistantPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Catch-all redirect
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function App() {
  return <RouterProvider router={router} />;
}

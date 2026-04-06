import { useAuthStore } from '@/store/auth.store';
import { useMonthlySummary, useMonthlyTrend } from '@/hooks/useReports';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { ExpensesByCategory } from '@/components/charts/ExpensesByCategory';
import { MonthlyTrend } from '@/components/charts/MonthlyTrend';
import { formatCurrency } from '@/utils/currency';
import { currentYearMonth, formatMonthYear } from '@/utils/date';
import { cn } from '@/utils/cn';
import { parseISO } from 'date-fns';

function KpiCard({
  label,
  value,
  change,
  colorClass,
  isLoading,
}: {
  label: string;
  value: string;
  change?: number;
  colorClass?: string;
  isLoading: boolean;
}) {
  return (
    <Card>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {isLoading ? (
        <Skeleton className="h-7 w-28 mt-2" />
      ) : (
        <p className={cn('text-xl font-bold mt-1', colorClass ?? 'text-gray-900')}>{value}</p>
      )}
      {change !== undefined && !isLoading && (
        <p className={cn('text-xs mt-1', change >= 0 ? 'text-green-600' : 'text-red-600')}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </p>
      )}
    </Card>
  );
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const month = currentYearMonth();

  const { data: summary, isLoading: loadingSummary } = useMonthlySummary(month);
  const { data: trend, isLoading: loadingTrend } = useMonthlyTrend(6);
  const { data: recentTx, isLoading: loadingTx } = useTransactions({ size: 5, page: 0 });
  const { data: budgets, isLoading: loadingBudgets } = useBudgets(month);

  const firstName = user?.name?.split(' ')[0] ?? 'utilizador';
  const monthLabel = formatMonthYear(parseISO(`${month}-01`));

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Bom dia, {firstName}!</h2>
        <p className="text-sm text-gray-500 capitalize">{monthLabel}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Receitas"
          value={formatCurrency(summary?.totalIncome ?? 0)}
          change={summary?.comparedToPreviousMonth?.incomeChange}
          colorClass="text-green-600"
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Despesas"
          value={formatCurrency(summary?.totalExpenses ?? 0)}
          change={summary?.comparedToPreviousMonth?.expensesChange}
          colorClass="text-red-600"
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Saldo"
          value={formatCurrency(summary?.balance ?? 0)}
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Poupança"
          value={`${(summary?.savingsRate ?? 0).toFixed(1)}%`}
          isLoading={loadingSummary}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Despesas por Categoria">
          {loadingSummary ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ExpensesByCategory data={summary?.topCategories ?? []} />
          )}
        </Card>

        <Card title="Tendência Mensal">
          {loadingTrend ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <MonthlyTrend data={trend ?? []} />
          )}
        </Card>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent transactions */}
        <Card title="Últimas Transações">
          {loadingTx ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !recentTx?.content.length ? (
            <EmptyState
              title="Sem transações"
              description="Ainda não tens transações registadas."
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentTx.content.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </ul>
          )}
        </Card>

        {/* Budgets */}
        <Card title="Orçamentos">
          {loadingBudgets ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : !budgets?.length ? (
            <EmptyState
              title="Sem orçamentos"
              description="Define orçamentos mensais para controlar os teus gastos."
            />
          ) : (
            <div className="space-y-3">
              {budgets.slice(0, 4).map((budget) => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

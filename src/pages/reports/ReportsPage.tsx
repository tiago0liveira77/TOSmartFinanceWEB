import { useState } from 'react';
import { useMonthlySummary, useDailyBreakdown } from '@/hooks/useReports';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ExpensesByCategory } from '@/components/charts/ExpensesByCategory';
import { DailySpending } from '@/components/charts/DailySpending';
import { formatCurrency } from '@/utils/currency';
import { currentYearMonth } from '@/utils/date';
import { cn } from '@/utils/cn';

interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  isLoading?: boolean;
}

function KpiCard({ label, value, change, isLoading }: KpiCardProps) {
  return (
    <Card>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      {isLoading ? (
        <Skeleton className="h-7 w-28 mt-2" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      )}
      {change !== undefined && !isLoading && (
        <p className={cn('text-xs mt-1', change >= 0 ? 'text-green-600' : 'text-red-600')}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs mês anterior
        </p>
      )}
    </Card>
  );
}

export function ReportsPage() {
  const [month, setMonth] = useState(currentYearMonth());
  const { data: summary, isLoading: loadingSummary } = useMonthlySummary(month);
  const { data: dailyData, isLoading: loadingDaily } = useDailyBreakdown(month);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Relatórios</h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Receitas"
          value={formatCurrency(summary?.totalIncome ?? 0)}
          change={summary?.comparedToPreviousMonth?.incomeChange}
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Despesas"
          value={formatCurrency(summary?.totalExpenses ?? 0)}
          change={summary?.comparedToPreviousMonth?.expensesChange}
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Saldo"
          value={formatCurrency(summary?.balance ?? 0)}
          isLoading={loadingSummary}
        />
        <KpiCard
          label="Taxa de poupança"
          value={`${(summary?.savingsRate ?? 0).toFixed(1)}%`}
          isLoading={loadingSummary}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Despesas por Categoria">
          {loadingSummary ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ExpensesByCategory data={summary?.topCategories ?? []} />
          )}
        </Card>

        <Card title="Gastos Diários">
          {loadingDaily ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <DailySpending data={dailyData ?? []} />
          )}
        </Card>
      </div>

      {/* Top categories table */}
      {summary?.topCategories && summary.topCategories.length > 0 && (
        <Card title="Detalhe por Categoria">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs font-medium text-gray-500 border-b border-gray-100">
                <th className="text-left pb-2">Categoria</th>
                <th className="text-right pb-2">Valor</th>
                <th className="text-right pb-2">%</th>
                <th className="text-right pb-2">Transações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summary.topCategories.map((cat) => (
                <tr key={cat.categoryId}>
                  <td className="py-2">
                    <span className="flex items-center gap-1.5">
                      <span>{cat.categoryIcon}</span>
                      <span className="text-gray-900">{cat.categoryName}</span>
                    </span>
                  </td>
                  <td className="text-right py-2 text-gray-900 font-medium">
                    {formatCurrency(cat.amount)}
                  </td>
                  <td className="text-right py-2 text-gray-500">
                    {cat.percentage.toFixed(1)}%
                  </td>
                  <td className="text-right py-2 text-gray-500">
                    {cat.transactionCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

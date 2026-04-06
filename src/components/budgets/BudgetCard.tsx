import { formatCurrency } from '@/utils/currency';
import { CategoryBadge } from '@/components/categories/CategoryBadge';
import { cn } from '@/utils/cn';
import type { Budget } from '@/types/budget.types';

interface BudgetCardProps {
  budget: Budget;
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

function progressColor(pct: number) {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 70) return 'bg-yellow-400';
  return 'bg-green-500';
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const pct = Math.min(budget.percentage, 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      <div className="flex items-center justify-between">
        <CategoryBadge
          category={{
            name: budget.categoryName,
            icon: budget.categoryIcon,
            color: budget.categoryColor,
          }}
        />
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-1 rounded hover:bg-gray-100"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget)}
              className="text-xs text-red-400 hover:text-red-600 px-1.5 py-1 rounded hover:bg-red-50"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-end justify-between mb-1">
          <span className={cn('text-sm font-semibold', pct >= 90 ? 'text-red-600' : pct >= 70 ? 'text-yellow-600' : 'text-gray-900')}>
            {pct.toFixed(0)}%
          </span>
          <span className="text-xs text-gray-500">
            {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', progressColor(pct))}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Restante: <span className="font-medium text-gray-700">{formatCurrency(budget.remaining)}</span>
      </p>
    </div>
  );
}

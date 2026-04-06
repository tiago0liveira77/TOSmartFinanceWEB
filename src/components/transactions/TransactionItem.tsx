import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { CategoryBadge } from '@/components/categories/CategoryBadge';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/types/transaction.types';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

const TYPE_SIGN: Record<string, string> = {
  INCOME: '+',
  EXPENSE: '-',
  TRANSFER: '',
};

const TYPE_COLOR: Record<string, string> = {
  INCOME: 'text-green-600',
  EXPENSE: 'text-red-600',
  TRANSFER: 'text-blue-600',
};

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const sign = TYPE_SIGN[transaction.type] ?? '';
  const colorClass = TYPE_COLOR[transaction.type] ?? 'text-gray-900';

  return (
    <li className="flex items-center gap-3 py-3 group">
      {/* Date */}
      <div className="w-12 text-center shrink-0">
        <p className="text-xs font-semibold text-gray-700 leading-none">
          {formatDate(transaction.date, 'dd')}
        </p>
        <p className="text-xs text-gray-400 uppercase">
          {formatDate(transaction.date, 'MMM')}
        </p>
      </div>

      {/* Description + category */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{transaction.description}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {transaction.categoryName ? (
            <CategoryBadge
              category={{
                name: transaction.categoryName,
                icon: transaction.categoryIcon ?? '•',
                color: transaction.categoryColor ?? '#9ca3af',
              }}
              size="sm"
            />
          ) : (
            <span className="text-xs text-gray-400">Sem categoria</span>
          )}
          {transaction.aiCategorized && (
            <span className="text-xs text-purple-500" title="Categorizado por IA">✨</span>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className={cn('text-sm font-semibold', colorClass)}>
          {sign}{formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-gray-400">{transaction.accountName}</p>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="text-xs text-gray-500 hover:text-gray-700 px-1.5 py-1 rounded hover:bg-gray-100"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(transaction)}
              className="text-xs text-red-400 hover:text-red-600 px-1.5 py-1 rounded hover:bg-red-50"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </li>
  );
}

import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import { ROUTES } from '@/constants/routes';
import type { Account, AccountType } from '@/types/account.types';

const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  CHECKING: 'Conta à ordem',
  SAVINGS: 'Poupança',
  CREDIT_CARD: 'Cartão de crédito',
  INVESTMENT: 'Investimento',
  CASH: 'Dinheiro',
  OTHER: 'Outro',
};

const DEFAULT_COLOR = '#6b7280';

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

export function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  const navigate = useNavigate();
  const color = account.color ?? DEFAULT_COLOR;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-shadow"
      onClick={() => navigate(ROUTES.ACCOUNT_DETAIL(account.id))}
    >
      {/* Color bar */}
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {ACCOUNT_TYPE_LABELS[account.type]}
            </p>
            <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{account.name}</h3>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: color }}
          >
            {account.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(account.balance, account.currency)}
          </p>
          <p className="text-xs text-gray-400">{account.currency}</p>
        </div>

        {/* Actions — visible on hover */}
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              onClick={() => onEdit(account)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(account)}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

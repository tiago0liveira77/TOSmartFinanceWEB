import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { formatCurrency } from '@/utils/currency';
import { ROUTES } from '@/constants/routes';
import type { Transaction } from '@/types/transaction.types';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CHECKING: 'Conta à ordem',
  SAVINGS: 'Poupança',
  CREDIT_CARD: 'Cartão de crédito',
  INVESTMENT: 'Investimento',
  CASH: 'Dinheiro',
  OTHER: 'Outro',
};

export function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: account, isLoading: loadingAccount } = useAccount(id!);
  const [page, setPage] = useState(0);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: transactionsPage, isLoading: loadingTx } = useTransactions({
    accountId: id,
    page,
    size: 10,
  });

  if (loadingAccount) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!account) {
    return (
      <EmptyState
        title="Conta não encontrada"
        action={<Button onClick={() => navigate(ROUTES.ACCOUNTS)}>Voltar às contas</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.ACCOUNTS)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ←
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{account.name}</h2>
          <p className="text-sm text-gray-500">{ACCOUNT_TYPE_LABELS[account.type]}</p>
        </div>
      </div>

      {/* Balance card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Saldo actual</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundColor: account.color ?? '#6b7280' }}
          >
            {account.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </Card>

      {/* Transactions */}
      <Card
        title="Transações"
        footer={
          transactionsPage && transactionsPage.totalPages > 1 ? (
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Anterior
              </Button>
              <span className="text-xs text-gray-500">
                Página {page + 1} de {transactionsPage.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={transactionsPage.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Próximo →
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="flex justify-end mb-3">
          <Button size="sm" onClick={() => setCreateOpen(true)}>+ Nova transação</Button>
        </div>

        {loadingTx ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : !transactionsPage?.content.length ? (
          <EmptyState
            title="Sem transações"
            description="Esta conta ainda não tem transações registadas."
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {transactionsPage.content.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onEdit={setEditTransaction}
              />
            ))}
          </ul>
        )}
      </Card>

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nova transação" size="lg">
        <TransactionForm
          defaultAccountId={id}
          onSuccess={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!editTransaction} onClose={() => setEditTransaction(null)} title="Editar transação" size="lg">
        {editTransaction && (
          <TransactionForm transaction={editTransaction} onSuccess={() => setEditTransaction(null)} />
        )}
      </Modal>
    </div>
  );
}

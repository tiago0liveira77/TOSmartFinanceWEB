import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAccount, useAccountSummary, useUpdateAccount, useDeleteAccount } from '@/hooks/useAccounts';
import { useTransactions } from '@/hooks/useTransactions';
import { useUIStore } from '@/store/ui.store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { AccountForm } from '@/components/accounts/AccountForm';
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
  const addToast = useUIStore((s) => s.addToast);

  const { data: account, isLoading: loadingAccount } = useAccount(id!);
  const { data: summary, isLoading: loadingSummary } = useAccountSummary(id!);
  const { mutate: deleteAccount, isPending: deleting } = useDeleteAccount();

  const [page, setPage] = useState(0);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: transactionsPage, isLoading: loadingTx } = useTransactions({
    accountId: id,
    page,
    size: 10,
  });

  const handleDelete = () => {
    deleteAccount(id!, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Conta eliminada' });
        navigate(ROUTES.ACCOUNTS);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao eliminar conta' }),
    });
  };

  if (loadingAccount) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(ROUTES.ACCOUNTS)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ←
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{account.name}</h2>
            <p className="text-sm text-gray-500">{ACCOUNT_TYPE_LABELS[account.type] ?? account.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditAccountOpen(true)}>
            Editar
          </Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
            Eliminar
          </Button>
        </div>
      </div>

      {/* Balance + monthly summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: account.color ?? '#6b7280' }}
            >
              {account.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-500">Saldo actual</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>
          </div>
        </Card>

        {loadingSummary ? (
          <>
            <Card><Skeleton className="h-10 w-full" /></Card>
            <Card><Skeleton className="h-10 w-full" /></Card>
            <Card><Skeleton className="h-10 w-full" /></Card>
          </>
        ) : summary ? (
          <>
            <Card>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Receitas (mês)</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                {formatCurrency(summary.monthIncome)}
              </p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Despesas (mês)</p>
              <p className="text-xl font-bold text-red-500 mt-1">
                {formatCurrency(summary.monthExpenses)}
              </p>
            </Card>
            <Card>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Saldo mensal</p>
              <p className={`text-xl font-bold mt-1 ${summary.monthNet >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {formatCurrency(summary.monthNet)}
              </p>
            </Card>
          </>
        ) : null}
      </div>

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

      {/* Modals */}
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

      <Modal isOpen={editAccountOpen} onClose={() => setEditAccountOpen(false)} title="Editar conta">
        <AccountForm account={account} onSuccess={() => setEditAccountOpen(false)} />
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Eliminar conta">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Tens a certeza que queres eliminar a conta <strong>{account.name}</strong>?
            Esta acção não pode ser revertida e todas as transações associadas serão removidas.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
              Eliminar conta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

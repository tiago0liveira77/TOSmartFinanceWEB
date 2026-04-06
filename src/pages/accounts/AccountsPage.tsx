import { useState } from 'react';
import { useAccounts, useDeleteAccount } from '@/hooks/useAccounts';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { AccountCard } from '@/components/accounts/AccountCard';
import { AccountForm } from '@/components/accounts/AccountForm';
import { formatCurrency } from '@/utils/currency';
import type { Account } from '@/types/account.types';

export function AccountsPage() {
  const { data: accounts, isLoading } = useAccounts();
  const { mutate: deleteAccount } = useDeleteAccount();
  const addToast = useUIStore((s) => s.addToast);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Account | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalBalance = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0;

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    deleteAccount(deleteTarget.id, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Conta removida' });
        setDeleteTarget(null);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao remover conta' }),
      onSettled: () => setDeleting(false),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Contas</h2>
          {accounts && accounts.length > 0 && (
            <p className="text-sm text-gray-500">
              Saldo total: <span className="font-medium text-gray-900">{formatCurrency(totalBalance)}</span>
            </p>
          )}
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>+ Nova conta</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          title="Sem contas"
          description="Adiciona a tua primeira conta bancária para começar a gerir as tuas finanças."
          action={<Button onClick={() => setCreateOpen(true)}>+ Nova conta</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nova conta">
        <AccountForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar conta">
        {editTarget && <AccountForm account={editTarget} onSuccess={() => setEditTarget(null)} />}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover conta" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Tens a certeza que queres remover <strong>{deleteTarget?.name}</strong>?
          As transações associadas não serão apagadas.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
          <Button variant="danger" className="flex-1" isLoading={deleting} onClick={handleDelete}>
            Remover
          </Button>
        </div>
      </Modal>
    </div>
  );
}

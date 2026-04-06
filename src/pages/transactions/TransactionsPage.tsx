import { useState } from 'react';
import { useTransactions, useDeleteTransaction, useDeleteTransactionGroup } from '@/hooks/useTransactions';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { TransactionItem } from '@/components/transactions/TransactionItem';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionFiltersPanel } from '@/components/transactions/TransactionFilters';
import { CsvImportModal } from '@/components/transactions/CsvImportModal';
import type { Transaction, TransactionFilters } from '@/types/transaction.types';

const DEFAULT_FILTERS: TransactionFilters = { page: 0, size: 20, settled: true, types: [], categoryIds: [] };

export function TransactionsPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data, isLoading, isFetching } = useTransactions(filters);
  const { mutate: deleteTransaction } = useDeleteTransaction();
  const { mutate: deleteGroup } = useDeleteTransactionGroup();

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    deleteTransaction(deleteTarget.id, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Transação removida' });
        setDeleteTarget(null);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao remover transação' }),
      onSettled: () => setDeleting(false),
    });
  };

  const handleDeleteGroup = () => {
    if (!deleteTarget?.recurrenceGroupId) return;
    setDeleting(true);
    deleteGroup(deleteTarget.recurrenceGroupId, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Todas as ocorrências removidas' });
        setDeleteTarget(null);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao remover ocorrências' }),
      onSettled: () => setDeleting(false),
    });
  };

  const setPage = (page: number) => setFilters((f) => ({ ...f, page }));

  return (
    <div className="flex gap-6 items-start">
      {/* ── Main column ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Transações</h2>
            {data && (
              <p className="text-sm text-gray-500">
                {data.totalElements} {data.totalElements === 1 ? 'resultado' : 'resultados'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCsvOpen(true)}>
              ↑ Importar CSV
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>+ Nova</Button>
          </div>
        </div>

        {/* Search */}
        <Input
          placeholder="Pesquisar descrição..."
          value={filters.search ?? ''}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value || undefined, page: 0 }))
          }
        />

        {/* List */}
        <Card
          padding={false}
          footer={
            data && data.totalPages > 1 ? (
              <div className="flex items-center justify-between px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={(filters.page ?? 0) === 0 || isFetching}
                  onClick={() => setPage((filters.page ?? 0) - 1)}
                >
                  ← Anterior
                </Button>
                <span className="text-xs text-gray-500">
                  Página {(filters.page ?? 0) + 1} de {data.totalPages}
                  {' '}· {data.totalElements} resultados
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={data.last || isFetching}
                  onClick={() => setPage((filters.page ?? 0) + 1)}
                >
                  Próximo →
                </Button>
              </div>
            ) : undefined
          }
        >
          <div className="px-4 pt-2 pb-1">
            {isLoading ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : !data?.content.length ? (
              <EmptyState
                icon={
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
                title="Sem transações"
                description={
                  filters.search || filters.types?.length || filters.accountId || filters.categoryIds?.length
                    ? 'Nenhuma transação corresponde aos filtros activos.'
                    : filters.settled === true
                    ? 'Sem transações realizadas. Tens transações agendadas? Altera o filtro Estado para "Todas".'
                    : 'Adiciona a tua primeira transação ou importa um CSV do teu banco.'
                }
                action={<Button onClick={() => setCreateOpen(true)}>+ Nova transação</Button>}
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {data.content.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* ── Filter panel ── */}
      <aside className="w-56 shrink-0 sticky top-6">
        <Card>
          <TransactionFiltersPanel value={filters} onChange={setFilters} />
        </Card>
      </aside>

      {/* Modals */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nova transação" size="lg">
        <TransactionForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar transação" size="lg">
        {editTarget && (
          <TransactionForm transaction={editTarget} onSuccess={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={csvOpen} onClose={() => setCsvOpen(false)} title="Importar CSV" size="lg">
        <CsvImportModal onSuccess={() => setCsvOpen(false)} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover transação" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Tens a certeza que queres remover <strong>{deleteTarget?.description}</strong>?
        </p>
        {deleteTarget?.recurrenceGroupId && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4">
            🔁 Esta é uma transação recorrente. Podes remover só esta ocorrência ou todas as do grupo.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {deleteTarget?.recurrenceGroupId && (
            <Button variant="danger" className="w-full" isLoading={deleting} onClick={handleDeleteGroup}>
              Remover todas as ocorrências
            </Button>
          )}
          <Button variant="danger" className="w-full" isLoading={deleting} onClick={handleDelete}>
            {deleteTarget?.recurrenceGroupId ? 'Remover só esta' : 'Remover'}
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => setDeleteTarget(null)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

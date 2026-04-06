import { useState } from 'react';
import { useBudgets, useDeleteBudget } from '@/hooks/useBudgets';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { BudgetForm } from '@/components/budgets/BudgetForm';
import { formatCurrency } from '@/utils/currency';
import { currentYearMonth } from '@/utils/date';
import type { Budget } from '@/types/budget.types';

export function BudgetsPage() {
  const [month, setMonth] = useState(currentYearMonth());
  const { data: budgets, isLoading } = useBudgets(month);
  const { mutate: deleteBudget } = useDeleteBudget();
  const addToast = useUIStore((s) => s.addToast);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Budget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalBudgeted = budgets?.reduce((s, b) => s + b.amount, 0) ?? 0;
  const totalSpent = budgets?.reduce((s, b) => s + b.spent, 0) ?? 0;

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    deleteBudget(deleteTarget.id, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Orçamento removido' });
        setDeleteTarget(null);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao remover orçamento' }),
      onSettled: () => setDeleting(false),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Orçamentos</h2>
          <p className="text-sm text-gray-500">Controla os gastos por categoria</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button size="sm" onClick={() => setCreateOpen(true)}>+ Novo</Button>
        </div>
      </div>

      {/* Summary */}
      {budgets && budgets.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Orçado total</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBudgeted)}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gasto até agora</p>
            <p className={`text-2xl font-bold mt-1 ${totalSpent > totalBudgeted ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(totalSpent)}
            </p>
          </Card>
        </div>
      )}

      {/* Budget cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
        </div>
      ) : !budgets || budgets.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          title="Sem orçamentos"
          description={`Cria orçamentos mensais para controlar os gastos em ${month}.`}
          action={<Button onClick={() => setCreateOpen(true)}>+ Novo orçamento</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 group">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Novo orçamento">
        <BudgetForm defaultMonth={month} onSuccess={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar orçamento">
        {editTarget && (
          <BudgetForm budget={editTarget} defaultMonth={month} onSuccess={() => setEditTarget(null)} />
        )}
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover orçamento" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Remover orçamento de <strong>{deleteTarget?.categoryName}</strong>?
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

import { useState } from 'react';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { CategoryBadge } from '@/components/categories/CategoryBadge';
import type { Category } from '@/types/category.types';

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const addToast = useUIStore((s) => s.addToast);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const systemCategories = categories?.filter((c) => c.isSystem) ?? [];
  const customCategories = categories?.filter((c) => !c.isSystem) ?? [];

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleting(true);
    deleteCategory(deleteTarget.id, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Categoria removida' });
        setDeleteTarget(null);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao remover categoria' }),
      onSettled: () => setDeleting(false),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
          <p className="text-sm text-gray-500">Organiza as tuas transações por categoria</p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>+ Nova categoria</Button>
      </div>

      {/* Custom categories */}
      <Card title="As minhas categorias">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : customCategories.length === 0 ? (
          <EmptyState
            title="Sem categorias personalizadas"
            description="Cria categorias próprias para organizar melhor as tuas transações."
            action={<Button size="sm" onClick={() => setCreateOpen(true)}>+ Nova categoria</Button>}
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {customCategories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={cat} />
                  <span className="text-xs text-gray-500">
                    {cat.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditTarget(cat)}>
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(cat)}
                    className="text-red-600 hover:bg-red-50">
                    Remover
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* System categories */}
      <Card title="Categorias do sistema">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 py-1">
            {systemCategories.map((cat) => (
              <CategoryBadge key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </Card>

      {/* Create modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Nova categoria">
        <CategoryForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title="Editar categoria">
        {editTarget && (
          <CategoryForm category={editTarget} onSuccess={() => setEditTarget(null)} />
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remover categoria" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Tens a certeza que queres remover <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
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

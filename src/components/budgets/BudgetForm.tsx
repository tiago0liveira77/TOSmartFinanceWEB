import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateBudget, useUpdateBudget } from '@/hooks/useBudgets';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui.store';
import { currentYearMonth } from '@/utils/date';
import type { Budget } from '@/types/budget.types';

const schema = z.object({
  categoryId: z.string().uuid('Seleciona uma categoria'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Mês inválido'),
});

type FormData = z.infer<typeof schema>;

interface BudgetFormProps {
  budget?: Budget;
  defaultMonth?: string;
  onSuccess: () => void;
}

export function BudgetForm({ budget, defaultMonth, onSuccess }: BudgetFormProps) {
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: create, isPending: creating } = useCreateBudget();
  const { mutate: update, isPending: updating } = useUpdateBudget();
  const { data: categories } = useCategories();

  const expenseCategories = categories?.filter(
    (c) => c.type === 'EXPENSE' || c.type === 'ALL'
  ) ?? [];

  const categoryOptions = [
    { value: '', label: 'Seleciona uma categoria' },
    ...expenseCategories.map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: budget?.categoryId ?? '',
      amount: budget?.amount ?? undefined,
      month: defaultMonth ?? currentYearMonth(),
    },
  });

  const onSubmit = (data: FormData) => {
    if (budget) {
      update(
        { id: budget.id, data: { amount: data.amount } },
        {
          onSuccess: () => {
            addToast({ type: 'success', title: 'Orçamento actualizado' });
            onSuccess();
          },
          onError: () => addToast({ type: 'error', title: 'Erro ao actualizar orçamento' }),
        }
      );
    } else {
      create(data, {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Orçamento criado' });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao criar orçamento' }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Categoria"
        options={categoryOptions}
        error={errors.categoryId?.message}
        disabled={!!budget}
        {...register('categoryId')}
      />

      <Input
        label="Valor mensal (€)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount')}
      />

      <Input
        label="Mês"
        type="month"
        error={errors.month?.message}
        disabled={!!budget}
        {...register('month')}
      />

      <Button type="submit" className="w-full" isLoading={creating || updating}>
        {budget ? 'Guardar alterações' : 'Criar orçamento'}
      </Button>
    </form>
  );
}

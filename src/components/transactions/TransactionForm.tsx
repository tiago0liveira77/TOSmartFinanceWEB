import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateTransaction, useUpdateTransaction } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui.store';
import { toISODate } from '@/utils/date';
import type { Transaction } from '@/types/transaction.types';

const schema = z.object({
  accountId: z.string().uuid('Seleciona uma conta'),
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  description: z.string().min(2, 'Mínimo 2 caracteres').max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  categoryId: z.string().uuid().optional().or(z.literal('')),
  notes: z.string().max(2000).optional(),
  isRecurring: z.boolean().optional(),
  recurrenceRule: z.enum(['MONTHLY', 'BIMONTHLY']).optional(),
  occurrences: z.coerce.number().min(2).max(24).optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  transaction?: Transaction;
  defaultAccountId?: string;
  onSuccess: () => void;
}

const TYPE_OPTIONS = [
  { value: 'EXPENSE', label: '↓ Despesa' },
  { value: 'INCOME', label: '↑ Receita' },
  { value: 'TRANSFER', label: '⇄ Transferência' },
];

export function TransactionForm({ transaction, defaultAccountId, onSuccess }: TransactionFormProps) {
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: create, isPending: creating } = useCreateTransaction();
  const { mutate: update, isPending: updating } = useUpdateTransaction();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountId: transaction?.accountId ?? defaultAccountId ?? '',
      type: transaction?.type ?? 'EXPENSE',
      amount: transaction?.amount ?? undefined,
      description: transaction?.description ?? '',
      date: transaction?.date ?? toISODate(new Date()),
      categoryId: transaction?.categoryId ?? '',
      notes: transaction?.notes ?? '',
      isRecurring: false,
      recurrenceRule: 'MONTHLY',
      occurrences: 12,
    },
  });

  const isRecurringChecked = watch('isRecurring');

  const selectedType = watch('type');

  const accountOptions = [
    { value: '', label: 'Seleciona uma conta' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const categoryOptions = [
    { value: '', label: 'Sem categoria' },
    ...(
      categories
        ?.filter((c) => {
          if (selectedType === 'INCOME') return c.type === 'INCOME' || c.type === 'ALL';
          if (selectedType === 'EXPENSE') return c.type === 'EXPENSE' || c.type === 'ALL';
          return true;
        })
        .map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })) ?? []
    ),
  ];

  const onSubmit = (data: FormData) => {
    if (transaction) {
      const updatePayload = {
        description: data.description,
        amount: data.amount,
        categoryId: data.categoryId || undefined,
        notes: data.notes || undefined,
        date: data.date,
      };
      update(
        { id: transaction.id, data: updatePayload },
        {
          onSuccess: () => {
            addToast({ type: 'success', title: 'Transação actualizada' });
            onSuccess();
          },
          onError: () => addToast({ type: 'error', title: 'Erro ao actualizar transação' }),
        }
      );
    } else {
      const createPayload = {
        ...data,
        categoryId: data.categoryId || undefined,
        notes: data.notes || undefined,
        isRecurring: data.isRecurring ?? false,
        recurrenceRule: data.isRecurring ? data.recurrenceRule : undefined,
        occurrences: data.isRecurring ? data.occurrences : undefined,
      };
      create(createPayload, {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Transação criada' });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao criar transação' }),
      });
    }
  };

  const isEditing = !!transaction;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Tipo"
          options={TYPE_OPTIONS}
          error={errors.type?.message}
          disabled={isEditing}
          {...register('type')}
        />
        <Input
          label="Valor (€)"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount')}
        />
      </div>

      <Input
        label="Descrição"
        placeholder="Ex: Supermercado Continente"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Conta"
          options={accountOptions}
          error={errors.accountId?.message}
          disabled={isEditing}
          {...register('accountId')}
        />
        <Input
          label="Data"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <Select
        label="Categoria (opcional)"
        options={categoryOptions}
        {...register('categoryId')}
      />

      <Input
        label="Notas (opcional)"
        placeholder="Observações adicionais..."
        {...register('notes')}
      />

      {!isEditing && (
        <div className="space-y-3 border-t pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded" {...register('isRecurring')} />
            <span className="text-sm text-gray-700">Transação recorrente</span>
          </label>

          {isRecurringChecked && (
            <div className="grid grid-cols-2 gap-3 pl-1">
              <Select
                label="Frequência"
                options={[
                  { value: 'MONTHLY', label: 'Mensal' },
                  { value: 'BIMONTHLY', label: 'Bimensal (mês sim/não)' },
                ]}
                error={errors.recurrenceRule?.message}
                {...register('recurrenceRule')}
              />
              <Input
                label="Nº de meses"
                type="number"
                min="2"
                max="24"
                error={errors.occurrences?.message}
                {...register('occurrences')}
              />
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" isLoading={creating || updating}>
        {transaction ? 'Guardar alterações' : 'Criar transação'}
      </Button>
    </form>
  );
}

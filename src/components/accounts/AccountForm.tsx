import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateAccount, useUpdateAccount } from '@/hooks/useAccounts';
import { useUIStore } from '@/store/ui.store';
import type { Account } from '@/types/account.types';
import { cn } from '@/utils/cn';

const PRESET_COLORS = [
  '#6366f1', '#3b82f6', '#22c55e', '#eab308',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
];

const accountTypeOptions = [
  { value: 'CHECKING', label: 'Conta à ordem' },
  { value: 'SAVINGS', label: 'Poupança' },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito' },
  { value: 'INVESTMENT', label: 'Investimento' },
  { value: 'CASH', label: 'Dinheiro' },
];

const createSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(255),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'OTHER']),
  initialBalance: z.coerce.number().min(0, 'Valor deve ser ≥ 0'),
  currency: z.string().default('EUR'),
  color: z.string().optional(),
});

const updateSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(255),
  color: z.string().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;

interface AccountFormProps {
  account?: Account;
  onSuccess: () => void;
}

export function AccountForm({ account, onSuccess }: AccountFormProps) {
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: create, isPending: creating } = useCreateAccount();
  const { mutate: update, isPending: updating } = useUpdateAccount();
  const isEditing = !!account;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(isEditing ? updateSchema : createSchema) as never,
    defaultValues: {
      name: account?.name ?? '',
      type: account?.type ?? 'CHECKING',
      initialBalance: 0,
      currency: account?.currency ?? 'EUR',
      color: account?.color ?? PRESET_COLORS[0],
    },
  });

  const selectedColor = watch('color');

  const onSubmit = (data: CreateFormData) => {
    if (isEditing) {
      update(
        { id: account.id, data: { name: data.name, color: data.color } },
        {
          onSuccess: () => {
            addToast({ type: 'success', title: 'Conta actualizada' });
            onSuccess();
          },
          onError: () => addToast({ type: 'error', title: 'Erro ao actualizar conta' }),
        }
      );
    } else {
      create(data, {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Conta criada' });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao criar conta' }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome da conta"
        placeholder="Ex: Conta BPI, Poupança CGD..."
        error={errors.name?.message}
        {...register('name')}
      />

      {!isEditing && (
        <>
          <Select
            label="Tipo"
            options={accountTypeOptions}
            error={errors.type?.message}
            {...register('type')}
          />

          <Input
            label="Saldo inicial (€)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.initialBalance?.message}
            {...register('initialBalance')}
          />
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-transform',
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={creating || updating}>
        {isEditing ? 'Guardar alterações' : 'Criar conta'}
      </Button>
    </form>
  );
}

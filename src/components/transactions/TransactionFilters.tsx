import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAccounts } from '@/hooks/useAccounts';
import type { TransactionFilters } from '@/types/transaction.types';

interface TransactionFiltersProps {
  value: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

const TYPE_OPTIONS = [
  { value: '', label: 'Todos os tipos' },
  { value: 'INCOME', label: '↑ Receita' },
  { value: 'EXPENSE', label: '↓ Despesa' },
  { value: 'TRANSFER', label: '⇄ Transferência' },
];

export function TransactionFiltersBar({ value, onChange }: TransactionFiltersProps) {
  const { data: accounts } = useAccounts();

  const accountOptions = [
    { value: '', label: 'Todas as contas' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const hasFilters =
    value.search || value.type || value.accountId || value.categoryId ||
    value.startDate || value.endDate;

  const update = (partial: Partial<TransactionFilters>) =>
    onChange({ ...value, ...partial, page: 0 });

  const clear = () => onChange({ page: 0, size: value.size });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar descrição..."
            value={value.search ?? ''}
            onChange={(e) => update({ search: e.target.value || undefined })}
          />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="md" onClick={clear}>
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Select
          options={TYPE_OPTIONS}
          value={value.type ?? ''}
          onChange={(e) => update({ type: (e.target.value as TransactionFilters['type']) || undefined })}
        />
        <Select
          options={accountOptions}
          value={value.accountId ?? ''}
          onChange={(e) => update({ accountId: e.target.value || undefined })}
        />
        <Input
          type="date"
          placeholder="Data início"
          value={value.startDate ?? ''}
          onChange={(e) => update({ startDate: e.target.value || undefined })}
        />
        <Input
          type="date"
          placeholder="Data fim"
          value={value.endDate ?? ''}
          onChange={(e) => update({ endDate: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}

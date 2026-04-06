import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { TransactionFilters, TransactionType } from '@/types/transaction.types';

interface Props {
  value: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}

// ── Radio group (escolha exclusiva) ─────────────────────────────────────────

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function RadioGroup({ label, name, options, value, onChange }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </legend>
      <div className="space-y-0.5">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none transition-colors',
              value === opt.value
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="accent-primary-600 shrink-0"
            />
            <span className="truncate">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// ── Checkbox group (seleção múltipla) ────────────────────────────────────────

interface CheckboxGroupProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  emptyLabel?: string;
}

function CheckboxGroup({ label, options, selected, onChange, emptyLabel = 'Todos' }: CheckboxGroupProps) {
  const allSelected = selected.length === 0;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <fieldset>
      <div className="flex items-center justify-between mb-2">
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </legend>
        {!allSelected && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            limpar
          </button>
        )}
      </div>

      {allSelected && (
        <p className="text-sm text-gray-400 italic px-2 py-1">{emptyLabel}</p>
      )}

      <div className="space-y-0.5">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer text-sm select-none transition-colors',
                checked
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              )}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="accent-primary-600 rounded shrink-0"
              />
              <span className="truncate">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// ── Divisor ──────────────────────────────────────────────────────────────────

function Divider() {
  return <hr className="border-gray-100" />;
}

// ── Painel principal ─────────────────────────────────────────────────────────

export function TransactionFiltersPanel({ value, onChange }: Props) {
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const update = (partial: Partial<TransactionFilters>) =>
    onChange({ ...value, ...partial, page: 0 });

  const selectedTypes = value.types ?? [];
  const selectedCategoryIds = value.categoryIds ?? [];
  const accountValue = value.accountId ?? '';
  const settledValue = value.settled === undefined ? '' : String(value.settled);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedCategoryIds.length > 0 ||
    value.accountId ||
    value.startDate ||
    value.endDate ||
    value.settled !== true;

  const accountOptions = [
    { value: '', label: 'Todas' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  // Categorias filtradas pelo tipo selecionado
  const relevantCategories = (categories ?? []).filter((c) => {
    if (selectedTypes.length === 0) return true;
    if (selectedTypes.includes('INCOME') && (c.type === 'INCOME' || c.type === 'ALL')) return true;
    if (selectedTypes.includes('EXPENSE') && (c.type === 'EXPENSE' || c.type === 'ALL')) return true;
    return false;
  });

  const categoryOptions = relevantCategories.map((c) => ({
    value: c.id,
    label: `${c.icon} ${c.name}`,
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Filtros</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ page: 0, size: value.size, settled: true })}
            className="text-xs text-red-400 hover:text-red-600 px-1 h-auto py-0.5"
          >
            Repor
          </Button>
        )}
      </div>

      {/* Tipo — checkbox (múltipla seleção) */}
      <CheckboxGroup
        label="Tipo"
        options={[
          { value: 'EXPENSE', label: '↓ Despesa' },
          { value: 'INCOME', label: '↑ Receita' },
          { value: 'TRANSFER', label: '⇄ Transferência' },
        ]}
        selected={selectedTypes}
        onChange={(types) => update({ types: types as TransactionType[], categoryIds: [] })}
        emptyLabel="Todos os tipos"
      />

      <Divider />

      {/* Estado — radio (exclusivo) */}
      <RadioGroup
        label="Estado"
        name="settled"
        value={settledValue}
        options={[
          { value: 'true', label: 'Realizadas' },
          { value: 'false', label: 'Agendadas' },
          { value: '', label: 'Todas' },
        ]}
        onChange={(v) => update({ settled: v === '' ? undefined : v === 'true' })}
      />

      <Divider />

      {/* Conta — radio (exclusivo) */}
      <RadioGroup
        label="Conta"
        name="account"
        value={accountValue}
        options={accountOptions}
        onChange={(v) => update({ accountId: v || undefined })}
      />

      <Divider />

      {/* Categoria — checkbox (múltipla seleção) */}
      <CheckboxGroup
        label="Categoria"
        options={categoryOptions}
        selected={selectedCategoryIds}
        onChange={(ids) => update({ categoryIds: ids })}
        emptyLabel="Todas as categorias"
      />

      <Divider />

      {/* Período — date inputs */}
      <fieldset>
        <legend className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Período
        </legend>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">De</label>
            <Input
              type="date"
              value={value.startDate ?? ''}
              onChange={(e) => update({ startDate: e.target.value || undefined })}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Até</label>
            <Input
              type="date"
              value={value.endDate ?? ''}
              onChange={(e) => update({ endDate: e.target.value || undefined })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useBatchCreateTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui.store';
import { toISODate } from '@/utils/date';
import type { TransactionType } from '@/types/transaction.types';
import type { Category } from '@/types/category.types';

interface BulkTransactionModalProps {
  onSuccess: () => void;
}

interface BulkRow {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: string;
  categoryId: string;
}

interface RowErrors {
  date?: string;
  description?: string;
  amount?: string;
}

const TODAY = toISODate(new Date());
const MAX_ROWS = 50;

function makeRow(): BulkRow {
  return {
    id: crypto.randomUUID(),
    date: TODAY,
    type: 'EXPENSE',
    description: '',
    amount: '',
    categoryId: '',
  };
}

const TYPE_OPTIONS = [
  { value: 'EXPENSE',  label: '↓ Despesa' },
  { value: 'INCOME',   label: '↑ Receita' },
  { value: 'TRANSFER', label: '⇄ Transfer.' },
];

const AMOUNT_COLOR: Record<TransactionType, string> = {
  INCOME:   'text-green-600',
  EXPENSE:  'text-red-600',
  TRANSFER: 'text-blue-600',
};

function validateRow(row: BulkRow): RowErrors {
  const errors: RowErrors = {};
  if (!row.date) errors.date = 'Obrigatório';
  if (!row.description || row.description.trim().length < 2) errors.description = 'Mín. 2 caracteres';
  const amt = parseFloat(row.amount);
  if (!row.amount || isNaN(amt) || amt <= 0) errors.amount = 'Valor inválido';
  return errors;
}

function hasErrors(e: RowErrors) {
  return Object.keys(e).length > 0;
}

interface RowInputProps {
  row: BulkRow;
  errors: RowErrors;
  categories: Category[];
  onChange: (patch: Partial<BulkRow>) => void;
  onDelete: () => void;
  canDelete: boolean;
}

function BulkRowInput({ row, errors, categories, onChange, onDelete, canDelete }: RowInputProps) {
  const filteredCategories = categories.filter(
    (c) => c.type === row.type || c.type === 'ALL',
  );

  const fieldCls = (err?: string) =>
    `w-full text-xs px-1.5 py-1 rounded border focus:outline-none focus:ring-1 transition-colors ${
      err
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
        : 'border-gray-200 bg-white hover:border-gray-300 focus:border-primary-400 focus:ring-primary-200'
    }`;

  return (
    <tr className="group hover:bg-gray-50/50">
      {/* Date */}
      <td className="px-2 py-1.5 w-32">
        <div>
          <input
            type="date"
            value={row.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={fieldCls(errors.date)}
          />
          {errors.date && <p className="text-xs text-red-500 mt-0.5">{errors.date}</p>}
        </div>
      </td>
      {/* Type */}
      <td className="px-2 py-1.5 w-28">
        <select
          value={row.type}
          onChange={(e) => onChange({ type: e.target.value as TransactionType, categoryId: '' })}
          className={`${fieldCls()} ${AMOUNT_COLOR[row.type]} font-medium`}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </td>
      {/* Description */}
      <td className="px-2 py-1.5 min-w-[180px]">
        <div>
          <input
            type="text"
            value={row.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Ex: Supermercado…"
            className={fieldCls(errors.description)}
          />
          {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
        </div>
      </td>
      {/* Amount */}
      <td className="px-2 py-1.5 w-28">
        <div>
          <input
            type="number"
            value={row.amount}
            onChange={(e) => onChange({ amount: e.target.value })}
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className={`${fieldCls(errors.amount)} text-right tabular-nums ${AMOUNT_COLOR[row.type]}`}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-0.5">{errors.amount}</p>}
        </div>
      </td>
      {/* Category */}
      <td className="px-2 py-1.5 min-w-[130px]">
        <select
          value={row.categoryId}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          className={fieldCls()}
          title="Opcional — deixa em branco para a AI categorizar"
        >
          <option value="">✨ Auto (AI)</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </td>
      {/* Delete */}
      <td className="px-2 py-1.5 w-8 text-center">
        <button
          type="button"
          onClick={onDelete}
          disabled={!canDelete}
          className="text-gray-300 hover:text-red-400 disabled:opacity-0 transition-colors"
          title="Remover linha"
        >
          ×
        </button>
      </td>
    </tr>
  );
}

export function BulkTransactionModal({ onSuccess }: BulkTransactionModalProps) {
  const [accountId, setAccountId] = useState('');
  const [rows, setRows] = useState<BulkRow[]>(() => [makeRow(), makeRow(), makeRow()]);
  const [submitted, setSubmitted] = useState(false);

  const addToast = useUIStore((s) => s.addToast);
  const { data: accounts } = useAccounts();
  const { data: categories = [] } = useCategories();
  const { mutate: batchCreate, isPending } = useBatchCreateTransactions();

  const accountOptions = [
    { value: '', label: 'Seleciona uma conta' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const updateRow = (id: string, patch: Partial<BulkRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    // Nova linha herda data e tipo da última linha
    const last = rows[rows.length - 1];
    setRows((prev) => [...prev, { ...makeRow(), date: last.date, type: last.type }]);
  };

  const allErrors = rows.map((r) => (submitted ? validateRow(r) : {}));
  const anyInvalid = rows.some((r) => hasErrors(validateRow(r)));
  const validCount = rows.filter((r) => !hasErrors(validateRow(r))).length;

  const handleSubmit = () => {
    setSubmitted(true);
    if (!accountId || anyInvalid) return;

    const transactions = rows.map((r) => ({
      accountId,
      categoryId: r.categoryId || null,
      amount: parseFloat(r.amount),
      type: r.type,
      description: r.description.trim(),
      date: r.date,
    }));

    batchCreate(
      { transactions },
      {
        onSuccess: (data) => {
          addToast({
            type: 'success',
            title: `${data.created} transações criadas`,
            message: data.failed > 0 ? `${data.failed} falharam` : undefined,
          });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao criar transações' }),
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Conta global */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select
            label="Conta"
            options={accountOptions}
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-400 pt-5 shrink-0">
          {rows.length} {rows.length === 1 ? 'linha' : 'linhas'} · máx {MAX_ROWS}
        </div>
      </div>

      {/* Tabela */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-2 text-xs font-medium text-gray-500">Data</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-500">Tipo</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-500">Descrição</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-500 text-right">Valor (€)</th>
                <th className="px-2 py-2 text-xs font-medium text-gray-500">
                  Categoria
                  <span className="ml-1 text-gray-300 font-normal">(opcional)</span>
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row, idx) => (
                <BulkRowInput
                  key={row.id}
                  row={row}
                  errors={allErrors[idx]}
                  categories={categories}
                  onChange={(patch) => updateRow(row.id, patch)}
                  onDelete={() => deleteRow(row.id)}
                  canDelete={rows.length > 1}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Add row */}
        <div className="border-t border-gray-100 px-3 py-2 bg-gray-50">
          <button
            type="button"
            onClick={addRow}
            disabled={rows.length >= MAX_ROWS}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            + Adicionar linha
          </button>
        </div>
      </div>

      {/* Sumário de erros */}
      {submitted && (anyInvalid || !accountId) && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {!accountId
            ? 'Seleciona uma conta antes de continuar.'
            : `${rows.length - validCount} ${rows.length - validCount === 1 ? 'linha tem erros' : 'linhas têm erros'} — corrige antes de guardar.`}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button variant="secondary" className="flex-1" onClick={onSuccess} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={handleSubmit}
          isLoading={isPending}
          disabled={rows.length === 0}
        >
          Criar {rows.length} {rows.length === 1 ? 'transação' : 'transações'}
        </Button>
      </div>
    </div>
  );
}

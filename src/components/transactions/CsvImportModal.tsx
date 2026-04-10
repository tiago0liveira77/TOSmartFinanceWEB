import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useConfirmImport, usePreviewCSV } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useUIStore } from '@/store/ui.store';
import { formatCurrency } from '@/utils/currency';
import type { CsvPreviewResponse, CsvPreviewRow } from '@/types/transaction.types';

interface CsvImportModalProps {
  accountId?: string;
  onSuccess: () => void;
}

const PAGE_SIZE = 15;

const TYPE_CFG: Record<string, { label: string; cls: string }> = {
  INCOME:   { label: 'Receita',   cls: 'bg-green-100 text-green-700' },
  EXPENSE:  { label: 'Despesa',   cls: 'bg-red-100 text-red-700' },
  TRANSFER: { label: 'Transfer.', cls: 'bg-blue-100 text-blue-700' },
};

function TypeBadge({ type }: { type: string | null }) {
  if (!type) return <span className="text-gray-300 text-xs">—</span>;
  const cfg = TYPE_CFG[type] ?? { label: type, cls: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

interface RowProps {
  row: CsvPreviewRow;
  description: string;
  checked: boolean;
  onDescriptionChange: (v: string) => void;
  onToggle: () => void;
}

function PreviewRowItem({ row, description, checked, onDescriptionChange, onToggle }: RowProps) {
  const isValid = row.status === 'VALID';
  const amountColor =
    row.type === 'INCOME' ? 'text-green-600' :
    row.type === 'EXPENSE' ? 'text-red-600' :
    'text-blue-600';

  return (
    <>
      <tr className={
        !isValid ? 'bg-red-50' :
        checked   ? 'hover:bg-gray-50' :
                    'bg-gray-50 opacity-50'
      }>
        {/* Checkbox */}
        <td className="px-3 py-2 w-8">
          <input
            type="checkbox"
            checked={isValid ? checked : false}
            disabled={!isValid}
            onChange={onToggle}
            className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          />
        </td>
        {/* # */}
        <td className="px-2 py-2 text-xs text-gray-400 tabular-nums w-8">{row.lineNumber}</td>
        {/* Data */}
        <td className="px-3 py-2 text-xs font-mono text-gray-700 whitespace-nowrap w-28">
          {row.date ?? <span className="text-red-400">inválida</span>}
        </td>
        {/* Descrição — editável para linhas válidas */}
        <td className="px-3 py-2 min-w-[180px]">
          {isValid ? (
            <input
              type="text"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={!checked}
              className="w-full text-xs text-gray-900 bg-transparent border border-transparent rounded px-1 py-0.5
                         hover:border-gray-200 focus:border-primary-400 focus:bg-white focus:outline-none
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Clica para editar a descrição"
            />
          ) : (
            <span className="text-xs text-gray-400 block truncate max-w-[200px]">
              {row.description || '—'}
            </span>
          )}
        </td>
        {/* Valor */}
        <td className="px-3 py-2 text-xs tabular-nums text-right whitespace-nowrap w-24">
          {row.amount != null
            ? <span className={amountColor}>{formatCurrency(row.amount)}</span>
            : <span className="text-red-400">inválido</span>}
        </td>
        {/* Tipo */}
        <td className="px-3 py-2 w-24">
          <TypeBadge type={row.type} />
        </td>
        {/* Estado */}
        <td className="px-3 py-2 text-center w-8">
          {isValid
            ? <span className="text-green-500 text-sm leading-none">✓</span>
            : <span className="text-red-500 text-sm leading-none">✗</span>}
        </td>
      </tr>
      {!isValid && row.errors.length > 0 && (
        <tr className="bg-red-50">
          <td colSpan={7} className="px-3 pb-2 pt-0">
            {row.errors.map((err, i) => (
              <p key={i} className="text-xs text-red-600">• {err}</p>
            ))}
          </td>
        </tr>
      )}
    </>
  );
}

export function CsvImportModal({ accountId: fixedAccountId, onSuccess }: CsvImportModalProps) {
  const [step, setStep] = useState<'upload' | 'preview'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState(fixedAccountId ?? '');
  const [preview, setPreview] = useState<CsvPreviewResponse | null>(null);
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [checkedLines, setCheckedLines] = useState<Set<number>>(new Set());
  const [previewPage, setPreviewPage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToast = useUIStore((s) => s.addToast);
  const { data: accounts } = useAccounts();
  const { mutate: previewCsv, isPending: isPreviewing } = usePreviewCSV();
  const { mutate: confirmImport, isPending: isImporting } = useConfirmImport();

  const accountOptions = [
    { value: '', label: 'Seleciona uma conta' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(null);
      setStep('upload');
    }
  };

  const handlePreview = () => {
    if (!file || !selectedAccountId) return;
    previewCsv(
      { file, accountId: selectedAccountId },
      {
        onSuccess: (data) => {
          const descs: Record<number, string> = {};
          const checked = new Set<number>();
          data.rows.forEach((row) => {
            if (row.status === 'VALID') {
              descs[row.lineNumber] = row.description;
              checked.add(row.lineNumber);
            }
          });
          setDescriptions(descs);
          setCheckedLines(checked);
          setPreview(data);
          setPreviewPage(0);
          setStep('preview');
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao ler CSV' }),
      }
    );
  };

  const handleConfirm = () => {
    if (!preview || !selectedAccountId) return;
    const transactions = preview.rows
      .filter((row) => row.status === 'VALID' && checkedLines.has(row.lineNumber))
      .map((row) => ({
        date: row.date!,
        description: (descriptions[row.lineNumber] ?? row.description).trim(),
        amount: row.amount!,
        type: row.type!,
      }));

    confirmImport(
      { accountId: selectedAccountId, transactions },
      {
        onSuccess: (data) => {
          addToast({
            type: 'success',
            title: `${data.imported} transações importadas`,
            message: data.failed > 0 ? `${data.failed} linhas ignoradas` : undefined,
          });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao importar' }),
      }
    );
  };

  // ── Passo 1: Upload ──────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <p className="text-sm text-gray-600 mb-3">
            Importa transações a partir de um ficheiro CSV. Formato esperado:
          </p>
          <code className="block bg-gray-50 rounded-lg p-3 text-xs text-gray-700 font-mono whitespace-pre">
            {'date,description,amount,type\n2024-01-15,"Supermercado",-45.30,EXPENSE\n2024-01-16,"Salário",1800.00,INCOME'}
          </code>
        </div>

        {!fixedAccountId && (
          <Select
            label="Conta de destino"
            options={accountOptions}
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
          />
        )}

        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={handleFileChange}
          />
          {file ? (
            <div>
              <p className="text-sm font-medium text-gray-900">📄 {file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500">Clica para seleccionar ficheiro CSV</p>
              <p className="text-xs text-gray-400 mt-1">Máximo 10 MB</p>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          onClick={handlePreview}
          disabled={!file || !selectedAccountId}
          isLoading={isPreviewing}
        >
          Pré-visualizar
        </Button>
      </div>
    );
  }

  // ── Passo 2: Preview ─────────────────────────────────────────────────────
  if (!preview) return null;

  const validLines = preview.rows
    .filter((r) => r.status === 'VALID')
    .map((r) => r.lineNumber);
  const checkedCount = validLines.filter((ln) => checkedLines.has(ln)).length;
  const allChecked = validLines.length > 0 && checkedCount === validLines.length;
  const someChecked = checkedCount > 0 && checkedCount < validLines.length;

  const toggleAll = () => {
    if (allChecked) {
      setCheckedLines(new Set());
    } else {
      setCheckedLines(new Set(validLines));
    }
  };

  const toggleLine = (lineNumber: number) => {
    setCheckedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) next.delete(lineNumber);
      else next.add(lineNumber);
      return next;
    });
  };

  const totalPages = Math.ceil(preview.rows.length / PAGE_SIZE);
  const currentRows = preview.rows.slice(previewPage * PAGE_SIZE, (previewPage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Sumário */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-lg text-sm font-medium">
          ✓ {preview.validCount} {preview.validCount === 1 ? 'válida' : 'válidas'}
        </span>
        {preview.invalidCount > 0 && (
          <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium">
            ✗ {preview.invalidCount} com erro
          </span>
        )}
        {checkedCount < validLines.length && (
          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1.5 rounded-lg">
            {validLines.length - checkedCount} excluída{validLines.length - checkedCount !== 1 ? 's' : ''}
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto hidden sm:block">
          Edita as descrições · desmarca para excluir
        </span>
      </div>

      {/* Tabela */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {/* Select-all checkbox */}
                <th className="px-3 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    title={allChecked ? 'Desmarcar todas' : 'Selecionar todas'}
                  />
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-500">#</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">Data</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">
                  Descrição
                  <span className="ml-1 text-gray-300 font-normal">(editável)</span>
                </th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500 text-right">Valor</th>
                <th className="px-3 py-2 text-xs font-medium text-gray-500">Tipo</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRows.map((row) => (
                <PreviewRowItem
                  key={row.lineNumber}
                  row={row}
                  description={descriptions[row.lineNumber] ?? row.description}
                  checked={checkedLines.has(row.lineNumber)}
                  onDescriptionChange={(val) =>
                    setDescriptions((prev) => ({ ...prev, [row.lineNumber]: val }))
                  }
                  onToggle={() => toggleLine(row.lineNumber)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 bg-gray-50">
            <Button variant="ghost" size="sm" disabled={previewPage === 0}
              onClick={() => setPreviewPage((p) => p - 1)}>
              ← Anterior
            </Button>
            <span className="text-xs text-gray-500">
              Página {previewPage + 1} de {totalPages}
            </span>
            <Button variant="ghost" size="sm" disabled={previewPage === totalPages - 1}
              onClick={() => setPreviewPage((p) => p + 1)}>
              Próxima →
            </Button>
          </div>
        )}
      </div>

      {preview.invalidCount > 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          As {preview.invalidCount} {preview.invalidCount === 1 ? 'linha inválida será ignorada' : 'linhas inválidas serão ignoradas'} na importação.
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button variant="secondary" className="flex-1" onClick={() => setStep('upload')} disabled={isImporting}>
          ← Voltar
        </Button>
        <Button
          className="flex-1"
          onClick={handleConfirm}
          isLoading={isImporting}
          disabled={checkedCount === 0}
        >
          Importar {checkedCount} {checkedCount === 1 ? 'transação' : 'transações'}
        </Button>
      </div>
    </div>
  );
}

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useImportCSV } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useUIStore } from '@/store/ui.store';

interface CsvImportModalProps {
  accountId?: string;   // se fornecido, salta a seleção de conta
  onSuccess: () => void;
}

export function CsvImportModal({ accountId: fixedAccountId, onSuccess }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState(fixedAccountId ?? '');
  const [result, setResult] = useState<{ imported: number; failed: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: importCsv, isPending } = useImportCSV();
  const { data: accounts } = useAccounts();

  const accountOptions = [
    { value: '', label: 'Seleciona uma conta' },
    ...(accounts?.map((a) => ({ value: a.id, label: a.name })) ?? []),
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setResult(null);
    }
  };

  const handleImport = () => {
    if (!file || !selectedAccountId) return;
    importCsv(
      { file, accountId: selectedAccountId },
      {
        onSuccess: (data) => {
          setResult(data);
          addToast({
            type: 'success',
            title: `${data.imported} transações importadas`,
            message: data.failed > 0 ? `${data.failed} linhas com erro` : undefined,
          });
          if (data.failed === 0) onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao importar CSV' }),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Importa transações a partir de um ficheiro CSV. Formato esperado:
        </p>
        <code className="block bg-gray-50 rounded-lg p-3 text-xs text-gray-700 font-mono">
          date,description,amount,type{'\n'}
          2024-01-15,"Supermercado",-45.30,EXPENSE{'\n'}
          2024-01-16,"Salário",1800.00,INCOME
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

      {result && (
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-sm font-medium text-green-800">
            ✓ {result.imported} transações importadas com sucesso
          </p>
          {result.failed > 0 && (
            <p className="text-xs text-yellow-700 mt-1">
              ⚠ {result.failed} linhas ignoradas por erro de formato
            </p>
          )}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleImport}
        disabled={!file || !selectedAccountId}
        isLoading={isPending}
      >
        Importar
      </Button>
    </div>
  );
}

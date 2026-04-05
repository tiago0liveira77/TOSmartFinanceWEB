import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function TransactionsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Transações</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">↑ Importar CSV</Button>
          <Button size="sm">+ Nova</Button>
        </div>
      </div>
      <Card>
        <EmptyState
          icon={
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title="Sem transações"
          description="Adiciona a tua primeira transação ou importa um CSV do teu banco."
          action={<Button>+ Nova transação</Button>}
        />
      </Card>
    </div>
  );
}

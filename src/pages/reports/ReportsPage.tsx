import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function ReportsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Relatórios</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Despesas por Categoria">
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card title="Tendência Mensal">
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>
    </div>
  );
}

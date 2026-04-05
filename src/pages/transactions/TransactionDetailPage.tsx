import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Detalhe da Transação</h2>
      <Card>
        <p className="text-sm text-gray-500">ID: {id}</p>
        <Skeleton className="h-32 w-full mt-4" />
      </Card>
    </div>
  );
}

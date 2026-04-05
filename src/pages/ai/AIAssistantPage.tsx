import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function AIAssistantPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Assistente IA</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Insights">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </Card>
        <Card title="Chat Financeiro">
          <div className="flex flex-col h-64">
            <div className="flex-1">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

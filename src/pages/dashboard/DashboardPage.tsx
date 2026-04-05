import { useAuthStore } from '@/store/auth.store';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Bom dia, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-sm text-gray-500">Aqui está o resumo das tuas finanças.</p>
      </div>

      {/* KPI Cards skeleton — to be replaced in Sprint 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['Receitas', 'Despesas', 'Saldo', 'Poupança'].map((label) => (
          <Card key={label}>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
            <Skeleton className="h-7 w-24 mt-2" />
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Despesas por Categoria">
          <Skeleton className="h-48 w-full" />
        </Card>
        <Card title="Tendência Mensal">
          <Skeleton className="h-48 w-full" />
        </Card>
      </div>

      {/* Bottom section placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Últimas Transações">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </Card>
        <Card title="Status Orçamentos">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

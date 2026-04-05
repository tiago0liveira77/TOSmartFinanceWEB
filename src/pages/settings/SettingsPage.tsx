import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth.store';

export function SettingsPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Definições</h2>
      <Card title="Perfil">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium text-gray-700">Nome: </span>
            <span className="text-gray-600">{user?.name}</span>
          </p>
          <p className="text-sm">
            <span className="font-medium text-gray-700">Email: </span>
            <span className="text-gray-600">{user?.email}</span>
          </p>
        </div>
      </Card>
    </div>
  );
}

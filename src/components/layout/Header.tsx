import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants/routes';

const routeLabels: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.ACCOUNTS]: 'Contas',
  [ROUTES.TRANSACTIONS]: 'Transações',
  [ROUTES.CATEGORIES]: 'Categorias',
  [ROUTES.BUDGETS]: 'Orçamentos',
  [ROUTES.REPORTS]: 'Relatórios',
  [ROUTES.AI]: 'Assistente IA',
  [ROUTES.SETTINGS]: 'Definições',
};

export function Header() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const pageTitle = routeLabels[location.pathname] ?? 'SmartFinance';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-base font-semibold text-gray-900 flex-1">{pageTitle}</h1>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="relative group">
            <button className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 hidden group-hover:block z-10">
              <button
                onClick={logout}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                Terminar sessão
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

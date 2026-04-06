import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CategorySummary } from '@/types/report.types';

interface ExpensesByCategoryProps {
  data: CategorySummary[];
}

const DEFAULT_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: CategorySummary }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-medium text-gray-900">{item.name}</p>
      <p className="text-gray-600">{formatCurrency(item.value)}</p>
      <p className="text-gray-500">{item.payload.percentage.toFixed(1)}%</p>
    </div>
  );
}

export function ExpensesByCategory({ data }: ExpensesByCategoryProps) {
  if (!data.length) {
    return <EmptyState title="Sem dados" description="Nenhuma despesa registada neste período." />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="categoryName"
          cx="50%"
          cy="45%"
          outerRadius={90}
          innerRadius={50}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.categoryId}
              fill={entry.categoryColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

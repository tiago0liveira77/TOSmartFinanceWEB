import { cn } from '@/utils/cn';
import type { Category } from '@/types/category.types';

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'icon' | 'color'>;
  size?: 'sm' | 'md';
  className?: string;
}

export function CategoryBadge({ category, size = 'md', className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        className
      )}
      style={{
        backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
        color: category.color ?? '#6b7280',
      }}
    >
      <span>{category.icon}</span>
      <span>{category.name}</span>
    </span>
  );
}

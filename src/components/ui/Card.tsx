import { cn } from '@/utils/cn';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  padding?: boolean;
}

export function Card({ className, children, title, footer, padding = true }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={cn(padding && 'p-4')}>{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">{footer}</div>
      )}
    </div>
  );
}

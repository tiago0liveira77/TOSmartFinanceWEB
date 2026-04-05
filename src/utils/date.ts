import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { pt } from 'date-fns/locale';

export function formatDate(date: string | Date, pattern = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern, { locale: pt });
}

export function formatMonthYear(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM yyyy', { locale: pt });
}

export function getMonthRange(yearMonth: string): { start: string; end: string } {
  const date = parseISO(`${yearMonth}-01`);
  return {
    start: format(startOfMonth(date), 'yyyy-MM-dd'),
    end: format(endOfMonth(date), 'yyyy-MM-dd'),
  };
}

export function currentYearMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

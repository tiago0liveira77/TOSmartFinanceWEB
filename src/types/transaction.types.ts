export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type RecurrenceRule = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categoryColor: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  notes: string | null;
  date: string;
  isRecurring: boolean;
  aiCategorized: boolean;
  aiConfidence: number | null;
  createdAt: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  page?: number;
  size?: number;
}

export interface CreateTransactionDto {
  accountId: string;
  categoryId?: string;
  amount: number;
  type: TransactionType;
  description: string;
  notes?: string;
  date: string;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}

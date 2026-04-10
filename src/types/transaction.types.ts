export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type RecurrenceRule = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'YEARLY';

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
  recurrenceRule: RecurrenceRule | null;
  recurrenceGroupId: string | null;
  settled: boolean;
  aiCategorized: boolean;
  aiConfidence: number | null;
  createdAt: string;
}

export interface TransactionFilters {
  accountId?: string;
  categoryIds?: string[];
  types?: TransactionType[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  settled?: boolean;
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
  occurrences?: number;
}

export interface UpdateTransactionDto {
  description?: string;
  amount?: number;
  categoryId?: string;
  notes?: string;
  date?: string;
}

export interface CsvConfirmRow {
  date: string;
  description: string;
  amount: number;
  type: string;
}

export interface CsvConfirmRequest {
  accountId: string;
  transactions: CsvConfirmRow[];
}

export interface CsvPreviewRow {
  lineNumber: number;
  status: 'VALID' | 'INVALID';
  date: string | null;
  description: string;
  amount: number | null;
  type: string | null;
  errors: string[];
}

export interface CsvPreviewResponse {
  total: number;
  validCount: number;
  invalidCount: number;
  rows: CsvPreviewRow[];
}

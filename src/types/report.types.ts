export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon?: string;    // não devolvido pelo backend — omitir ou usar fallback
  categoryColor?: string;   // não devolvido pelo backend — omitir ou usar fallback
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  topCategories: CategorySummary[];
  comparedToPreviousMonth?: {   // campo opcional — pode não vir do backend
    incomeChange: number;
    expensesChange: number;
  };
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface ForecastMonth {
  month: string;
  predictedExpenses: number;
  predictedIncome: number;
  confidence: number;
}

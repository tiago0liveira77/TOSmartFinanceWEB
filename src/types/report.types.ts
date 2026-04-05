export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
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
  comparedToPreviousMonth: {
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

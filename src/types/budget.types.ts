// Tipo completo com campos calculados — mapeado de /reports/budget-status
export interface Budget {
  id: string;           // mapeado de budgetId
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;       // mapeado de budgetAmount
  spent: number;
  remaining: number;
  percentage: number;
  month: string;
  createdAt: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
  month: string;        // formato "YYYY-MM"
}

export interface UpdateBudgetDto {
  amount?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  month: string;
  createdAt: string;
}

export interface CreateBudgetDto {
  categoryId: string;
  amount: number;
  month: string;
}

export interface UpdateBudgetDto {
  amount?: number;
}

import type { TransactionType } from './transaction.types';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'ALL';
  isDefault: boolean;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'ALL';
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

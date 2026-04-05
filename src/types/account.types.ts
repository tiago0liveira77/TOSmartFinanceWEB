export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH' | 'OTHER';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  initialBalance: number;
  currency?: string;
  color?: string;
  icon?: string;
}

export interface UpdateAccountDto {
  name?: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

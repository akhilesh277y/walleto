
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type Category = 
  | 'Food' | 'Transport' | 'Housing' | 'Entertainment' 
  | 'Health' | 'Utilities' | 'Shopping' | 'Salary' | 'Investment' | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface BudgetState {
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

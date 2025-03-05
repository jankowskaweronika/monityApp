import { ReactNode } from "react";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export type ExpenseListProps = {
  expenses: Expense[];
}

export type DashboardLayoutProps = {
  children: ReactNode;
}

export type RootLayoutProps = {
  children: ReactNode;
}

export type ExpenseDataItem = {
  category: string;
  value: number;
  color: string;
}

export type PieChartExpenseProps = {
  data: ExpenseDataItem[];
}
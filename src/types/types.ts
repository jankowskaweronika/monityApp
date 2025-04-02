import { ReactNode } from "react";

export type ButtonProps = {
  startIcon?: ReactNode,
}

export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  percentage?: number;
  amount: number;
}

export type ExpenseSummary = {
  categories: ExpenseCategory[];
  totalAmount: number;
  month: string;
  year: number;
}

export type PieChartData = {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

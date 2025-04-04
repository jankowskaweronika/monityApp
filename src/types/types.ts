export type ExpenseCategoryItem = {
  name: string;
  value: number;
  color: string;
}

export type ExpenseSummaryProps = {
  categories: ExpenseCategoryItem[];
  totalAmount: number;
}

export type ExpenseChartProps = {
  expenseSummary: ExpenseSummaryProps;
}
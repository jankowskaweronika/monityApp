import { ExpenseCategoryItem, ExpenseSummaryProps } from "../types/types";

export const categoryColors = {
  Jedzenie: "#F87171",
  Transport: "#60A5FA",
  Rozrywka: "#FCD34D",
  Mieszkanie: "#67E8F9",
  Zakupy: "#A78BFA",
  Zdrowie: "#FDBA74",
};

export const mockExpenseCategories: ExpenseCategoryItem[] = [
  {
    name: "Jedzenie",
    value: 850,
    color: categoryColors.Jedzenie
  },
  {
    name: "Transport",
    value: 300,
    color: categoryColors.Transport
  },
  {
    name: "Rozrywka",
    value: 450,
    color: categoryColors.Rozrywka
  },
  {
    name: "Mieszkanie",
    value: 1200,
    color: categoryColors.Mieszkanie
  },
  {
    name: "Zakupy",
    value: 600,
    color: categoryColors.Zakupy
  },
  {
    name: "Zdrowie",
    value: 200,
    color: categoryColors.Zdrowie
  }
];

export const mockExpenseSummary: ExpenseSummaryProps = {
  categories: mockExpenseCategories,
  totalAmount: 3600
};
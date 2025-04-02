import { ExpenseCategory, ExpenseSummary } from "../types/types";

export const categoryColors = {
  Jedzenie: "#F87171", // czerwony
  Transport: "#60A5FA", // niebieski
  Rozrywka: "#FCD34D", // żółty
  Mieszkanie: "#67E8F9", // turkusowy
  Zakupy: "#A78BFA", // fioletowy
  Zdrowie: "#FDBA74", // pomarańczowy
};

export const mockCategories: ExpenseCategory[] = [
  {
    id: "1",
    name: "Jedzenie",
    color: categoryColors.Jedzenie,
    percentage: 24,
    amount: 850
  },
  {
    id: "2",
    name: "Transport",
    color: categoryColors.Transport,
    percentage: 8,
    amount: 300
  },
  {
    id: "3",
    name: "Rozrywka",
    color: categoryColors.Rozrywka,
    percentage: 13,
    amount: 450
  },
  {
    id: "4",
    name: "Mieszkanie",
    color: categoryColors.Mieszkanie,
    percentage: 33,
    amount: 1200
  },
  {
    id: "5",
    name: "Zakupy",
    color: categoryColors.Zakupy,
    percentage: 17,
    amount: 600
  },
  {
    id: "6",
    name: "Zdrowie",
    color: categoryColors.Zdrowie,
    percentage: 6,
    amount: 200
  }
];

export const mockExpenseSummary: ExpenseSummary = {
  categories: mockCategories,
  totalAmount: 3600,
  month: "Kwiecień",
  year: 2025
};
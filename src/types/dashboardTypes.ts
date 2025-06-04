// src/types/dashboard.ts
import { 
  ExpenseSummaryResponse, 
  ExpenseWithCategory, 
  Tables, 
  CreateExpenseCommand,
  PeriodInfo 
} from './types';

export type { ExpenseSummaryResponse, ExpenseWithCategory, Tables, CreateExpenseCommand, PeriodInfo };

// Dashboard ViewModel
export interface DashboardData {
  summary: ExpenseSummaryResponse;
  recentExpenses: ExpenseWithCategory[];
  availableCategories: Tables<"categories">[];
  currentPeriod: PeriodInfo;
  isLoading: boolean;
  error?: string;
}

// Chart Data for Recharts
export interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  categoryId: string;
  percentage: number;
}

// Form ViewModel for AddExpenseModal
export interface AddExpenseFormData {
  amount: string;
  categoryId: string;
  date: string;
  description: string;
}

// Form Validation Errors
export interface FormValidationErrors {
  amount?: string;
  categoryId?: string;
  date?: string;
  description?: string;
}

// Period Summary Data
export interface PeriodSummaryData {
  currentAmount: number;
  previousAmount?: number;
  trendDirection: "up" | "down" | "stable";
  changePercentage?: number;
  expenseCount: number;
}

// Loading States
export type LoadingState = {
  summary: boolean;
  expenses: boolean;
  categories: boolean;
  addingExpense: boolean;
};

// Error States
export interface DashboardError {
  type: 'network' | 'authentication' | 'validation' | 'unknown';
  message: string;
  details?: Record<string, unknown>;
}

// Handlers
export type ChartInteractionHandler = (categoryId: string) => void;
export type ModalHandler = () => void;
export type PeriodChangeHandler = (period: string) => void;
export type ExpenseSubmitHandler = (data: CreateExpenseCommand) => Promise<void>;
import { Tables, TablesInsert, TablesUpdate } from './db/database.types';

// Common Types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages?: number; 
  has_prev?: boolean; 
}

// Query Parameter Types
export interface ListCategoriesQuery {
  include_default?: boolean;
  page?: number;
  limit?: number;
}

export interface ListExpensesQuery {
  start_date?: string;
  end_date?: string;
  category_id?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface AnalyticsQuery {
  period: string;
  start_date?: string;
  end_date?: string;
}

// Categories DTOs and Commands
export interface ListCategoriesResponse {
  data: Tables<'categories'>[];
  meta: PaginationMeta;
}

export type CreateCategoryCommand = Pick<
  TablesInsert<'categories'>,
  'name' | 'description' | 'color' | 'is_default'
>;

export type UpdateCategoryCommand = Partial<
  Omit<TablesUpdate<'categories'>, 'id'>
> & { id: string };

// Expenses DTOs and Commands
export interface ExpenseWithCategory extends Tables<'expenses'> {
  category: Pick<Tables<'categories'>, 'id' | 'name' | 'color'>;
}

export interface ListExpensesResponse {
  data: ExpenseWithCategory[];
  meta: PaginationMeta;
}

export type CreateExpenseCommand = Pick<
  TablesInsert<'expenses'>,
  'category_id' | 'amount' | 'description' | 'date'
>;

export type UpdateExpenseCommand = Partial<
  Omit<TablesUpdate<'expenses'>, 'id'>
> & { id: string };

// Analytics DTOs
export interface CategoryBreakdown {
  category_id: string;
  category_name: string;
  category_color: string;
  amount: number;
  percentage: number;
}

export interface PeriodInfo {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface ExpenseSummaryResponse {
  total_amount: number;
  category_breakdown: CategoryBreakdown[];
  period: PeriodInfo;
}

export interface TrendPoint {
  period: string;
  amount: number;
  date: string;
}

export interface CategoryTrendsResponse {
  category: Pick<Tables<'categories'>, 'id' | 'name' | 'color'>;
  trends: TrendPoint[];
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  }
}

// Reporting Periods DTOs
export type ListReportingPeriodsResponse = Tables<'reporting_periods'>[];

export interface CreatedResponse<T> {
  data: T;
  message?: string;
}

export interface NoContentResponse {
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationErrorResponse {
  errors: ValidationError[];
} 
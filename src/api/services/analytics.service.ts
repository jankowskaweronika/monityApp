import { supabase } from '../../db/supabase.client';
import { 
  AnalyticsQuery, 
  ExpenseSummaryResponse, 
  CategoryTrendsResponse,
  CategoryBreakdown,
  PeriodInfo,
  TrendPoint
} from '../../types/types';
import { z } from 'zod';
import { SupabaseError } from '../utils/supabase.error';

// Validation schemas
export const analyticsQuerySchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional()
});

export class AnalyticsService {
  private async getPeriodInfo(query: AnalyticsQuery): Promise<PeriodInfo> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (query.period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setDate(1));
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        throw new Error('Invalid period');
    }

    if (query.start_date) {
      startDate = new Date(query.start_date);
    }
    if (query.end_date) {
      endDate = new Date(query.end_date);
    }

    return {
      id: query.period,
      name: query.period.charAt(0).toUpperCase() + query.period.slice(1),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };
  }

  async getExpenseSummary(query: AnalyticsQuery): Promise<ExpenseSummaryResponse> {
    const validatedQuery = analyticsQuerySchema.parse(query);
    const period = await this.getPeriodInfo(validatedQuery);

    const { data, error } = await supabase
      .from('expenses')
      .select(`
        amount,
        category:categories (
          id,
          name,
          color
        )
      `)
      .gte('date', period.start_date)
      .lte('date', period.end_date);

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    // Calculate total and category breakdown
    const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);
    const categoryMap = new Map<string, CategoryBreakdown>();

    data.forEach(expense => {
      const category = expense.category;
      const existing = categoryMap.get(category.id) || {
        category_id: category.id,
        category_name: category.name,
        category_color: category.color,
        amount: 0,
        percentage: 0
      };

      existing.amount += expense.amount;
      categoryMap.set(category.id, existing);
    });

    // Calculate percentages
    const breakdown = Array.from(categoryMap.values()).map(item => ({
      ...item,
      percentage: totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0
    }));

    return {
      total_amount: totalAmount,
      category_breakdown: breakdown,
      period
    };
  }

  async getCategoryTrends(query: AnalyticsQuery): Promise<CategoryTrendsResponse[]> {
    const validatedQuery = analyticsQuerySchema.parse(query);
    const period = await this.getPeriodInfo(validatedQuery);

    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, color');

    if (categoriesError) {
      throw SupabaseError.fromPostgrestError(categoriesError);
    }

    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('amount, date, category_id')
      .gte('date', period.start_date)
      .lte('date', period.end_date);

    if (expensesError) {
      throw SupabaseError.fromPostgrestError(expensesError);
    }

    // Group expenses by category and date
    const trendsByCategory = new Map<string, Map<string, number>>();
    
    expenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      const categoryTrends = trendsByCategory.get(expense.category_id) || new Map();
      const currentAmount = categoryTrends.get(date) || 0;
      categoryTrends.set(date, currentAmount + expense.amount);
      trendsByCategory.set(expense.category_id, categoryTrends);
    });

    // Format response
    return categories.map(category => {
      const categoryTrends = trendsByCategory.get(category.id) || new Map();
      const trends: TrendPoint[] = Array.from(categoryTrends.entries()).map(([date, amount]) => ({
        period: date,
        amount,
        date
      }));

      return {
        category: {
          id: category.id,
          name: category.name,
          color: category.color
        },
        trends: trends.sort((a, b) => a.date.localeCompare(b.date))
      };
    });
  }
} 
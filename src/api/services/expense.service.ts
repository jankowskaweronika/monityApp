import { supabase } from '../../db/supabase.client';
import { 
  ListExpensesQuery, 
  ListExpensesResponse, 
  CreateExpenseCommand, 
  UpdateExpenseCommand,
  ExpenseWithCategory 
} from '../../types/types';
import { z } from 'zod';
import { SupabaseError } from '../utils/supabase.error';

// Validation schemas
export const listExpensesQuerySchema = z.object({
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  category_id: z.string().uuid().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sort_by: z.enum(['date', 'amount', 'created_at']).optional().default('date'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
});

export const createExpenseSchema = z.object({
  category_id: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .transform(date => `${date}T00:00:00.000Z`) // Convert to ISO datetime
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.string().uuid()
});

export class ExpenseService {
  async listExpenses(query: ListExpensesQuery): Promise<ListExpensesResponse> {
    const validatedQuery = listExpensesQuerySchema.parse(query);
    
    let supabaseQuery = supabase
      .from('expenses')
      .select(`
        *,
        category:categories (
          id,
          name,
          color
        )
      `, { count: 'exact' });

    // Apply filters
    if (validatedQuery.start_date) {
      supabaseQuery = supabaseQuery.gte('date', validatedQuery.start_date);
    }
    if (validatedQuery.end_date) {
      supabaseQuery = supabaseQuery.lte('date', validatedQuery.end_date);
    }
    if (validatedQuery.category_id) {
      supabaseQuery = supabaseQuery.eq('category_id', validatedQuery.category_id);
    }

    // Apply sorting
    supabaseQuery = supabaseQuery.order(
      validatedQuery.sort_by,
      { ascending: validatedQuery.sort_order === 'asc' }
    );

    const { data, error, count } = await supabaseQuery
      .range(
        (validatedQuery.page - 1) * validatedQuery.limit,
        validatedQuery.page * validatedQuery.limit - 1
      );

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    return {
      data: (data || []) as ExpenseWithCategory[],
      meta: {
        total: count || 0,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total_pages: count ? Math.ceil(count / validatedQuery.limit) : 0,
        has_prev: validatedQuery.page > 1
      }
    };
  }

  async createExpense(command: CreateExpenseCommand) {
    const validatedData = createExpenseSchema.parse(command);
    
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new SupabaseError(
        'UNAUTHORIZED',
        'User must be authenticated to create expenses'
      );
    }
    
    const { data, error } = await supabase
      .from('expenses')
      .insert({ 
        ...validatedData,
        user_id: user.id
      })
      .select(`
        *,
        category:categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      throw SupabaseError.fromPostgrestError(error);
    }

    return data as ExpenseWithCategory;
  }

  async updateExpense(command: UpdateExpenseCommand) {
    const validatedData = updateExpenseSchema.parse(command);
    const { id, ...updateData } = validatedData;

    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories (
          id,
          name,
          color
        )
      `)
      .single();

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    return data as ExpenseWithCategory;
  }

  async deleteExpense(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }
  }
} 
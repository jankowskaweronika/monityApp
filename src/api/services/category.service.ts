import { supabase } from '../../db/supabase.client';
import { ListCategoriesQuery, ListCategoriesResponse, CreateCategoryCommand, UpdateCategoryCommand } from '../../types/types';
import { z } from 'zod';
import { SupabaseError } from '../utils/supabase.error';

// Validation schemas
export const listCategoriesQuerySchema = z.object({
  include_default: z.boolean().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20)
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  is_default: z.boolean()
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().uuid()
});

export class CategoryService {
  async listCategories(query: ListCategoriesQuery): Promise<ListCategoriesResponse> {
    const validatedQuery = listCategoriesQuerySchema.parse(query);
    
    let supabaseQuery = supabase
      .from('categories')
      .select('*', { count: 'exact' });

    if (validatedQuery.include_default === false) {
      supabaseQuery = supabaseQuery.eq('is_default', false);
    }

    const { data, error, count } = await supabaseQuery
      .range(
        (validatedQuery.page - 1) * validatedQuery.limit,
        validatedQuery.page * validatedQuery.limit - 1
      );

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    return {
      data: data || [],
      meta: {
        total: count || 0,
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total_pages: count ? Math.ceil(count / validatedQuery.limit) : 0,
        has_prev: validatedQuery.page > 1
      }
    };
  }

  async createCategory(command: CreateCategoryCommand) {
    const validatedData = createCategorySchema.parse(command);
    
    const { data, error } = await supabase
      .from('categories')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    return data;
  }

  async updateCategory(command: UpdateCategoryCommand) {
    const validatedData = updateCategorySchema.parse(command);
    const { id, ...updateData } = validatedData;

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }

    return data;
  }

  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw SupabaseError.fromPostgrestError(error);
    }
  }
} 
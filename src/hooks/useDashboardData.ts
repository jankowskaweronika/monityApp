// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardData, LoadingState, DashboardError } from '../types/dashboard';
import { CreateExpenseCommand, ExpenseSummaryResponse, ListExpensesResponse, ListCategoriesResponse } from '../types/types';
import { ExpenseService } from '../api/services/expense.service';
import { CategoryService } from '../api/services/category.service';
import { AnalyticsService } from '../api/services/analytics.service';

export interface UseDashboardDataReturn {
  dashboardData: DashboardData;
  selectedPeriod: string;
  isModalOpen: boolean;
  loadingState: LoadingState;
  error: DashboardError | null;
  refreshData: () => Promise<void>;
  changePeriod: (period: string) => void;
  openModal: () => void;
  closeModal: () => void;
  addExpense: (data: CreateExpenseCommand) => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<DashboardError | null>(null);
  
  const [loadingState, setLoadingState] = useState<LoadingState>({
    summary: true,
    expenses: true,
    categories: true,
    addingExpense: false,
  });

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    summary: {
      total_amount: 0,
      category_breakdown: [],
      period: {
        id: selectedPeriod,
        name: 'Month',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
      },
    },
    recentExpenses: [],
    availableCategories: [],
    currentPeriod: {
      id: selectedPeriod,
      name: 'Month',
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
    },
    isLoading: true,
    error: undefined,
  });

  // Service instances
  const expenseService = new ExpenseService();
  const categoryService = new CategoryService();
  const analyticsService = new AnalyticsService();

  // Fetch dashboard summary data
  const fetchSummaryData = useCallback(async () => {
    try {
      setLoadingState(prev => ({ ...prev, summary: true }));
      const summaryResponse: ExpenseSummaryResponse = await analyticsService.getExpenseSummary({
        period: selectedPeriod,
      });
      
      setDashboardData(prev => ({
        ...prev,
        summary: summaryResponse,
        currentPeriod: summaryResponse.period,
      }));
    } catch (err) {
      setError({
        type: 'network',
        message: 'Failed to load summary data',
        details: { error: err },
      });
    } finally {
      setLoadingState(prev => ({ ...prev, summary: false }));
    }
  }, [selectedPeriod, analyticsService]);

  // Fetch recent expenses
  const fetchRecentExpenses = useCallback(async () => {
    try {
      setLoadingState(prev => ({ ...prev, expenses: true }));
      const expensesResponse: ListExpensesResponse = await expenseService.listExpenses({
        limit: 5,
        sort_by: 'date',
        sort_order: 'desc',
      });
      
      setDashboardData(prev => ({
        ...prev,
        recentExpenses: expensesResponse.data,
      }));
    } catch (err) {
      setError({
        type: 'network',
        message: 'Failed to load recent expenses',
        details: { error: err },
      });
    } finally {
      setLoadingState(prev => ({ ...prev, expenses: false }));
    }
  }, [expenseService]);

  // Fetch available categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingState(prev => ({ ...prev, categories: true }));
      const categoriesResponse: ListCategoriesResponse = await categoryService.listCategories({
        include_default: true,
      });
      
      setDashboardData(prev => ({
        ...prev,
        availableCategories: categoriesResponse.data,
      }));
    } catch (err) {
      setError({
        type: 'network',
        message: 'Failed to load categories',
        details: { error: err },
      });
    } finally {
      setLoadingState(prev => ({ ...prev, categories: false }));
    }
  }, [categoryService]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setError(null);
    await Promise.all([
      fetchSummaryData(),
      fetchRecentExpenses(),
      fetchCategories(),
    ]);
  }, [fetchSummaryData, fetchRecentExpenses, fetchCategories]);

  // Change period handler
  const changePeriod = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  // Modal handlers
  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Add expense with optimistic update
  const addExpense = useCallback(async (data: CreateExpenseCommand) => {
    try {
      setLoadingState(prev => ({ ...prev, addingExpense: true }));
      
      // Optimistic update - add temporary expense to recent list
      const optimisticExpense = {
        id: `temp-${Date.now()}`,
        user_id: 'current-user',
        category_id: data.category_id,
        amount: data.amount,
        description: data.description || '',
        date: data.date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: dashboardData.availableCategories.find(cat => cat.id === data.category_id) || {
          id: data.category_id,
          name: 'Unknown',
          color: '#888888',
        },
      };

      setDashboardData(prev => ({
        ...prev,
        recentExpenses: [optimisticExpense, ...prev.recentExpenses.slice(0, 4)],
      }));

      // Actual API call
      await expenseService.createExpense(data);
      
      // Refresh data after successful creation
      await refreshData();
      
      // Close modal on success
      setIsModalOpen(false);
      
    } catch (err) {
      // Rollback optimistic update on error
      await fetchRecentExpenses();
      
      setError({
        type: 'validation',
        message: 'Failed to add expense',
        details: { error: err },
      });
      throw err; // Re-throw for form error handling
    } finally {
      setLoadingState(prev => ({ ...prev, addingExpense: false }));
    }
  }, [expenseService, dashboardData.availableCategories, refreshData, fetchRecentExpenses]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Reload summary when period changes
  useEffect(() => {
    fetchSummaryData();
  }, [selectedPeriod, fetchSummaryData]);

  // Update isLoading flag based on loading states
  const isLoading = loadingState.summary || loadingState.expenses || loadingState.categories;
  
  const finalDashboardData: DashboardData = {
    ...dashboardData,
    isLoading,
    error: error?.message,
  };

  return {
    dashboardData: finalDashboardData,
    selectedPeriod,
    isModalOpen,
    loadingState,
    error,
    refreshData,
    changePeriod,
    openModal,
    closeModal,
    addExpense,
  };
};
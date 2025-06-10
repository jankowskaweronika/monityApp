// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardData, LoadingState, DashboardError } from '../types/dashboardTypes';
import { CreateExpenseCommand, ExpenseWithCategory } from '../types/types';
import { ExpenseService } from '../api/services/expense.service';
import { CategoryService } from '../api/services/category.service';
import { AnalyticsService } from '../api/services/analytics.service';
import { ExpensesChart } from '../components/dashboard/ExpensesChart';

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

  // Service instances - stable across renders
  const expenseService = useMemo(() => new ExpenseService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);
  const analyticsService = useMemo(() => new AnalyticsService(), []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setError(null);

    // Refresh summary data
    try {
      setLoadingState(prev => ({ ...prev, summary: true }));
      const summaryResponse = await analyticsService.getExpenseSummary({
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

    // Refresh recent expenses
    try {
      setLoadingState(prev => ({ ...prev, expenses: true }));
      const expensesResponse = await expenseService.listExpenses({
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

    // Refresh categories
    try {
      setLoadingState(prev => ({ ...prev, categories: true }));
      const categoriesResponse = await categoryService.listCategories({
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
  }, [selectedPeriod, analyticsService, expenseService, categoryService]);

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
    if (!data.date) {
      throw new Error('Date is required');
    }

    try {
      setLoadingState(prev => ({ ...prev, addingExpense: true }));

      // Get current categories from state
      setDashboardData(currentData => {
        // Optimistic update - add temporary expense to recent list
        const optimisticExpense: ExpenseWithCategory = {
          id: `temp-${Date.now()}`,
          user_id: 'current-user',
          category_id: data.category_id,
          amount: data.amount,
          description: data.description || '',
          date: data.date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: currentData.availableCategories.find(cat => cat.id === data.category_id) || {
            id: data.category_id,
            name: 'Unknown',
            color: '#888888',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_default: false,
            description: null
          },
        };

        return {
          ...currentData,
          recentExpenses: [optimisticExpense, ...currentData.recentExpenses.slice(0, 4)],
        };
      });

      // Actual API call
      await expenseService.createExpense(data);

      // Refresh data after successful creation
      await refreshData();

      // Close modal on success
      setIsModalOpen(false);

    } catch (err) {
      // Rollback optimistic update on error - reload recent expenses
      try {
        const expensesResponse = await expenseService.listExpenses({
          limit: 5,
          sort_by: 'date',
          sort_order: 'desc',
        });

        setDashboardData(prev => ({
          ...prev,
          recentExpenses: expensesResponse.data,
        }));
      } catch {
        // If rollback fails, just keep the optimistic update
      }

      setError({
        type: 'validation',
        message: 'Failed to add expense',
        details: { error: err },
      });
      throw err; // Re-throw for form error handling
    } finally {
      setLoadingState(prev => ({ ...prev, addingExpense: false }));
    }
  }, [expenseService, refreshData]);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setError(null);

      // Load summary data
      try {
        setLoadingState(prev => ({ ...prev, summary: true }));
        const summaryResponse = await analyticsService.getExpenseSummary({
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

      // Load recent expenses
      try {
        setLoadingState(prev => ({ ...prev, expenses: true }));
        const expensesResponse = await expenseService.listExpenses({
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

      // Load categories
      try {
        setLoadingState(prev => ({ ...prev, categories: true }));
        const categoriesResponse = await categoryService.listCategories({
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
    };

    loadInitialData();
  }, [selectedPeriod, analyticsService, expenseService, categoryService]); // Stable dependencies

  // No separate effect for period changes since it's handled in initial load

  // Update isLoading flag based on loading states
  useEffect(() => {
    const isLoading = loadingState.summary || loadingState.expenses || loadingState.categories;
    setDashboardData(prev => ({
      ...prev,
      isLoading,
      error: error?.message
    }));
  }, [loadingState.summary, loadingState.expenses, loadingState.categories, error]);

  return {
    dashboardData,
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

// Dashboard View Component
export const DashboardView: React.FC = () => {
  const {
    dashboardData,
    selectedPeriod,
    isModalOpen,
    loadingState,
    error,
    refreshData,
    changePeriod,
    openModal,
    closeModal,
    addExpense,
  } = useDashboardData();

  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = formData.date.split('T')[0];

      console.log('Submitting expense:', {
        amount: parseFloat(formData.amount),
        category_id: formData.categoryId,
        date: formattedDate,
        description: formData.description
      });

      await addExpense({
        amount: parseFloat(formData.amount),
        category_id: formData.categoryId,
        date: formattedDate,
        description: formData.description
      });

      setFormData({
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    } catch (err) {
      console.error('Error adding expense:', err);
      // Error is handled by the hook, we just need to catch it
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <select
            value={selectedPeriod}
            onChange={(e) => changePeriod(e.target.value)}
            disabled={loadingState.summary}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={refreshData} disabled={loadingState.summary}>
            Refresh
          </button>
          <button onClick={openModal}>
            Add Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}

      {dashboardData.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="summary">
            <ExpensesChart
              categoryBreakdown={dashboardData.summary.category_breakdown}
              totalAmount={dashboardData.summary.total_amount}
            />
          </div>
          <div className="recent-expenses">
            <h2>Recent Expenses</h2>
            {dashboardData.recentExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <span>{expense.description}</span>
                <span>{expense.amount}</span>
                <span>{new Date(expense.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  required
                >
                  <option value="">Select a category</option>
                  {dashboardData.availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={loadingState.addingExpense}>
                  {loadingState.addingExpense ? 'Adding...' : 'Add Expense'}
                </button>
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
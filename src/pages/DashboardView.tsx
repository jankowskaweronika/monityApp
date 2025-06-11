import React, { useState } from 'react';
import { ExpensesChart } from '../components/dashboard/ExpensesChart';
import { PeriodSummary } from '../components/dashboard/PeriodSummary';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';

export const DashboardView: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
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
      await addExpense({
        amount: parseFloat(formData.amount),
        category_id: formData.categoryId,
        date: formData.date,
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
    }
  };

  const renderAuthPrompt = () => {
    if (!isAuthenticated && !loadingState.summary && !dashboardData.recentExpenses.length) {
      return (
        <div className="text-center py-6 space-y-4">
          <p className="text-muted-foreground">Sign in to start tracking your expenses!</p>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">Create Account</Link>
            </Button>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={refreshData} variant="outline" disabled={loadingState.summary}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.message}
        </div>
      )}

      {renderAuthPrompt()}

      <div className="grid gap-6 md:grid-cols-2">
        <PeriodSummary
          currentPeriod={dashboardData.currentPeriod}
          totalAmount={dashboardData.summary.total_amount}
          categoryBreakdown={dashboardData.summary.category_breakdown}
          isLoading={loadingState.summary}
          selectedPeriod={selectedPeriod}
          onPeriodChange={changePeriod}
        />

        <Card>
          <CardContent className="p-6">
            <ExpensesChart
              categoryBreakdown={dashboardData.summary.category_breakdown}
              totalAmount={dashboardData.summary.total_amount}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Expenses</h2>
          </div>

          {loadingState.expenses ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          ) : dashboardData.recentExpenses.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              {isAuthenticated ? 'No expenses yet. Add your first expense!' : 'Sign in to start tracking your expenses!'}
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: expense.category.color }}
                    />
                    <div>
                      <div className="font-medium">{expense.description || 'No description'}</div>
                      <div className="text-sm text-muted-foreground">{expense.category.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(expense.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full p-2 border rounded"
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
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loadingState.addingExpense}>
                  {loadingState.addingExpense ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAuthenticated && (
        <Button
          className="fixed right-6 bottom-6 shadow-lg"
          size="lg"
          onClick={openModal}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </Button>
      )}
    </div>
  );
};
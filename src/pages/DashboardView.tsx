import React, { useState } from 'react';
import { ExpensesChart } from '../components/dashboard/ExpensesChart';
import { PeriodSummary } from '../components/dashboard/PeriodSummary';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Plus } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';

export const DashboardView: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const {
    dashboardData,
    isModalOpen,
    loadingState,
    error,
    refreshData,
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

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="py-10">
        <div className="container max-w-5xl mx-auto px-4 space-y-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary" data-test-id="dashboard-title">Dashboard</h1>
            <Button onClick={refreshData} variant="outline" disabled={loadingState.summary} className="w-full md:w-auto" data-test-id="refresh-dashboard-button">
              Refresh
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error.message}
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-muted/50 border rounded-lg p-4 text-center" data-test-id="dashboard-auth-prompt">
              <p className="text-muted-foreground">
                Sign in to start tracking your expenses! You can still browse the dashboard.
              </p>
              <div className="mt-2 space-x-4">
                <Button variant="outline" asChild size="sm">
                  <Link to="/auth/login" data-test-id="dashboard-login-link">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/auth/register">Create Account</Link>
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="shadow-md" data-test-id="period-summary-card">
              <CardContent className="p-8">
                <PeriodSummary
                  currentPeriod={{
                    start_date: dashboardData.currentPeriod.start_date,
                    end_date: dashboardData.currentPeriod.end_date
                  }}
                  totalAmount={dashboardData.summary.total_amount}
                  categoryBreakdown={dashboardData.summary.category_breakdown.map(item => ({
                    category: item.category_name,
                    amount: item.amount,
                    percentage: item.percentage
                  }))}
                  isLoading={loadingState.summary}
                  percentageChange={0}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md flex flex-col justify-center" data-test-id="expenses-chart-card">
              <CardContent className="p-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-6 text-center">Expenses Distribution</h2>
                <ExpensesChart
                  categoryBreakdown={dashboardData.summary.category_breakdown.map(item => ({
                    category: item.category_name,
                    amount: item.amount,
                    percentage: item.percentage
                  }))}
                  totalAmount={dashboardData.summary.total_amount}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md" data-test-id="recent-expenses-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold">Recent Expenses</h2>
              </div>

              {loadingState.expenses ? (
                <div className="animate-pulse space-y-4" data-test-id="expenses-loading">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg" />
                  ))}
                </div>
              ) : dashboardData.recentExpenses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground" data-test-id="no-expenses-message">
                  {isAuthenticated ? 'No expenses yet. Add your first expense!' : 'No expenses yet. Sign in to start tracking!'}
                </div>
              ) : (
                <div className="space-y-4" data-test-id="expenses-list">
                  {dashboardData.recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors shadow-sm"
                      data-test-id={`expense-item-${expense.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-3 h-3 rounded-full ring-2 ring-background"
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
        </div>
      </div>

      {isModalOpen && isAuthenticated && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" data-test-id="add-expense-modal">
          <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full border">
            <h2 className="text-2xl font-semibold mb-6">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4" data-test-id="add-expense-form">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-2 text-muted-foreground">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2 rounded-md border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  step="0.01"
                  min="0"
                  data-test-id="expense-amount-input"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2 text-muted-foreground">Category</label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full p-2 rounded-md border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  data-test-id="expense-category-select"
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
                <label htmlFor="date" className="block text-sm font-medium mb-2 text-muted-foreground">Date</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 rounded-md border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  data-test-id="expense-date-input"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2 text-muted-foreground">Description</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 rounded-md border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                  placeholder="Enter expense description"
                  minLength={1}
                  data-test-id="expense-description-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeModal} data-test-id="cancel-expense-button">Cancel</Button>
                <Button type="submit" data-test-id="submit-expense-button">Add Expense</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Button
        className="fixed right-6 bottom-6 shadow-lg"
        size="lg"
        onClick={openModal}
        disabled={!isAuthenticated}
        title={!isAuthenticated ? "Sign in to add expenses" : "Add new expense"}
        data-test-id="add-expense-button"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Expense
      </Button>
    </div>
  );
};
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { supabase } from '../../db/supabase.client';
import { setUser } from '../../store/authSlice';
import { PeriodSummary } from '../../components/dashboard/PeriodSummary';
import { ExpensesChart } from '../../components/dashboard/ExpensesChart';
import { RecentExpenses } from '../../components/dashboard/RecentExpenses';
import { AddExpenseModal } from '../../components/dashboard/AddExpenseModal';
import { Button } from '../../components/ui/button';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = React.useState(false);
  const [isLoading] = React.useState(false);

  // Mock data for testing
  const mockData = {
    currentPeriod: {
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    },
    totalAmount: 1500.00,
    categoryBreakdown: [
      { category: 'Food', amount: 500.00, percentage: 33.3 },
      { category: 'Transport', amount: 300.00, percentage: 20.0 },
      { category: 'Entertainment', amount: 700.00, percentage: 46.7 },
    ],
    percentageChange: 25.0,
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(setUser(null));
      navigate('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access the dashboard</p>
          <Button onClick={() => navigate('/auth/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" data-test-id="dashboard-title">Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div data-test-id="period-summary-card">
          <PeriodSummary
            currentPeriod={{
              start_date: mockData.currentPeriod.start_date,
              end_date: mockData.currentPeriod.end_date
            }}
            totalAmount={mockData.totalAmount}
            categoryBreakdown={mockData.categoryBreakdown.map(item => ({
              category: item.category,
              amount: item.amount,
              percentage: item.percentage
            }))}
            isLoading={isLoading}
            percentageChange={mockData.percentageChange}
          />
        </div>
        <div data-test-id="expenses-chart-card">
          <ExpensesChart
            categoryBreakdown={mockData.categoryBreakdown}
            totalAmount={mockData.totalAmount}
          />
        </div>
        <div data-test-id="recent-expenses-card">
          <RecentExpenses />
        </div>
      </div>

      <div className="mt-8">
        <Button
          onClick={() => setIsAddExpenseModalOpen(true)}
          data-test-id="add-expense-button"
        >
          Add Expense
        </Button>
      </div>

      {isAddExpenseModalOpen && (
        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          data-test-id="add-expense-modal"
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg" data-test-id="expenses-loading">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}; 
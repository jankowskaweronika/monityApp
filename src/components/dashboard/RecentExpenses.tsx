import React from 'react';
import { Card } from '../ui/card';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export const RecentExpenses: React.FC = () => {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // TODO: Implement fetching recent expenses
        setExpenses([]);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <Card title="Recent Expenses">
      {isLoading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : expenses.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No expenses yet</div>
      ) : (
        <div className="divide-y">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="p-4 flex justify-between items-center"
              data-test-id={`expense-item-${expense.id}`}
            >
              <div>
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-500">
                  {expense.category} • {new Date(expense.date).toLocaleDateString()}
                </div>
              </div>
              <div className="font-medium">
                ${expense.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}; 
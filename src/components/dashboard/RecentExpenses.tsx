import React from 'react';
import { Card } from '../ui/card';

export const RecentExpenses: React.FC = () => {
  return (
    <Card title="Recent Expenses">
      <div className="p-4">
        <div className="text-center text-gray-500">No recent expenses</div>
      </div>
    </Card>
  );
}; 
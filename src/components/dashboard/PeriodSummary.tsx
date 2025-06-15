import React from 'react';
import { Card } from '../ui/card';

export interface PeriodSummaryProps {
  currentPeriod: {
    start: string;
    end: string;
  };
  totalAmount: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  isLoading: boolean;
  previousPeriodTotal: number;
  percentageChange: number;
}

export const PeriodSummary: React.FC<PeriodSummaryProps> = ({
  currentPeriod,
  totalAmount,
  categoryBreakdown,
  isLoading,
  previousPeriodTotal,
  percentageChange,
}) => {
  if (isLoading) {
    return (
      <Card title="Period Summary">
        <div className="p-4 text-center">Loading...</div>
      </Card>
    );
  }

  return (
    <Card title="Period Summary">
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            {new Date(currentPeriod.start).toLocaleDateString()} -{' '}
            {new Date(currentPeriod.end).toLocaleDateString()}
          </div>
          <div className="text-2xl font-bold mt-1">
            ${totalAmount.toFixed(2)}
          </div>
          <div className="text-sm mt-1">
            <span
              className={
                percentageChange >= 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }
            >
              {percentageChange >= 0 ? '+' : ''}
              {percentageChange.toFixed(1)}%
            </span>{' '}
            vs previous period
          </div>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.map(({ category, amount, percentage }) => (
            <div key={category} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{category}</div>
                <div className="text-sm text-gray-500">
                  {percentage.toFixed(1)}% of total
                </div>
              </div>
              <div className="font-medium">
                ${amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
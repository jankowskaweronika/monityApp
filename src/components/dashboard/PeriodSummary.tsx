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
  totalAmount = 0,
  categoryBreakdown = [],
  isLoading,
  previousPeriodTotal = 0,
  percentageChange = 0,
}) => {
  if (isLoading) {
    return (
      <Card title="Period Summary">
        <div className="p-4 text-center">Loading...</div>
      </Card>
    );
  }

  // Zabezpieczenie przed nieprawidłowymi datami
  const startDate = currentPeriod?.start ? new Date(currentPeriod.start) : new Date();
  const endDate = currentPeriod?.end ? new Date(currentPeriod.end) : new Date();

  return (
    <Card title="Period Summary">
      <div className="p-4">
        <div className="mb-4">
          <div className="text-sm text-gray-500">
            {startDate.toLocaleDateString()} -{' '}
            {endDate.toLocaleDateString()}
          </div>
          <div className="text-2xl font-bold mt-1">
            ${(totalAmount || 0).toFixed(2)}
          </div>
          <div className="text-sm mt-1">
            <span
              className={
                (percentageChange || 0) >= 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }
            >
              {(percentageChange || 0) >= 0 ? '+' : ''}
              {(percentageChange || 0).toFixed(1)}%
            </span>{' '}
            vs previous period
          </div>
        </div>

        <div className="space-y-3">
          {(categoryBreakdown || []).map(({ category, amount = 0, percentage = 0 }) => (
            <div key={category} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{category}</div>
                <div className="text-sm text-gray-500">
                  {(percentage || 0).toFixed(1)}% of total
                </div>
              </div>
              <div className="font-medium">
                ${(amount || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
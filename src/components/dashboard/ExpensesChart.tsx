import React from 'react';
import { Card } from '../ui/card';

export interface ExpensesChartProps {
    categoryBreakdown: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    totalAmount: number;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({
    categoryBreakdown,
    totalAmount,
}) => {
    return (
        <Card title="Expenses by Category">
            <div className="p-4">
                <div className="space-y-4">
                    {categoryBreakdown.map(({ category, amount, percentage }) => (
                        <div key={category}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{category}</span>
                                <span className="text-sm text-gray-500">
                                    ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total</span>
                        <span className="text-lg font-bold">
                            ${totalAmount.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export interface ExpensesChartProps {
    categoryBreakdown: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    totalAmount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ExpensesChart: React.FC<ExpensesChartProps> = ({
    categoryBreakdown,
    totalAmount,
}) => {
    const data = categoryBreakdown.map(item => ({
        name: item.category,
        value: item.amount,
        percentage: item.percentage
    }));

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: number } }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-2 border rounded shadow-lg">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">${data.value.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">{data.percentage.toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-0 w-full max-w-xs md:max-w-[350px] mx-auto">
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
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
    );
};
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CategoryBreakdown } from '../../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesChartProps {
    categoryBreakdown: CategoryBreakdown[];
    totalAmount: number;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({ categoryBreakdown, totalAmount }) => {
    const data = {
        labels: categoryBreakdown.map(cat => cat.category_name),
        datasets: [
            {
                data: categoryBreakdown.map(cat => cat.amount),
                backgroundColor: categoryBreakdown.map(cat => cat.category_color),
                borderColor: 'white',
                borderWidth: 2,
                hoverOffset: 4
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        const percentage = ((value / totalAmount) * 100).toFixed(1);
                        return `${context.label}: ${new Intl.NumberFormat('pl-PL', {
                            style: 'currency',
                            currency: 'PLN'
                        }).format(value)} (${percentage}%)`;
                    },
                },
            },
        },
        cutout: '70%',
    };

    return (
        <div className="w-full relative">
            <div className="h-[300px]">
                <Doughnut data={data} options={options} />
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-sm text-muted-foreground">Total</div>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pl-PL', {
                        style: 'currency',
                        currency: 'PLN'
                    }).format(totalAmount)}
                </div>
            </div>
        </div>
    );
};
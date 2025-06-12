import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CategoryBreakdown } from '../../types/types';

// Rejestracja wszystkich potrzebnych komponentów
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
);

interface ExpensesChartProps {
    categoryBreakdown: CategoryBreakdown[];
    totalAmount: number;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({ categoryBreakdown, totalAmount }) => {
    console.log('ExpensesChart props:', JSON.stringify({ categoryBreakdown, totalAmount }, null, 2));

    const data = {
        labels: categoryBreakdown.map(cat => cat.category_name),
        datasets: [
            {
                data: categoryBreakdown.map(cat => cat.amount),
                backgroundColor: categoryBreakdown.map(cat => cat.category_color),
                borderColor: 'rgb(var(--background))',
                borderWidth: 2,
                hoverOffset: 8,
                borderRadius: 4
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12,
                        family: 'inherit'
                    },
                    color: 'rgb(var(--foreground))'
                }
            },
            tooltip: {
                backgroundColor: 'rgb(var(--card))',
                titleColor: 'rgb(var(--foreground))',
                bodyColor: 'rgb(var(--foreground))',
                bodyFont: {
                    size: 12,
                    family: 'inherit'
                },
                padding: 12,
                boxPadding: 6,
                borderColor: 'rgb(var(--border))',
                borderWidth: 1,
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
        cutout: '75%',
    };

    return (
        <div className="relative h-[300px] w-full">
            {categoryBreakdown.length > 0 ? (
                <>
                    <div className="absolute inset-0">
                        <Doughnut data={data} options={options} />
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                </div>
            )}
        </div>
    );
};
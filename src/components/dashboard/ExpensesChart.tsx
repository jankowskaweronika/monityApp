import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CategoryBreakdown } from '../../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesChartProps {
    categoryBreakdown: CategoryBreakdown[];
    totalAmount: number;
}

export const ExpensesChart = ({ categoryBreakdown, totalAmount }: ExpensesChartProps) => {
    const data = {
        labels: categoryBreakdown.map(cat => cat.category_name),
        datasets: [
            {
                data: categoryBreakdown.map(cat => cat.amount),
                backgroundColor: categoryBreakdown.map(cat => cat.category_color),
                borderColor: categoryBreakdown.map(cat => cat.category_color),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw;
                        const percentage = ((value / totalAmount) * 100).toFixed(1);
                        return `${context.label}: ${value}zł (${percentage}%)`;
                    },
                },
            },
        },
        cutout: '70%',
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
            <div className="relative">
                <Doughnut data={data} options={options} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-2xl font-bold">{totalAmount}zł</div>
                    <div className="text-sm text-gray-500">Total</div>
                </div>
            </div>
        </div>
    );
};
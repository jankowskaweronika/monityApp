import React from 'react';
import { ExpenseListProps } from '@/types/type';

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <p className="text-gray-500 py-4">Brak wydatków do wyświetlenia.</p>;
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return dateString;
    }
  };

  const formatAmount = (amount: number): string => {
    return amount.toFixed(2).replace('.', ',');
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b dark:border-gray-700">
            <th className="py-2 px-4 text-left">Data</th>
            <th className="py-2 px-4 text-left">Kategoria</th>
            <th className="py-2 px-4 text-left">Opis</th>
            <th className="py-2 px-4 text-right">Kwota</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="py-3 px-4">{formatDate(expense.date)}</td>
              <td className="py-3 px-4">{expense.category}</td>
              <td className="py-3 px-4">{expense.description}</td>
              <td className="py-3 px-4 text-right font-medium">
                {formatAmount(expense.amount)} zł
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
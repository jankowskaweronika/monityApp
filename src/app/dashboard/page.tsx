'use client'

import React from 'react';
import { PieChartExpense } from '../../components/charts/PieCharts';
import { ExpenseList } from '../../components/ui/ExpenseList';
import { expenses } from '../../data/expenses';
import { expenseData } from '../../data/expenseData';

export default function DashboardPage() {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const income = 8000;
  const savings = income - totalExpenses;
  const budgetUsed = Math.round((totalExpenses / income) * 100);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Panel główny</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Podsumowanie miesiąca</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Wydatki</p>
              <p className="text-2xl font-bold text-red-500">{totalExpenses.toFixed(2).replace('.', ',')} zł</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Przychody</p>
              <p className="text-2xl font-bold text-green-500">{income.toFixed(2).replace('.', ',')} zł</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Oszczędności</p>
              <p className="text-2xl font-bold text-blue-500">{savings.toFixed(2).replace('.', ',')} zł</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Budżet wykorzystany</p>
              <p className="text-2xl font-bold">{budgetUsed}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Wydatki według kategorii</h2>
          <div className="h-64">
            <PieChartExpense data={expenseData} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ostatnie wydatki</h2>
          <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
            Zobacz wszystkie
          </button>
        </div>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}
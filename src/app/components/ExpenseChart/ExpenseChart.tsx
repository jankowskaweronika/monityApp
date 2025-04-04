import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ExpenseChartProps } from "../../../types/types";

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenseSummary }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const pieData = expenseSummary.categories;

  const handlePieClick = (data: unknown, index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const handlePieMouseEnter = (data: unknown, index: number) => {
    setActiveCategory(index);
  };

  const handlePieMouseLeave = () => {
    setActiveCategory(null);
  };

  const formatCurrency = (value: number) => {
    return `${value} zł`;
  };

  const centerLabel = activeCategory !== null
    ? formatCurrency(pieData[activeCategory].value)
    : formatCurrency(expenseSummary.totalAmount);

  return (
    <div className="relative">
      <div className="mx-auto" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              innerRadius={60}
              dataKey="value"
              nameKey="name"
              onClick={handlePieClick}
              onMouseEnter={handlePieMouseEnter}
              onMouseLeave={handlePieMouseLeave}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeCategory === index ? "#fff" : "none"}
                  strokeWidth={activeCategory === index ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} zł`, ""]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "0.5rem",
                boxShadow: "var(--shadow-md)",
                border: "none"
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value: string) => (
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ top: "35%", transform: "translateY(-50%)" }}
        >
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Suma</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{centerLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
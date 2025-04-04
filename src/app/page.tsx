"use client";

import React from "react";
import ExpenseChart from "@/app/components/ExpenseChart/ExpenseChart";
import { mockExpenseSummary } from "@/data/mockedExpenseData";

const page = () => {
  return (
    <div>
      <ExpenseChart expenseSummary={mockExpenseSummary} />
    </div>
  );
};

export default page;
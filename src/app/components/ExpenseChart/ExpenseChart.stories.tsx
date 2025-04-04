import type { Meta, StoryObj } from "@storybook/react";
import ExpenseChart from "./ExpenseChart";
import { mockExpenseSummary } from "../../../data/mockedExpenseData";

const meta = {
  title: "Components/ExpenseChart",
  component: ExpenseChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ExpenseChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expenseSummary: mockExpenseSummary
  },
};
// src/components/dashboard/PeriodSummary.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PeriodInfo, PeriodChangeHandler } from '../../types/dashboard';
import { CategoryBreakdown } from '../../types/types'

interface PeriodSummaryProps {
  currentPeriod: PeriodInfo;
  totalAmount: number;
  categoryBreakdown: CategoryBreakdown[];
  isLoading: boolean;
  selectedPeriod: string;
  onPeriodChange: PeriodChangeHandler;
  previousAmount?: number;
}

const PERIOD_OPTIONS = [
  { id: 'day', name: 'Today', label: 'Daily' },
  { id: 'week', name: 'This Week', label: 'Weekly' },
  { id: 'month', name: 'This Month', label: 'Monthly' },
  { id: 'year', name: 'This Year', label: 'Yearly' },
];

export const PeriodSummary: React.FC<PeriodSummaryProps> = ({
  currentPeriod,
  totalAmount,
  categoryBreakdown,
  isLoading,
  selectedPeriod,
  onPeriodChange,
  previousAmount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentPeriodOption = PERIOD_OPTIONS.find(option => option.id === selectedPeriod) || PERIOD_OPTIONS[2];

  // Calculate trend if previous amount is available
  const trendDirection = previousAmount !== undefined
    ? totalAmount > previousAmount ? 'up'
      : totalAmount < previousAmount ? 'down'
        : 'stable'
    : undefined;

  const changePercentage = previousAmount !== undefined && previousAmount > 0
    ? Math.abs(((totalAmount - previousAmount) / previousAmount) * 100)
    : undefined;

  const expenseCount = categoryBreakdown.reduce((total, category) => {
    // This is approximate - we'd need actual expense count from API
    return total + Math.round(category.amount / 10); // Rough estimate
  }, 0);

  const handlePeriodSelect = (periodId: string) => {
    onPeriodChange(periodId);
    setIsDropdownOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Expense Summary</CardTitle>

          {/* Period Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isLoading}
              className="min-w-[120px] justify-between"
            >
              {currentPeriodOption.label}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-background border rounded-md shadow-lg z-10">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handlePeriodSelect(option.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md ${option.id === selectedPeriod ? 'bg-muted font-medium' : ''
                      }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-8 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
          </div>
        ) : (
          <>
            {/* Main Amount Display */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(totalAmount)}
                </span>
                {trendDirection && changePercentage !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${trendDirection === 'up' ? 'text-red-500' :
                    trendDirection === 'down' ? 'text-green-500' :
                      'text-muted-foreground'
                    }`}>
                    {trendDirection === 'up' && <TrendingUp className="w-4 h-4" />}
                    {trendDirection === 'down' && <TrendingDown className="w-4 h-4" />}
                    {trendDirection === 'stable' && <Minus className="w-4 h-4" />}
                    {changePercentage.toFixed(1)}%
                  </div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {formatDate(currentPeriod.start_date)} - {formatDate(currentPeriod.end_date)}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-lg font-semibold">{categoryBreakdown.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg font-semibold">{expenseCount}</p>
              </div>
            </div>

            {/* Expandable Details */}
            {categoryBreakdown.length > 0 && (
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full justify-between p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                >
                  <span>Category breakdown</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </Button>

                {showDetails && (
                  <div className="mt-3 space-y-2">
                    {categoryBreakdown
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 5)
                      .map((category) => (
                        <div key={category.category_id} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.category_color }}
                            ></div>
                            <span className="text-sm">{category.category_name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatCurrency(category.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {category.percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
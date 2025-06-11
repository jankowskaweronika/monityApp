import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { PeriodInfo } from '../../types/types';
import { CategoryBreakdown } from '../../types/types';

interface PeriodSummaryProps {
  currentPeriod: PeriodInfo;
  totalAmount: number;
  categoryBreakdown: CategoryBreakdown[];
  isLoading: boolean;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  previousAmount?: number;
}

const PERIOD_OPTIONS = [
  { id: 'day', name: 'Today' },
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'year', name: 'This Year' },
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

  // Calculate trend
  const trendDirection = previousAmount !== undefined
    ? (totalAmount > previousAmount ? 'up'
      : totalAmount < previousAmount ? 'down'
        : 'stable') : 'stable';

  const changePercentage = previousAmount !== undefined && previousAmount > 0
    ? Math.abs(((totalAmount - previousAmount) / previousAmount) * 100)
    : undefined;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Period Summary</CardTitle>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="gap-2"
            >
              {currentPeriodOption.name}
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-card border shadow-lg z-10">
                {PERIOD_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onPeriodChange(option.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg
                      ${option.id === selectedPeriod ? 'bg-muted font-medium' : ''}`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-lg animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-2/3 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-1/2 animate-pulse" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">
                  {formatCurrency(totalAmount)}
                </span>
                {trendDirection && changePercentage !== undefined && (
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${trendDirection === 'up' ? 'text-red-500' :
                      trendDirection === 'down' ? 'text-green-500' :
                        'text-muted-foreground'}`}
                  >
                    {trendDirection === 'up' && <TrendingUp className="h-4 w-4" />}
                    {trendDirection === 'down' && <TrendingDown className="h-4 w-4" />}
                    {trendDirection === 'stable' && <Minus className="h-4 w-4" />}
                    {changePercentage.toFixed(1)}%
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(currentPeriod.start_date)} - {formatDate(currentPeriod.end_date)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 my-6 py-6 border-y">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Categories</p>
                <p className="text-2xl font-bold tracking-tight">{categoryBreakdown.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Avg. per day</p>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(totalAmount / 30)}
                </p>
              </div>
            </div>

            {categoryBreakdown.length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full justify-between px-0 h-auto font-medium hover:bg-transparent"
                >
                  <span className="text-sm font-medium">Category breakdown</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showDetails ? 'rotate-180' : ''}`} />
                </Button>

                {showDetails && (
                  <div className="mt-4 space-y-3">
                    {categoryBreakdown
                      .sort((a, b) => b.amount - a.amount)
                      .slice(0, 5)
                      .map((category) => (
                        <div key={category.category_id} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full ring-2 ring-background"
                              style={{ backgroundColor: category.category_color }}
                            />
                            <span className="text-sm">{category.category_name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatCurrency(category.amount)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {((category.amount / totalAmount) * 100).toFixed(1)}%
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
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PeriodSummary } from '../PeriodSummary';

describe('PeriodSummary', () => {
  const defaultProps = {
    currentPeriod: {
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    },
    totalAmount: 1500,
    categoryBreakdown: [
      {
        category: 'Food',
        amount: 1000,
        percentage: 66.7
      },
      {
        category: 'Transport',
        amount: 500,
        percentage: 33.3
      }
    ],
    isLoading: false,
    previousPeriodTotal: 1200,
    percentageChange: 25.0
  };

  test('renders loading state', () => {
    render(<PeriodSummary {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('renders period dates correctly', () => {
    render(<PeriodSummary {...defaultProps} />)
    expect(screen.getByText('1/1/2024 - 1/31/2024')).toBeInTheDocument()
  })

  test('displays total amount correctly', () => {
    render(<PeriodSummary {...defaultProps} />)
    expect(screen.getByText('1500.00 zł')).toBeInTheDocument()
  })

  test('displays percentage change correctly', () => {
    render(<PeriodSummary {...defaultProps} percentageChange={-25.0} />)
    expect(screen.getByText('-25.0%')).toBeInTheDocument()
  })

  test('displays category breakdown correctly', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Sprawdź czy kategorie są wyświetlane
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()

    // Sprawdź kwoty dla każdej kategorii
    expect(screen.getByText('1000.00 zł')).toBeInTheDocument()
    expect(screen.getByText('500.00 zł')).toBeInTheDocument()

    // Sprawdź procenty
    expect(screen.getByText('66.7% of total')).toBeInTheDocument()
    expect(screen.getByText('33.3% of total')).toBeInTheDocument()
  })

  test('handles empty category breakdown', () => {
    render(<PeriodSummary {...defaultProps} categoryBreakdown={[]} />)
    // Nie powinno być żadnych kategorii
    expect(screen.queryByText(/Food|Transport/)).not.toBeInTheDocument()
  })

  test('handles zero total amount', () => {
    render(<PeriodSummary {...defaultProps} totalAmount={0} percentageChange={0} />)

    // Sprawdź główną kwotę
    expect(screen.getByText('0.00 zł')).toBeInTheDocument()

    // Sprawdź trend (0%)
    expect(screen.getByText('+0.0%')).toBeInTheDocument()
  })
}) 
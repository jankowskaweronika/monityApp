import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PeriodSummary } from '../PeriodSummary'

// Mock data
const mockCurrentPeriod = {
  start: '2024-03-01',
  end: '2024-03-31'
}

const mockCategoryBreakdown = [
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
]

describe('PeriodSummary', () => {
  const defaultProps = {
    currentPeriod: mockCurrentPeriod,
    totalAmount: 1500,
    categoryBreakdown: mockCategoryBreakdown,
    isLoading: false,
    previousPeriodTotal: 1200,
    percentageChange: 25.0
  }

  test('renders loading state correctly', () => {
    render(<PeriodSummary {...defaultProps} isLoading={true} />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays correct total amount and trend', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Sprawdź wyświetlaną kwotę
    expect(screen.getByText('$1500.00')).toBeInTheDocument()

    // Sprawdź trend (wzrost o 25%)
    const trendElement = screen.getByText('+25.0%')
    expect(trendElement).toHaveClass('text-red-600')
  })

  test('handles negative trend correctly', () => {
    render(<PeriodSummary {...defaultProps} percentageChange={-25.0} />)

    // Sprawdź trend (spadek o 25%)
    const trendElement = screen.getByText('-25.0%')
    expect(trendElement).toHaveClass('text-green-600')
  })

  test('displays correct date range', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Sprawdź format daty (zależny od lokalizacji)
    const dateText = screen.getByText(/3\/1\/2024 - 3\/31\/2024/)
    expect(dateText).toBeInTheDocument()
  })

  test('displays category breakdown correctly', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Sprawdź czy kategorie są wyświetlane
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()

    // Sprawdź kwoty dla każdej kategorii
    expect(screen.getByText('$1000.00')).toBeInTheDocument()
    expect(screen.getByText('$500.00')).toBeInTheDocument()

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
    expect(screen.getByText('$0.00')).toBeInTheDocument()

    // Sprawdź trend (0%)
    expect(screen.getByText('+0.0%')).toBeInTheDocument()
  })
}) 
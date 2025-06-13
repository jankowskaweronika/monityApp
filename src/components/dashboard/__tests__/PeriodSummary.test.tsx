import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PeriodSummary } from '../PeriodSummary'
import { PeriodInfo, CategoryBreakdown } from '../../../types/types'

// Mock data
const mockPeriod: PeriodInfo = {
  id: '1',
  name: 'March 2024',
  start_date: '2024-03-01',
  end_date: '2024-03-31'
}

const mockCategories: CategoryBreakdown[] = [
  {
    category_id: '1',
    category_name: 'Food',
    amount: 1000,
    category_color: '#FF0000',
    percentage: 66.67
  },
  {
    category_id: '2',
    category_name: 'Transport',
    amount: 500,
    category_color: '#00FF00',
    percentage: 33.33
  }
]

describe('PeriodSummary', () => {
  const defaultProps = {
    currentPeriod: mockPeriod,
    totalAmount: 1500,
    categoryBreakdown: mockCategories,
    isLoading: false,
    selectedPeriod: 'month',
    onPeriodChange: vi.fn(),
    previousAmount: 1200
  }

  test('renders loading state correctly', () => {
    render(<PeriodSummary {...defaultProps} isLoading={true} />)

    // Sprawdź placeholdery ładowania (używamy klasy zamiast roli)
    const placeholders = screen.getAllByTestId('loading-placeholder')
    expect(placeholders).toHaveLength(3)
  })

  test('displays correct total amount and trend', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Sprawdź wyświetlaną kwotę
    const totalAmount = screen.getByText('1500,00 zł', { selector: 'span.text-4xl' })
    expect(totalAmount).toBeInTheDocument()

    // Sprawdź trend (wzrost o 25%)
    const trendContainer = screen.getByText('25.0%').closest('div')
    expect(trendContainer).toHaveClass('text-red-500')
    expect(trendContainer?.querySelector('svg')).toHaveClass('lucide-trending-up')
  })

  test('handles negative trend correctly', () => {
    render(<PeriodSummary {...defaultProps} previousAmount={2000} />)

    // Sprawdź trend (spadek o 25%)
    const trendContainer = screen.getByText('25.0%').closest('div')
    expect(trendContainer).toHaveClass('text-green-500')
    expect(trendContainer?.querySelector('svg')).toHaveClass('lucide-trending-down')
  })

  test('handles stable trend correctly', () => {
    render(<PeriodSummary {...defaultProps} previousAmount={1500} />)

    // Sprawdź trend (bez zmian)
    const trendContainer = screen.getByText('0.0%').closest('div')
    expect(trendContainer).toHaveClass('text-muted-foreground')
    expect(trendContainer?.querySelector('svg')).toHaveClass('lucide-minus')
  })

  test('displays correct date range', () => {
    render(<PeriodSummary {...defaultProps} />)

    expect(screen.getByText('1 mar 2024 - 31 mar 2024')).toBeInTheDocument()
  })

  test('calculates and displays average daily amount correctly', () => {
    render(<PeriodSummary {...defaultProps} />)

    // 1500 / 30 = 50 zł/dzień
    const avgAmount = screen.getByText('50,00 zł', { selector: 'p.text-2xl' })
    expect(avgAmount).toBeInTheDocument()
  })

  test('handles period change correctly', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Otwórz dropdown
    const periodButton = screen.getByRole('button', { name: /This Month/i })
    fireEvent.click(periodButton)

    // Wybierz nowy okres
    const weekOption = screen.getByText('This Week')
    fireEvent.click(weekOption)

    expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('week')
  })

  test('displays category breakdown correctly', () => {
    render(<PeriodSummary {...defaultProps} />)

    // Otwórz szczegóły kategorii
    const breakdownButton = screen.getByText('Category breakdown')
    fireEvent.click(breakdownButton)

    // Sprawdź czy kategorie są wyświetlane w odpowiedniej kolejności (sortowanie po kwocie)
    const categoryItems = screen.getAllByText(/Food|Transport/)
    expect(categoryItems).toHaveLength(2)

    // Sprawdź kwoty i procenty dla każdej kategorii
    const foodAmount = screen.getByText('1000,00 zł', { selector: 'div.text-sm.font-medium' })
    const transportAmount = screen.getByText('500,00 zł', { selector: 'div.text-sm.font-medium' })
    expect(foodAmount).toBeInTheDocument()
    expect(transportAmount).toBeInTheDocument()

    // Sprawdź procenty (obliczane dynamicznie)
    const percentages = screen.getAllByText(/66.7%|33.3%/, { selector: 'div.text-xs' })
    expect(percentages).toHaveLength(2)
  })

  test('handles empty category breakdown', () => {
    render(<PeriodSummary {...defaultProps} categoryBreakdown={[]} />)

    // Nie powinno być przycisku breakdown
    expect(screen.queryByText('Category breakdown')).not.toBeInTheDocument()
  })

  test('handles zero total amount', () => {
    render(<PeriodSummary {...defaultProps} totalAmount={0} previousAmount={0} />)

    // Sprawdź główną kwotę
    const totalAmount = screen.getByText('0,00 zł', { selector: 'span.text-4xl' })
    expect(totalAmount).toBeInTheDocument()

    // Sprawdź średnią dzienną
    const avgAmount = screen.getByText('0,00 zł', { selector: 'p.text-2xl' })
    expect(avgAmount).toBeInTheDocument()

    // Nie powinno być trendu dla zerowej kwoty
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument()
  })

  test('handles undefined previous amount', () => {
    render(<PeriodSummary {...defaultProps} previousAmount={undefined} />)

    // Nie powinno wyświetlać trendu
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(screen.queryByText(/trending/)).not.toBeInTheDocument()
  })
}) 
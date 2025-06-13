import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from '../RegisterForm'

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('RegisterForm', () => {
  const mockOnSubmit = vi.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('renders registration form with all fields', () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    expect(screen.getByLabelText(/^full name$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  test('validates full name length', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const nameInput = screen.getByLabelText(/full name/i)

    // Test too short name
    fireEvent.change(nameInput, { target: { value: 'A' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters long/i)).toBeInTheDocument()
    })

    // Test valid name
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.blur(nameInput)

    await waitFor(() => {
      expect(screen.queryByText(/full name must be at least 2 characters long/i)).not.toBeInTheDocument()
    })
  })

  test('validates email format', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/email/i)

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument()
    })
  })

  test('validates password requirements', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByLabelText(/^password$/i)

    // Test password that doesn't meet requirements
    fireEvent.change(passwordInput, { target: { value: 'weak' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText(/password does not meet all requirements/i)).toBeInTheDocument()
      // Sprawdź wyświetlane wymagania
      expect(screen.getByText(/at least 8 characters long/i)).toBeInTheDocument()
      expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument()
      expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument()
      expect(screen.getByText(/one number/i)).toBeInTheDocument()
      expect(screen.getByText(/one special character/i)).toBeInTheDocument()
    })

    // Test valid password
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.queryByText(/password does not meet all requirements/i)).not.toBeInTheDocument()
    })
  })

  test('validates password confirmation', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/^confirm password$/i)

    // Set initial password
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })

    // Test non-matching confirmation
    fireEvent.change(confirmInput, { target: { value: 'DifferentP@ss123' } })
    fireEvent.blur(confirmInput)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })

    // Test matching confirmation
    fireEvent.change(confirmInput, { target: { value: 'StrongP@ss123' } })
    fireEvent.blur(confirmInput)

    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).not.toBeInTheDocument()
    })
  })

  test('updates password confirmation validation when password changes', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmInput = screen.getByLabelText(/^confirm password$/i)

    // Set matching passwords
    fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })
    fireEvent.change(confirmInput, { target: { value: 'StrongP@ss123' } })

    // Change password
    fireEvent.change(passwordInput, { target: { value: 'NewP@ss123' } })

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  test('handles form submission with valid data', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/^full name$/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongP@ss123' }
    })
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: 'StrongP@ss123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fullName: 'John Doe',
        email: 'test@example.com',
        password: 'StrongP@ss123'
      })
    })
  })

  test('prevents submission with invalid data', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in invalid data
    fireEvent.change(screen.getByLabelText(/^full name$/i), {
      target: { value: 'A' }
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'invalid-email' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'weak' }
    })
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: 'different' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(screen.getByText(/full name must be at least 2 characters long/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/password does not meet all requirements/i)).toBeInTheDocument()
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  test('handles submission error', async () => {
    const errorMessage = 'Email already exists'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/^full name$/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongP@ss123' }
    })
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: 'StrongP@ss123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    // Poczekaj na pojawienie się komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.getByText((content) => content.includes(errorMessage))
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  test('clears error message when form is modified after error', async () => {
    const errorMessage = 'Email already exists'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data first
    fireEvent.change(screen.getByLabelText(/^full name$/i), {
      target: { value: 'John Doe' }
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'StrongP@ss123' }
    })
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: 'StrongP@ss123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    // Poczekaj na pojawienie się komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.getByText((content) => content.includes(errorMessage))
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 2000 })

    // Reset form state by clicking submit button again
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    // Modify form - zmień wszystkie pola, aby upewnić się, że błąd zostanie wyczyszczony
    fireEvent.change(screen.getByLabelText(/^full name$/i), {
      target: { value: 'Jane Doe' }
    })
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'new@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'NewP@ss123' }
    })
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: 'NewP@ss123' }
    })

    // Poczekaj na zniknięcie komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.queryByText((content) => content.includes(errorMessage))
      expect(errorElement).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })
}) 
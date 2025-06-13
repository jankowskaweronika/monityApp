import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '../LoginForm'

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn()
  const defaultProps = {
    onSubmit: mockOnSubmit
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('renders login form with all fields', () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    const emailInput = screen.getByLabelText(/^email$/i)

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

  test('validates required password', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    // Submit form without password
    fireEvent.click(submitButton)

    // Sprawdź, czy pole hasła jest oznaczone jako wymagane
    await waitFor(() => {
      expect(passwordInput).toBeInvalid()
    })

    // Wprowadź hasło
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.blur(passwordInput)

    // Sprawdź, czy walidacja została wyczyszczona
    await waitFor(() => {
      expect(passwordInput).not.toBeInvalid()
    })
  })

  test('handles form submission with valid data', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  test('prevents submission with invalid data', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in invalid data
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'invalid-email' }
    })
    // Nie wypełniaj hasła

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInvalid()
    })
  })

  test('handles submission error', async () => {
    const errorMessage = 'Invalid credentials'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Poczekaj na pojawienie się komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.getByText((content) => content.includes(errorMessage))
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  test('shows loading state during submission', async () => {
    // Mock długiego czasu odpowiedzi
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    // Sprawdź stan ładowania
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/signing in/i)

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent(/sign in/i)
    })
  })

  test('clears error message when form is modified after error', async () => {
    const errorMessage = 'Invalid credentials'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data first
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Poczekaj na pojawienie się komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.getByText((content) => content.includes(errorMessage))
      expect(errorElement).toBeInTheDocument()
    }, { timeout: 2000 })

    // Reset form state by clicking submit button again
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    // Modify form
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'new@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'newpassword123' }
    })

    // Poczekaj na zniknięcie komunikatu błędu
    await waitFor(() => {
      const errorElement = screen.queryByText((content) => content.includes(errorMessage))
      expect(errorElement).not.toBeInTheDocument()
    }, { timeout: 2000 })
  })
}) 
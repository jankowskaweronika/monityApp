import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '../LoginForm'
import { act } from 'react-dom/test-utils'

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

    expect(screen.getByTestId('login-email-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('login-submit-button')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    const emailInput = screen.getByTestId('login-email-input')

    // Test invalid email
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)
    })

    await waitFor(() => {
      expect(screen.getByText(/nieprawidłowy adres email/i)).toBeInTheDocument()
    })

    // Test valid email
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.blur(emailInput)
    })

    await waitFor(() => {
      expect(screen.queryByText(/nieprawidłowy adres email/i)).not.toBeInTheDocument()
    })
  })

  test('validates required password', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    const passwordInput = screen.getByTestId('login-password-input')
    const submitButton = screen.getByTestId('login-submit-button')

    // Submit form without password
    await act(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText(/hasło jest wymagane/i)).toBeInTheDocument()
    })

    // Enter password
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.blur(passwordInput)
    })

    await waitFor(() => {
      expect(screen.queryByText(/hasło jest wymagane/i)).not.toBeInTheDocument()
    })
  })

  test('handles form submission with valid data', async () => {
    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('login-password-input'), {
        target: { value: 'password123' }
      })
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-submit-button'))
    })

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
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'invalid-email' }
      })
      // Don't fill in password
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-submit-button'))
    })

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
      expect(screen.getByText(/nieprawidłowy adres email/i)).toBeInTheDocument()
      expect(screen.getByText(/hasło jest wymagane/i)).toBeInTheDocument()
    })
  })

  test('handles submission error', async () => {
    const errorMessage = 'Invalid credentials'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('login-password-input'), {
        target: { value: 'password123' }
      })
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('login-submit-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('login-error-message')).toBeInTheDocument()
      expect(screen.getByTestId('login-error-message')).toHaveTextContent(errorMessage)
    })
  })

  test('shows loading state during submission', async () => {
    // Mock long response time
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderWithRouter(<LoginForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('login-password-input'), {
        target: { value: 'password123' }
      })
    })

    // Submit form
    const submitButton = screen.getByTestId('login-submit-button')
    await act(async () => {
      fireEvent.click(submitButton)
    })

    // Check loading state
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/signing in/i)

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent(/sign in/i)
    })
  })
}) 
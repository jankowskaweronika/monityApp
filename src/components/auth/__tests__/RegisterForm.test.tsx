import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from '../RegisterForm'
import { act } from 'react-dom/test-utils'

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

    expect(screen.getByTestId('register-fullname-input')).toBeInTheDocument()
    expect(screen.getByTestId('register-email-input')).toBeInTheDocument()
    expect(screen.getByTestId('register-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('register-confirm-password-input')).toBeInTheDocument()
    expect(screen.getByTestId('register-submit-button')).toBeInTheDocument()
  })

  test('validates full name length', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const nameInput = screen.getByTestId('register-fullname-input')

    // Test too short name
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'A' } })
      fireEvent.blur(nameInput)
    })

    await waitFor(() => {
      expect(screen.getByText(/imię i nazwisko musi mieć minimum 2 znaki/i)).toBeInTheDocument()
    })

    // Test valid name
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.blur(nameInput)
    })

    await waitFor(() => {
      expect(screen.queryByText(/imię i nazwisko musi mieć minimum 2 znaki/i)).not.toBeInTheDocument()
    })
  })

  test('validates email format', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const emailInput = screen.getByTestId('register-email-input')

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

  test('validates password requirements', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByTestId('register-password-input')

    // Test password that doesn't meet requirements
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'weak' } })
      fireEvent.blur(passwordInput)
    })

    await waitFor(() => {
      expect(screen.getByText(/hasło musi mieć minimum 8 znaków/i)).toBeInTheDocument()
      // Check displayed requirements
      expect(screen.getByText(/at least 8 characters long/i)).toBeInTheDocument()
      expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument()
      expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument()
      expect(screen.getByText(/one number/i)).toBeInTheDocument()
      expect(screen.getByText(/one special character/i)).toBeInTheDocument()
    })

    // Test valid password
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })
      fireEvent.blur(passwordInput)
    })

    await waitFor(() => {
      expect(screen.queryByText(/hasło musi mieć minimum 8 znaków/i)).not.toBeInTheDocument()
    })
  })

  test('validates password confirmation', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByTestId('register-password-input')
    const confirmInput = screen.getByTestId('register-confirm-password-input')

    // Set initial password
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })
      fireEvent.blur(passwordInput)
    })

    // Test non-matching confirmation
    await act(async () => {
      fireEvent.change(confirmInput, { target: { value: 'DifferentP@ss123' } })
      fireEvent.blur(confirmInput)
    })

    await waitFor(() => {
      expect(screen.getByText(/hasła nie są identyczne/i)).toBeInTheDocument()
    })

    // Test matching confirmation
    await act(async () => {
      fireEvent.change(confirmInput, { target: { value: 'StrongP@ss123' } })
      fireEvent.blur(confirmInput)
    })

    await waitFor(() => {
      expect(screen.queryByText(/hasła nie są identyczne/i)).not.toBeInTheDocument()
    })
  })

  test('updates password confirmation validation when password changes', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    const passwordInput = screen.getByTestId('register-password-input')
    const confirmInput = screen.getByTestId('register-confirm-password-input')

    // Set matching passwords
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'StrongP@ss123' } })
      fireEvent.change(confirmInput, { target: { value: 'StrongP@ss123' } })
      fireEvent.blur(passwordInput)
      fireEvent.blur(confirmInput)
    })

    // Change password and trigger validation
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'NewP@ss123' } })
      fireEvent.blur(passwordInput)
      // Trigger validation on confirm password field
      fireEvent.blur(confirmInput)
    })

    await waitFor(() => {
      expect(screen.getByText(/hasła nie są identyczne/i)).toBeInTheDocument()
    })
  })

  test('handles form submission with valid data', async () => {
    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-fullname-input'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByTestId('register-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('register-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
      fireEvent.change(screen.getByTestId('register-confirm-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('register-submit-button'))
    })

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
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-fullname-input'), {
        target: { value: 'A' }
      })
      fireEvent.change(screen.getByTestId('register-email-input'), {
        target: { value: 'invalid-email' }
      })
      fireEvent.change(screen.getByTestId('register-password-input'), {
        target: { value: 'weak' }
      })
      fireEvent.change(screen.getByTestId('register-confirm-password-input'), {
        target: { value: 'different' }
      })
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('register-submit-button'))
    })

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/imię i nazwisko musi mieć minimum 2 znaki/i)).toBeInTheDocument()
      expect(screen.getByText(/nieprawidłowy adres email/i)).toBeInTheDocument()
      expect(screen.getByText(/hasło musi mieć minimum 8 znaków/i)).toBeInTheDocument()
      expect(screen.getByText(/hasła nie są identyczne/i)).toBeInTheDocument()
    })
  })

  test('handles submission error', async () => {
    const errorMessage = 'Email already exists'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-fullname-input'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByTestId('register-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('register-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
      fireEvent.change(screen.getByTestId('register-confirm-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
    })

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByTestId('register-submit-button'))
    })

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('register-error-message')).toBeInTheDocument()
      expect(screen.getByTestId('register-error-message')).toHaveTextContent(errorMessage)
    })
  })

  test('shows loading state during submission', async () => {
    // Mock long response time
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderWithRouter(<RegisterForm {...defaultProps} />)

    // Fill in valid data
    await act(async () => {
      fireEvent.change(screen.getByTestId('register-fullname-input'), {
        target: { value: 'John Doe' }
      })
      fireEvent.change(screen.getByTestId('register-email-input'), {
        target: { value: 'test@example.com' }
      })
      fireEvent.change(screen.getByTestId('register-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
      fireEvent.change(screen.getByTestId('register-confirm-password-input'), {
        target: { value: 'StrongP@ss123' }
      })
    })

    // Submit form
    const submitButton = screen.getByTestId('register-submit-button')
    await act(async () => {
      fireEvent.click(submitButton)
    })

    // Check loading state
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/creating account/i)

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveTextContent(/create account/i)
    })
  })
}) 
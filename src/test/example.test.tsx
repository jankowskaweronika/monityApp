import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true)
  })

  it('should render and interact with a component', async () => {
    const user = userEvent.setup()
    render(<button>Click me</button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()

    await user.click(button)
  })
}) 
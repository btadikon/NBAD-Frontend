import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm'; // Adjust the path as necessary
import { BrowserRouter } from 'react-router-dom';

// Mock necessary hooks and modules
jest.mock('../../contexts/budget', () => ({
  useUrBudget: () => ({
    authStatus: false,
    setAuthStatus: jest.fn()
  })
}));

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({
    data: {
      user: { name: 'John Doe' },
      token: 'fake_token',
      refreshToken: 'fake_refresh_token',
      status: 200
    }
  }))
}));

// Helper to wrap component with router since `useNavigate` is used
const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('LoginForm', () => {
  it('renders correctly', () => {
    render(<LoginForm handleLogin={jest.fn()} />, { wrapper: Wrapper });

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('allows input to be entered', () => {
    render(<LoginForm handleLogin={jest.fn()} />, { wrapper: Wrapper });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    userEvent.type(emailInput, 'bharadwaaja43@gmail.com');
    userEvent.type(passwordInput, 'Ballu@4321');

    expect(emailInput.value).toBe('bharadwaaja43@gmail.com');
    expect(passwordInput.value).toBe('Ballu@4321');
  });

  it('submits the form and calls the handleLogin function on success', async () => {
    const handleLogin = jest.fn();
    render(<LoginForm handleLogin={handleLogin} />, { wrapper: Wrapper });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    userEvent.type(emailInput, 'test@example.com');
    userEvent.type(passwordInput, 'password');
    userEvent.click(loginButton);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalled();
    });
  });

  // Add more tests to handle login failure, visibility toggle for password, etc.
});

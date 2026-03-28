let localStorageMemory = {};
beforeAll(() => {
  global.localStorage = {
    getItem: (key) => localStorageMemory[key] ?? null,
    setItem: (key, value) => {
      localStorageMemory[key] = value;
    },
    removeItem: (key) => {
      delete localStorageMemory[key];
    },
    clear: () => {
      localStorageMemory = {};
    },
  };
  vi.spyOn(api, 'post');
});

vi.mock('../../components/Messages-States/Alerts.jsx', () => ({
  showLoginSuccess: vi.fn(() => Promise.resolve()),
  showLogoutSuccess: vi.fn(() => Promise.resolve()),
  showSessionExpired: vi.fn(() => Promise.resolve()),
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext.jsx';
import { vi } from 'vitest';

import api from '../../api/axios.js';

const TestComponent = () => {
  const {
    user,
    login,
    handleLogout,
    isLogged,
    isAdmin,
    loginError,
    registerError,
    registerUser,
  } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="isLogged">{isLogged ? 'yes' : 'no'}</div>
      <div data-testid="isAdmin">{isAdmin ? 'yes' : 'no'}</div>
      <div data-testid="loginError">{loginError || ''}</div>
      <div data-testid="registerError">{registerError || ''}</div>
      <button
        onClick={() => login({ email: 'test@test.com', password: '1234' })}
      >
        Login
      </button>
      <button
        onClick={() =>
          registerUser({ email: 'new@test.com', password: '1234' })
        }
      >
        Register
      </button>
      <button onClick={() => handleLogout(() => {})}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('should provide default values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('no-user');
    expect(screen.getByTestId('isLogged').textContent).toBe('no');
    expect(screen.getByTestId('isAdmin').textContent).toBe('no');
  });

  it('logs in successfully and sets user/token', async () => {
    const fakeToken =
      'header.' +
      btoa(JSON.stringify({ email: 'test@test.com', role: 'user' })) +
      '.sig';
    api.post.mockResolvedValue({
      data: { token: fakeToken },
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('test@test.com');
      expect(screen.getByTestId('isLogged').textContent).toBe('yes');
      expect(screen.getByTestId('isAdmin').textContent).toBe('no');
    });
    expect(localStorage.getItem('token')).toBe(fakeToken);
  });

  it('shows login error on 401', async () => {
    api.post.mockRejectedValue({
      response: { status: 401 },
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(screen.getByTestId('loginError').textContent).toMatch(
        /crendenciales incorrectas/i
      );
    });
  });

  it('registers user and sets user/token', async () => {
    const fakeToken =
      'header.' +
      btoa(JSON.stringify({ email: 'new@test.com', role: 'admin' })) +
      '.sig';
    api.post.mockResolvedValue({
      data: { token: fakeToken },
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Register'));
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('new@test.com');
      expect(screen.getByTestId('isLogged').textContent).toBe('yes');
      expect(screen.getByTestId('isAdmin').textContent).toBe('yes');
    });
    expect(localStorage.getItem('token')).toBe(fakeToken);
  });

  it('shows register error if email exists', async () => {
    api.post.mockRejectedValue({
      response: { status: 409, data: { error: 'email already exists' } },
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Register'));
    await waitFor(() => {
      expect(screen.getByTestId('registerError').textContent).toMatch(
        /ya está registrado/i
      );
    });
  });

  it('logs out and clears user/token', async () => {
    localStorage.setItem(
      'token',
      'header.' +
        btoa(JSON.stringify({ email: 'test@test.com', role: 'user' })) +
        '.sig'
    );
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await userEvent.click(screen.getByText('Logout'));
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('no-user');
      expect(screen.getByTestId('isLogged').textContent).toBe('no');
    });
    expect(localStorage.getItem('token')).toBeNull();
  });
});

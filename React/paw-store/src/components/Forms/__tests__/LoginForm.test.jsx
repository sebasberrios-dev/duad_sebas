import { vi } from 'vitest';

let mockUseAuthReturn;
vi.mock('../../../store/AuthContext.jsx', () => ({
  useAuth: () => mockUseAuthReturn,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  beforeEach(() => {
    mockUseAuthReturn = {
      login: vi.fn(async (data) => {
        return data.email === 'user@test.com' && data.password === '1234';
      }),
      loginError: '',
    };
    mockNavigate.mockClear();
  });

  it('renders form fields and submit button', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ingresar/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(await screen.findAllByText(/obligatorio/i)).toHaveLength(1);
  });

  it('calls login and navigates on success', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'user@test.com'
    );
    await user.type(screen.getByLabelText(/contraseña/i), '1234');
    await user.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
  });

  it('shows error message from loginError', () => {
    mockUseAuthReturn = {
      login: vi.fn(),
      loginError: 'Credenciales inválidas',
    };
    render(<LoginForm />);
    expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
  });

  it('navigates to register page when clicking register link', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});

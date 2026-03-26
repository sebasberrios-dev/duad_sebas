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
import { RegisterForm } from '../RegisterForm';

describe('RegisterForm', () => {
  beforeEach(() => {
    mockUseAuthReturn = {
      registerUser: vi.fn(async () => true),
      registerError: '',
    };
    mockNavigate.mockClear();
  });
  it('renders all fields and submit button', () => {
    render(<RegisterForm />);
    expect(
      screen.getByPlaceholderText(/Introduce tu nombre completo/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/nombre.apellido@ejemplo.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Introduce una contraseña/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Confirma la contraseña/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /registrarse/i })
    ).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    expect(await screen.findAllByText(/obligatorio/i)).toHaveLength(2);
    expect(await screen.findAllByText(/obligatoria/i)).toHaveLength(1);
    expect(await screen.findAllByText(/Necesitas confirmar/i)).toHaveLength(1);
  });

  it('shows error if passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.type(
      screen.getByPlaceholderText(/Introduce una contraseña/i),
      '1234'
    );
    await user.type(
      screen.getByPlaceholderText(/Confirma la contraseña/i),
      'abcd'
    );
    await user.click(screen.getByRole('button', { name: /registrarse/i }));
    expect(
      await screen.findByText(/las contraseñas no coinciden/i)
    ).toBeInTheDocument();
  });

  it('navigates to login page when clicking login link', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);
    await user.click(
      screen.getByRole('button', { name: /ya tengo una cuenta/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

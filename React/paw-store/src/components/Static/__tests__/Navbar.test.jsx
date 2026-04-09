import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Navbar from '../Navbar';
import { useAuth } from '../../../store/AuthContext.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../../store/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

const guestAuth = () => ({
  isLogged: false,
  isAdmin: false,
  user: null,
  handleLogout: vi.fn(),
});

const userAuth = () => ({
  isLogged: true,
  isAdmin: false,
  user: { role: 'user' },
  handleLogout: vi.fn(),
});

const adminAuth = () => ({
  isLogged: true,
  isAdmin: true,
  user: { role: 'admin' },
  handleLogout: vi.fn(),
});

const renderNavbar = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  let user;

  beforeEach(() => {
    mockNavigate.mockReset();
    user = userEvent.setup();
  });

  describe('common elements', () => {
    it('renders logo and brand name', () => {
      useAuth.mockReturnValue(guestAuth());
      renderNavbar();

      expect(screen.getByAltText('PawPrint Logo')).toBeInTheDocument();
      expect(screen.getByText('PawStore')).toBeInTheDocument();
    });

    it('renders public navigation links', () => {
      useAuth.mockReturnValue(guestAuth());
      renderNavbar();

      expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
        'href',
        '/'
      );
      expect(screen.getByRole('link', { name: 'Productos' })).toHaveAttribute(
        'href',
        '/products'
      );
      expect(screen.getByRole('link', { name: 'Contacto' })).toHaveAttribute(
        'href',
        '/contact'
      );
    });
  });

  describe('guest user (not logged in)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue(guestAuth());
    });

    it('shows "Iniciar sesión" link', () => {
      renderNavbar();

      expect(
        screen.getByRole('link', { name: 'Iniciar sesión' })
      ).toHaveAttribute('href', '/login');
    });

    it('does not show logged-in elements', () => {
      renderNavbar();

      expect(screen.queryByText('Carrito')).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument();
      expect(screen.queryByText(/Usuario:/)).not.toBeInTheDocument();
    });

    it('does not show "Administración" link', () => {
      renderNavbar();

      expect(screen.queryByText('Administración')).not.toBeInTheDocument();
    });
  });

  describe('logged-in user (non-admin)', () => {
    beforeEach(() => {
      useAuth.mockReturnValue(userAuth());
    });

    it('shows "Carrito" link', () => {
      renderNavbar();

      expect(screen.getByRole('link', { name: 'Carrito' })).toHaveAttribute(
        'href',
        '/cart'
      );
    });

    it('shows user role label', () => {
      renderNavbar();

      expect(screen.getByText('Usuario: user')).toBeInTheDocument();
    });

    it('shows "Cerrar sesión" button', () => {
      renderNavbar();

      expect(
        screen.getByRole('button', { name: 'Cerrar sesión' })
      ).toBeInTheDocument();
    });

    it('does not show "Iniciar sesión" link', () => {
      renderNavbar();

      expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
    });

    it('does not show "Administración" link', () => {
      renderNavbar();

      expect(screen.queryByText('Administración')).not.toBeInTheDocument();
    });

    it('calls handleLogout with navigate when clicking "Cerrar sesión"', async () => {
      const auth = userAuth();
      useAuth.mockReturnValue(auth);
      renderNavbar();

      await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

      expect(auth.handleLogout).toHaveBeenCalledWith(mockNavigate);
    });
  });

  describe('admin user', () => {
    beforeEach(() => {
      useAuth.mockReturnValue(adminAuth());
    });

    it('shows "Administración" link', () => {
      renderNavbar();

      expect(
        screen.getByRole('link', { name: 'Administración' })
      ).toHaveAttribute('href', '/admin/products');
    });

    it('shows user role as admin', () => {
      renderNavbar();

      expect(screen.getByText('Usuario: admin')).toBeInTheDocument();
    });

    it('shows all logged-in elements', () => {
      renderNavbar();

      expect(screen.getByRole('link', { name: 'Carrito' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Cerrar sesión' })
      ).toBeInTheDocument();
    });
  });
});

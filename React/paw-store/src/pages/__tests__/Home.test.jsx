import { render, screen } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Home } from '../Home';
import { useProductsStore } from '../../store/useProductsStore';

describe('Home', () => {
  it('renders home page layout', () => {
    renderHome();

    expect(screen.getByText('Bienvenido a PawStore')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Somos una tienda dedicada a ofrecer productos de calidad para tus mascotas.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Explora nuestro catálogo para encontrar camas, juguetes, accesorios y más.'
      )
    ).toBeInTheDocument();
  });

  it('renders link to products page', () => {
    renderHome();

    const link = screen.getByRole('link', { name: /Ver Productos/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
  });

  let mockFetchMostPurchased;
  const sampleProducts = [
    {
      id: 1,
      name: 'Cama Deluxe',
      price: 20000,
      category: 'Camas',
      stock: 5,
      description: 'Cama cómoda para mascotas',
      image_url: '/img/cama.jpg',
    },
  ];

  const defaultState = (overrides = {}) => ({
    mostPurchasedProducts: [],
    loading: { fetchingMostPurchased: false },
    error: { action: null },
    fetchMostPurchased: mockFetchMostPurchased,
    ...overrides,
  });

  const renderHome = () =>
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockFetchMostPurchased = vi.fn();
    useProductsStore.setState(defaultState());
  });

  it('shows loading message when fetching most purchased', () => {
    useProductsStore.setState(
      defaultState({ loading: { fetchingMostPurchased: true } })
    );
    renderHome();
    expect(
      screen.getByText(/Cargando productos destacados.../i)
    ).toBeInTheDocument();
  });

  it('shows error message if actionError exists', () => {
    useProductsStore.setState(
      defaultState({ error: { action: 'Error de API' } })
    );
    renderHome();
    expect(screen.getByText(/Error de API/i)).toBeInTheDocument();
  });

  it('shows message if no featured products', () => {
    useProductsStore.setState(defaultState({ mostPurchasedProducts: [] }));
    renderHome();
    expect(
      screen.getByText(/No hay productos destacados disponibles/i)
    ).toBeInTheDocument();
  });

  it('renders featured products', () => {
    useProductsStore.setState(
      defaultState({ mostPurchasedProducts: sampleProducts })
    );
    renderHome();
    expect(screen.getByText('Cama Deluxe')).toBeInTheDocument();
  });
});

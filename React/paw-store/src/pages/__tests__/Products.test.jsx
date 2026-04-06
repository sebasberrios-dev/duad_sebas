// Mock localStorage para entorno de test
beforeAll(() => {
  global.localStorage = {
    getItem: vi.fn((key) => (key === 'token' ? 'fake-token' : null)),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
});
import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Products from '../Products';
import { useProductsStore } from '../../store/useProductsStore';

vi.mock('../../store/CartContext.jsx', () => ({
  useCart: () => ({ initializeCart: vi.fn() }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

const sampleProducts = [
  {
    id: 1,
    name: 'Collar Premium',
    image_url: '/img/collar.jpg',
    price: 15000,
    category: 'Accesorios',
    stock: 5,
  },
  {
    id: 2,
    name: 'Alimento Natural',
    image_url: '/img/alimento.jpg',
    price: 25000,
    category: 'Alimentación',
    stock: 2,
  },
];

describe('Products', () => {
  let user;
  let mockFetchProducts;

  const defaultState = () => ({
    products: sampleProducts,
    loading: {
      fetchingProducts: false,
      fetchingMostPurchased: false,
      addingProduct: false,
      updatingProduct: false,
      deletingProduct: false,
    },
    error: { screen: null, action: null },
    fetchProducts: mockFetchProducts,
  });

  const renderProducts = () =>
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockFetchProducts = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();
  });

  it('renders product catalog layout with products', () => {
    useProductsStore.setState(defaultState());
    renderProducts();

    expect(screen.getByText('Catalogo de Productos')).toBeInTheDocument();
    expect(screen.getByText('Collar Premium')).toBeInTheDocument();
    expect(screen.getByText('₡15000')).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();
    expect(screen.getByText('Alimento Natural')).toBeInTheDocument();
    expect(screen.getByText('₡25000')).toBeInTheDocument();
    expect(screen.getByText('Alimentación')).toBeInTheDocument();
  });

  it('renders a "Ver detalles" button for each product', () => {
    useProductsStore.setState(defaultState());
    renderProducts();

    const buttons = screen.getAllByRole('button', { name: /Ver detalles/i });
    expect(buttons).toHaveLength(2);
  });

  it('shows loading when products are loading', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
      loading: {
        ...defaultState().loading,
        fetchingProducts: true,
      },
    });
    renderProducts();

    expect(screen.getByText('Cargando catálogo...')).toBeInTheDocument();
  });

  it('shows error when there is an error', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
      error: { screen: 'Error de conexión', action: null },
    });
    renderProducts();

    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('shows no products message when products array is empty', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
    });
    renderProducts();

    expect(
      screen.getByText('No se encontraron productos disponibles')
    ).toBeInTheDocument();
  });

  it('shows no products message when all products have stock 0', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [
        { ...sampleProducts[0], stock: 0 },
        { ...sampleProducts[1], stock: 0 },
      ],
    });
    renderProducts();

    expect(
      screen.getByText('No se encontraron productos disponibles')
    ).toBeInTheDocument();
  });

  it('calls fetchProducts on mount if products array is empty', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
    });
    renderProducts();

    expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchProducts if products already loaded', () => {
    useProductsStore.setState(defaultState());
    renderProducts();

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });

  it('navigates to product detail when clicking "Ver detalles"', async () => {
    useProductsStore.setState(defaultState());
    renderProducts();

    const buttons = screen.getAllByRole('button', { name: /Ver detalles/i });
    await user.click(buttons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/products/1');
  });
});

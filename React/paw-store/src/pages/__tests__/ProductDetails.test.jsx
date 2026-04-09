import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import ProductDetail from '../ProductDetails';
import { useProductsStore } from '../../store/useProductsStore';

let mockCartContext = {};
vi.mock('../../store/CartContext.jsx', () => ({
  useCart: () => mockCartContext,
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../components/Messages-States/Alerts.jsx', () => ({
  showAlertError: vi.fn(),
}));

const sampleProduct = {
  id: 5,
  name: 'Collar Premium',
  image_url: '/img/collar.jpg',
  price: 15000,
  category: 'Accesorios',
  description: 'Collar premium para mascotas',
};

const renderWithRoute = (productId = '5') =>
  render(
    <MemoryRouter initialEntries={[`/products/${productId}`]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('ProductDetails', () => {
  let user;
  let mockFetchProducts;
  let mockAddToCart;

  beforeEach(() => {
    mockFetchProducts = vi.fn();
    mockAddToCart = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();

    useProductsStore.setState({
      products: [sampleProduct],
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

    mockCartContext = {
      initializingCart: false,
      syncingCart: false,
      addingItemId: null,
      removingItemId: null,
      screenError: null,
      actionError: null,
      addToCart: mockAddToCart,
      initializeCart: vi.fn(),
      cartId: 1,
      cartItems: [],
    };
  });

  it('renders product details layout', () => {
    renderWithRoute();

    expect(screen.getByText('Collar Premium')).toBeInTheDocument();
    expect(screen.getByText('₡15000')).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();
    expect(
      screen.getByText(/Collar premium para mascotas/)
    ).toBeInTheDocument();
    expect(screen.getByAltText('Producto')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderWithRoute();

    expect(
      screen.getByRole('button', { name: /Añadir al carrito/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    ).toBeInTheDocument();
  });

  it('shows loading when products are loading', () => {
    useProductsStore.setState({
      loading: {
        fetchingProducts: true,
        fetchingMostPurchased: false,
        addingProduct: false,
        updatingProduct: false,
        deletingProduct: false,
      },
      products: [],
    });
    renderWithRoute();

    expect(screen.getByText('Cargando producto...')).toBeInTheDocument();
  });

  it('shows error when there is an error', () => {
    useProductsStore.setState({
      error: { screen: 'Error de conexión', action: null },
      products: [],
    });
    renderWithRoute();

    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('calls fetchProducts on mount if products array is empty', () => {
    useProductsStore.setState({ products: [] });
    renderWithRoute();

    expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchProducts if products already loaded', () => {
    renderWithRoute();

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });

  it('renders nothing if product is not found', () => {
    renderWithRoute('999');

    expect(screen.queryByText('Collar Premium')).not.toBeInTheDocument();
  });

  it('calls addToCart when clicking "Añadir al carrito"', async () => {
    renderWithRoute();

    await user.click(
      screen.getByRole('button', { name: /Añadir al carrito/i })
    );

    expect(mockAddToCart).toHaveBeenCalledWith({
      product_id: 5,
      quantity: 1,
    });
  });

  it('disables button and shows "Añadiendo..." while adding to cart', () => {
    mockCartContext = {
      ...mockCartContext,
      addingItemId: 5,
      addToCart: mockAddToCart,
    };
    renderWithRoute();

    const btn = screen.getByRole('button', { name: /Añadiendo/i });
    expect(btn).toBeDisabled();
  });

  it('navigates to /products when clicking "Volver al catálogo"', async () => {
    renderWithRoute();

    await user.click(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });
});

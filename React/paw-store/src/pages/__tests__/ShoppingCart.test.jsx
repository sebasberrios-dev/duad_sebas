import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ShoppingCart from '../BuyingProcess/ShoppingCart';
import { usePurchaseStore } from '../../store/usePurchaseStore';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../components/Messages-States/Alerts.jsx', () => ({
  showAlertError: vi.fn(),
}));

let mockCartContext = {};
vi.mock('../../store/CartContext.jsx', () => ({
  useCart: () => mockCartContext,
}));

const sampleItems = [
  {
    product_id: 1,
    name: 'Product 1',
    image_url: '/test/test.jpg',
    price: 23000,
    quantity: 2,
  },
];

describe('Shopping Cart', () => {
  let user;
  let mockInitializeCart;
  let mockRemoveFromCart;
  let mockSyncCart;
  let mockCreateOrder;

  const defaultCartContext = () => ({
    initializingCart: false,
    syncingCart: false,
    screenError: null,
    initializeCart: mockInitializeCart,
    cartId: 1,
    cartItems: sampleItems,
    increaseQuantity: vi.fn(),
    decreaseQuantity: vi.fn(),
    removingItemId: null,
    removeFromCart: mockRemoveFromCart,
    syncCart: mockSyncCart,
  });

  const renderCart = () =>
    render(
      <MemoryRouter>
        <ShoppingCart />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockInitializeCart = vi.fn();
    mockRemoveFromCart = vi.fn();
    mockSyncCart = vi.fn();
    mockCreateOrder = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();

    mockCartContext = defaultCartContext();

    usePurchaseStore.setState({
      loading: { creatingOrder: false },
      createOrder: mockCreateOrder,
    });
  });

  it('calls initializeCart on mount', () => {
    renderCart();

    expect(mockInitializeCart).toHaveBeenCalledTimes(1);
  });

  it('shows loading when the cart is initializing', () => {
    mockCartContext = { ...defaultCartContext(), initializingCart: true };
    renderCart();

    expect(screen.getByText('Cargando carrito...')).toBeInTheDocument();
  });

  it('shows error when there is a screen error', () => {
    mockCartContext = {
      ...defaultCartContext(),
      screenError: 'Error de conexión',
    };
    renderCart();

    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument();
  });

  it('renders cart layout with items', () => {
    renderCart();

    expect(screen.getByText('Carrito de compras')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByAltText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Precio: ₡23000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: ₡46000')).toBeInTheDocument();
  });

  it('renders cart action buttons', () => {
    renderCart();

    expect(
      screen.getByRole('button', { name: /Aumentar cantidad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Eliminar del carrito/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Continuar al checkout/i })
    ).toBeInTheDocument();
  });

  it('calls removeFromCart when clicking remove button', async () => {
    renderCart();

    await user.click(
      screen.getByRole('button', { name: /Eliminar del carrito/i })
    );

    expect(mockRemoveFromCart).toHaveBeenCalledTimes(1);
  });

  it('calls syncCart, createOrder and navigates when clicking continue', async () => {
    renderCart();

    await user.click(
      screen.getByRole('button', { name: /Continuar al checkout/i })
    );

    expect(mockSyncCart).toHaveBeenCalledTimes(1);
    expect(mockCreateOrder).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});

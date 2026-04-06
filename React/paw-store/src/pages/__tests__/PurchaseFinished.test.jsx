import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import PurchaseFinished from '../BuyingProcess/PurchaseFinished';
import { usePurchaseStore } from '../../store/usePurchaseStore';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockCartContext = {};
vi.mock('../../store/CartContext.jsx', () => ({
  useCart: () => mockCartContext,
}));

const sampleItems = [
  {
    id: 1,
    name: 'Product 1',
    image_url: '/test/test.jpg',
    price: 23000,
    quantity: 2,
  },
];

describe('Purchase Finished', () => {
  let user;
  let mockClearCart;
  let mockClearCheckout;

  const defaultCartContext = () => ({
    cartItems: sampleItems,
    clearCart: mockClearCart,
    checkoutProccess: true,
    cartId: 1,
  });

  const renderFinished = () =>
    render(
      <MemoryRouter>
        <PurchaseFinished />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockClearCart = vi.fn();
    mockClearCheckout = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();

    mockCartContext = defaultCartContext();

    usePurchaseStore.setState({
      clearCheckout: mockClearCheckout,
    });
  });

  it('renders purchase success layout', () => {
    renderFinished();

    expect(screen.getByText('Compra realizada con éxito')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación con los detalles de tu compra.'
      )
    ).toBeInTheDocument();
  });

  it('renders purchase summary layout', () => {
    renderFinished();

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('₡23000')).toBeInTheDocument();
    expect(screen.getAllByText('₡46000')).toHaveLength(2);
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    renderFinished();

    expect(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ir al inicio/i })
    ).toBeInTheDocument();
  });

  it('navigates to /products and calls clearCart when clicking "Volver al catálogo"', async () => {
    renderFinished();

    await user.click(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    );

    expect(mockClearCart).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  it('navigates to / and calls clearCart when clicking "Ir al inicio"', async () => {
    renderFinished();

    await user.click(screen.getByRole('button', { name: /Ir al inicio/i }));

    expect(mockClearCart).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls clearCart on unmount', () => {
    const { unmount } = renderFinished();

    unmount();

    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  it('calls clearCart only once even if triggered multiple times', async () => {
    const { unmount } = renderFinished();

    await user.click(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    );
    unmount();

    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });
});

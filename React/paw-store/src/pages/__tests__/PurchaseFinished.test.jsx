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
  let mockClearInfo;

  const defaultState = () => ({
    checkoutProccess: true,
    cart: { cartId: 1, items: sampleItems },
    clearInfo: mockClearInfo,
  });

  const renderFinished = () =>
    render(
      <MemoryRouter>
        <PurchaseFinished />
      </MemoryRouter>
    );

  beforeEach(() => {
    mockClearInfo = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();
  });

  it('renders purchase success layout', () => {
    usePurchaseStore.setState(defaultState());
    renderFinished();

    expect(screen.getByText('Compra realizada con éxito')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación con los detalles de tu compra.'
      )
    ).toBeInTheDocument();
  });

  it('renders purchase summary layout', () => {
    usePurchaseStore.setState(defaultState());
    renderFinished();

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('₡23000')).toBeInTheDocument();
    expect(screen.getAllByText('₡46000')).toHaveLength(2);
    expect(screen.getByText('Total:')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    usePurchaseStore.setState(defaultState());
    renderFinished();

    expect(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Ir al inicio/i })
    ).toBeInTheDocument();
  });

  it('navigates to /products and calls clearInfo when clicking "Volver al catálogo"', async () => {
    usePurchaseStore.setState(defaultState());
    renderFinished();

    await user.click(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    );

    expect(mockClearInfo).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  it('navigates to / and calls clearInfo when clicking "Ir al inicio"', async () => {
    usePurchaseStore.setState(defaultState());
    renderFinished();

    await user.click(screen.getByRole('button', { name: /Ir al inicio/i }));

    expect(mockClearInfo).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('calls clearInfo on unmount', () => {
    usePurchaseStore.setState(defaultState());
    const { unmount } = renderFinished();

    unmount();

    expect(mockClearInfo).toHaveBeenCalledTimes(1);
  });

  it('calls clearInfo only once even if triggered multiple times', async () => {
    usePurchaseStore.setState(defaultState());
    const { unmount } = renderFinished();

    await user.click(
      screen.getByRole('button', { name: /Volver al catálogo/i })
    );
    unmount();

    expect(mockClearInfo).toHaveBeenCalledTimes(1);
  });
});

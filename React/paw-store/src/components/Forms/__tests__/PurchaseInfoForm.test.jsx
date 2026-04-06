import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import PurchaseInfoForm from '../PurchaseInfoForm';
import { MemoryRouter } from 'react-router';
import { usePurchaseStore } from '../../../store/usePurchaseStore';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../Messages-States/Alerts.jsx', () => ({
  showAlertConfirm: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showAlertError: vi.fn(),
  showAlertSuccess: vi.fn(),
  showAlertLoading: vi.fn(),
  closeAlert: vi.fn(),
}));

let mockCartContext = {};
vi.mock('../../../store/CartContext.jsx', () => ({
  useCart: () => mockCartContext,
}));

describe('Purchase Form', () => {
  let user;
  let mockCreateCheckoutData;
  let mockCompletePurchase;
  let mockConfirmOrder;
  let mockClearCart;
  let mockClearCheckout;

  beforeEach(() => {
    mockCreateCheckoutData = vi.fn().mockResolvedValue();
    mockCompletePurchase = vi.fn().mockResolvedValue();
    mockConfirmOrder = vi.fn().mockResolvedValue();
    mockClearCart = vi.fn().mockResolvedValue();
    mockClearCheckout = vi.fn();

    mockCartContext = {
      checkoutProccess: true,
      cartId: 1,
      cartItems: [
        {
          id: 1,
          product_id: 1,
          name: 'Product 1',
          image_url: '/test/test.jpg',
          price: 12000,
          quantity: 2,
        },
        {
          id: 2,
          product_id: 2,
          name: 'Product 2',
          image_url: '/test2/test2.jpg',
          price: 21000,
          quantity: 3,
        },
      ],
      clearCart: mockClearCart,
    };

    usePurchaseStore.setState({
      createCheckoutData: mockCreateCheckoutData,
      completePurchase: mockCompletePurchase,
      confirmOrder: mockConfirmOrder,
      clearCheckout: mockClearCheckout,
    });

    user = userEvent.setup();

    render(
      <MemoryRouter>
        <PurchaseInfoForm />
      </MemoryRouter>
    );
  });

  it('renders all items in the order summary', () => {
    // item 1
    expect(screen.getByText('Product 1'));
    expect(screen.getByText('2 x ₡12000'));
    expect(screen.getByText('₡24000'));
    // item 2
    expect(screen.getByText('Product 2'));
    expect(screen.getByText('3 x ₡21000'));
    expect(screen.getByText('₡63000'));
  });

  it('submits the form and navigates on success', async () => {
    await user.type(
      screen.getByPlaceholderText('Introduce tu nombre completo'),
      'John'
    );
    await user.type(
      screen.getByPlaceholderText('Introduce tu correo electrónico'),
      'john@email.com'
    );
    await user.type(
      screen.getByPlaceholderText('Introduce tu dirección'),
      '89 Cleveland Avenue Rego Park, NY 11374'
    );

    await user.type(
      screen.getByPlaceholderText('Introduce tu número de teléfono'),
      '88887777'
    );

    await user.click(screen.getByText('Confirmar compra'));

    expect(mockCreateCheckoutData).toHaveBeenCalledWith({
      fullName: 'John',
      email: 'john@email.com',
      address: '89 Cleveland Avenue Rego Park, NY 11374',
      phoneNumber: '88887777',
    });
    expect(mockCompletePurchase).toHaveBeenCalled();
    expect(mockConfirmOrder).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/purchase-finished');
  });

  it('shows validation errors when fields are empty', async () => {
    await user.click(screen.getByText('Confirmar compra'));

    expect(screen.getByText('Nombre completo obligatorio')).toBeInTheDocument();
    expect(
      screen.getByText('Correo electrónico obligatorio')
    ).toBeInTheDocument();
    expect(screen.getByText('Dirección obligatoria')).toBeInTheDocument();
    expect(
      screen.getByText('Número de teléfono obligatorio')
    ).toBeInTheDocument();
  });

  it('calls cancel flow when clicking cancel', async () => {
    const { showAlertConfirm, showAlertSuccess, showAlertLoading, closeAlert } =
      await import('../../Messages-States/Alerts.jsx');

    const nameInput = screen.getByPlaceholderText(
      'Introduce tu nombre completo'
    );

    await user.type(nameInput, 'John');
    expect(nameInput).toHaveValue('John');

    await user.click(screen.getByText('Cancelar'));

    expect(showAlertConfirm).toHaveBeenCalledTimes(1);
    expect(showAlertLoading).toHaveBeenCalledWith('Cancelando compra...');
    expect(nameInput).toHaveValue('');
    expect(mockClearCart).toHaveBeenCalled();
    expect(closeAlert).toHaveBeenCalledTimes(1);
    expect(showAlertSuccess).toHaveBeenCalledWith(
      'Compra cancelada',
      'Se canceló la compra con éxito'
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('Edge case: checkoutProccess = false', () => {
    it('redirects to home if user is not in checkout proccess', () => {
      mockCartContext = { ...mockCartContext, checkoutProccess: false };

      render(
        <MemoryRouter>
          <PurchaseInfoForm />
        </MemoryRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

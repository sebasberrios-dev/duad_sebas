import { act } from '@testing-library/react';
import { usePurchaseStore } from '../usePurchaseStore.jsx';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';

import api from '../../api/axios.js';

const initialCart = {
  cartId: 1,
  items: [{ product_id: 1, quantity: 2, price: 1000 }],
};
const initialCheckout = {
  order: { id: 10, totalPrice: 2000, status: 'pending' },
  customer: { fullName: 'John', email: 'john@mail.com', phoneNumber: '123' },
  shipping: { address: 'Street 1' },
};

describe('usePurchaseStore', () => {
  beforeAll(() => {
    vi.spyOn(api, 'get');
    vi.spyOn(api, 'post');
    vi.spyOn(api, 'put');
    vi.spyOn(api, 'delete');
  });
  beforeEach(() => {
    usePurchaseStore.setState({
      checkoutProccess: false,
      cart: { cartId: null, items: [] },
      checkout: {
        order: { id: null, totalPrice: null, status: '' },
        customer: { fullName: '', email: '', phoneNumber: '' },
        shipping: { address: '' },
      },
      loading: {
        initializingCart: false,
        syncingCart: false,
        addingItemId: null,
        removingItemId: null,
        creatingOrder: false,
        creatingCheckoutData: false,
        completingPurchase: false,
        confirmingOrder: false,
        clearingInfo: false,
      },
      error: { screen: null, action: null },
    });
    vi.resetAllMocks();
  });

  it('fetches cart and items', async () => {
    const { useProductsStore } = await import('../useProductsStore.jsx');
    useProductsStore.setState({
      products: [{ id: 1, name: 'Product 1', stock: 5 }],
      loading: {},
      error: {},
    });
    api.get.mockResolvedValueOnce({ data: { cart: { id: 1 } } });
    api.get.mockResolvedValueOnce({
      data: { products_in_cart: [{ product_id: 1, quantity: 2 }] },
    });
    await act(async () => {
      await usePurchaseStore.getState().initializeCart();
    });
    expect(usePurchaseStore.getState().cart.cartId).toBe(1);
    expect(usePurchaseStore.getState().cart.items).toHaveLength(1);
  });

  it('adds to cart', async () => {
    usePurchaseStore.setState({ cart: { cartId: 1, items: [] } });
    api.post.mockResolvedValue({
      data: { product: { product_id: 2, quantity: 1 } },
    });
    await act(async () => {
      await usePurchaseStore
        .getState()
        .addToCart({ product_id: 2, quantity: 1 });
    });
    expect(usePurchaseStore.getState().cart.items[0].product_id).toBe(2);
  });

  it('removes from cart', async () => {
    usePurchaseStore.setState({
      cart: { cartId: 1, items: [{ product_id: 2, quantity: 1 }] },
    });
    api.delete.mockResolvedValue({});
    await act(async () => {
      await usePurchaseStore.getState().removeFromCart(2);
    });
    expect(usePurchaseStore.getState().cart.items).toHaveLength(0);
  });

  it('increases and decreases quantity', () => {
    usePurchaseStore.setState({
      cart: { cartId: 1, items: [{ product_id: 1, quantity: 2 }] },
    });
    usePurchaseStore.getState().increaseQuantity(1);
    expect(usePurchaseStore.getState().cart.items[0].quantity).toBe(3);
    usePurchaseStore.getState().decreaseQuantity(1);
    expect(usePurchaseStore.getState().cart.items[0].quantity).toBe(2);
  });

  it('syncs cart', async () => {
    usePurchaseStore.setState({ cart: initialCart });
    api.post.mockResolvedValue({});
    await act(async () => {
      await usePurchaseStore.getState().syncCart();
    });
    expect(usePurchaseStore.getState().checkoutProccess).toBe(true);
  });

  it('creates order', async () => {
    usePurchaseStore.setState({ cart: initialCart });
    api.post.mockResolvedValue({
      data: { order: { id: 10, total_price: 2000, status: 'pending' } },
    });
    await act(async () => {
      await usePurchaseStore.getState().createOrder();
    });
    expect(usePurchaseStore.getState().checkout.order.id).toBe(10);
  });

  it('creates checkout data', async () => {
    usePurchaseStore.setState({ checkout: { ...initialCheckout } });
    api.post.mockResolvedValue({
      data: {
        billing_info: {
          full_name: 'John',
          email: 'john@mail.com',
          phone_number: '123',
          shipping_address: 'Street 1',
        },
      },
    });
    await act(async () => {
      await usePurchaseStore.getState().createCheckoutData({
        fullName: 'John',
        email: 'john@mail.com',
        address: 'Street 1',
        phoneNumber: '123',
      });
    });
    expect(usePurchaseStore.getState().checkout.customer.fullName).toBe('John');
  });

  it('completes purchase', async () => {
    usePurchaseStore.setState({
      cart: { cartId: 1, items: [{ product_id: 1, quantity: 2, price: 1000 }] },
      checkout: {
        ...initialCheckout,
        order: { id: 10, totalPrice: 2000, status: 'pending' },
      },
    });
    api.put.mockImplementation((url) => {
      if (url.startsWith('/products/reduce_stock/')) {
        return Promise.resolve({});
      }
      if (url.startsWith('/checkout/complete_order/')) {
        return Promise.resolve({
          data: { order: { id: 10, total_price: 2000, status: 'completed' } },
        });
      }
      return Promise.resolve({});
    });
    await act(async () => {
      await usePurchaseStore.getState().completePurchase();
    });
    expect(usePurchaseStore.getState().checkout.order.status).toBe('completed');
  });

  it('confirms order', async () => {
    usePurchaseStore.setState({
      cart: { cartId: 1, items: [] },
      checkout: {
        ...initialCheckout,
        order: { id: 10, totalPrice: 2000, status: 'completed' },
        customer: { ...initialCheckout.customer, email: 'john@mail.com' },
      },
    });
    api.post.mockResolvedValue({});
    await act(async () => {
      await usePurchaseStore.getState().confirmOrder();
    });
    expect(usePurchaseStore.getState().error.action).toBeFalsy();
  });

  it('clears info', async () => {
    usePurchaseStore.setState({ cart: initialCart });
    api.delete.mockResolvedValue({});
    await act(async () => {
      await usePurchaseStore.getState().clearInfo();
    });
    expect(usePurchaseStore.getState().cart.items).toHaveLength(0);
    expect(usePurchaseStore.getState().checkoutProccess).toBe(false);
  });
});

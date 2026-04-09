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
      checkout: {
        order: { id: null, totalPrice: null, status: '' },
        customer: { fullName: '', email: '', phoneNumber: '' },
        shipping: { address: '' },
      },
      loading: {
        creatingOrder: false,
        creatingCheckoutData: false,
        completingPurchase: false,
        confirmingOrder: false,
      },
      error: { action: null },
    });
    vi.resetAllMocks();
  });

  it('creates order', async () => {
    api.post.mockResolvedValue({
      data: { order: { id: 10, total_price: 2000, status: 'pending' } },
    });
    await act(async () => {
      await usePurchaseStore
        .getState()
        .createOrder(initialCart.cartId, initialCart.items);
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
      await usePurchaseStore
        .getState()
        .completePurchase(initialCart.cartId, initialCart.items);
    });
    expect(usePurchaseStore.getState().checkout.order.status).toBe('completed');
  });

  it('confirms order', async () => {
    usePurchaseStore.setState({
      checkout: {
        ...initialCheckout,
        order: { id: 10, totalPrice: 2000, status: 'completed' },
        customer: { ...initialCheckout.customer, email: 'john@mail.com' },
      },
    });
    api.post.mockResolvedValue({});
    await act(async () => {
      await usePurchaseStore.getState().confirmOrder(initialCart.cartId);
    });
    expect(usePurchaseStore.getState().error.action).toBeFalsy();
  });

  it('clears checkout', () => {
    usePurchaseStore.setState({ checkout: initialCheckout });
    usePurchaseStore.getState().clearCheckout();
    expect(usePurchaseStore.getState().checkout.order.id).toBeNull();
    expect(usePurchaseStore.getState().checkout.customer.fullName).toBe('');
  });
});

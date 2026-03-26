import { act } from '@testing-library/react';
import { useProductsStore } from '../useProductsStore.jsx';
import { vi } from 'vitest';

import api from '../../api/axios.js';

describe('useProductsStore', () => {
  beforeAll(() => {
    vi.spyOn(api, 'get');
    vi.spyOn(api, 'post');
    vi.spyOn(api, 'put');
    vi.spyOn(api, 'delete');
  });
  beforeEach(() => {
    useProductsStore.setState({
      products: [],
      mostPurchasedProducts: [],
      loading: {
        fetchingProducts: false,
        fetchingMostPurchased: false,
        addingProduct: false,
        updatingProduct: false,
        deletingProduct: false,
      },
      error: { screen: null, action: null },
    });
    vi.resetAllMocks();
  });

  it('fetches products successfully', async () => {
    const fakeProducts = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    api.get.mockResolvedValue({ data: fakeProducts });
    await act(async () => {
      await useProductsStore.getState().fetchProducts();
    });
    expect(useProductsStore.getState().products).toEqual(fakeProducts);
    expect(useProductsStore.getState().loading.fetchingProducts).toBe(false);
    expect(useProductsStore.getState().error.screen).toBe(null);
  });

  it('handles fetchProducts error', async () => {
    api.get.mockRejectedValue({ response: { data: { error: 'fail' } } });
    await act(async () => {
      await useProductsStore.getState().fetchProducts();
    });
    expect(useProductsStore.getState().error.screen).toBe('fail');
    expect(useProductsStore.getState().loading.fetchingProducts).toBe(false);
  });

  it('fetches most purchased products', async () => {
    const fake = { products: [{ id: 1, name: 'Top' }] };
    api.get.mockResolvedValue({ data: fake });
    await act(async () => {
      await useProductsStore.getState().fetchMostPurchased();
    });
    expect(useProductsStore.getState().mostPurchasedProducts).toEqual(
      fake.products
    );
    expect(useProductsStore.getState().loading.fetchingMostPurchased).toBe(
      false
    );
    expect(useProductsStore.getState().error.action).toBe(null);
  });

  it('adds a product', async () => {
    const newProduct = { id: 3, name: 'C', price: 10, stock: 5 };
    api.post.mockResolvedValue({ data: newProduct });
    useProductsStore.setState({ products: [{ id: 1 }, { id: 2 }] });
    await act(async () => {
      await useProductsStore.getState().addProduct(newProduct);
    });
    expect(useProductsStore.getState().products).toHaveLength(3);
    expect(useProductsStore.getState().products[2]).toEqual(newProduct);
  });

  it('updates a product', async () => {
    const updated = { id: 2, name: 'B2' };
    api.put.mockResolvedValue({ data: updated });
    useProductsStore.setState({
      products: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
    });
    await act(async () => {
      await useProductsStore.getState().updateProduct(2, updated);
    });
    expect(useProductsStore.getState().products[1]).toEqual(updated);
  });

  it('deletes a product', async () => {
    api.delete.mockResolvedValue({});
    useProductsStore.setState({ products: [{ id: 1 }, { id: 2 }] });
    await act(async () => {
      await useProductsStore.getState().deleteProduct(1);
    });
    expect(useProductsStore.getState().products).toEqual([{ id: 2 }]);
  });
});

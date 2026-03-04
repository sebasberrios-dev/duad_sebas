import { create } from 'zustand';
import api from '../api/axios.js';

export const useProductsStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/products');

      set({ products: response.data.products, loading: false });
      console.log('Productos obtenidos:', response.data.products);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.get(`/products/${id}`);

      set({ loading: false, error: null });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  addProduct: async (productData) => {
    try {
      set({ loading: true, error: null });

      const response = await api.post('/products', productData);

      const newProduct = response.data;

      set({
        products: [...get().products, newProduct],
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateProduct: async (id, updateData) => {
    try {
      set({ loading: true, error: null });

      const response = await api.put(`/products/update/${id}`, updateData);

      const updatedProduct = response.data.product;

      set({
        products: get().products.map((product) =>
          product.id === id ? updatedProduct : product
        ),
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/products/delete/${id}`);

      set({
        products: get().products.filter((product) => product.id !== id),
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

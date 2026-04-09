import { create } from 'zustand';
import api from '../api/axios.js';

export const useProductsStore = create((set, get) => ({
  products: [],
  mostPurchasedProducts: [],
  loading: {
    fetchingProducts: false,
    fetchingMostPurchased: false,
    addingProduct: false,
    updatingProduct: false,
    deletingProduct: false,
  },
  error: {
    screen: null,
    action: null,
  },

  fetchProducts: async () => {
    set((state) => ({
      loading: {
        ...state.loading,
        fetchingProducts: true,
      },
      error: {
        ...state.error,
        screen: null,
      },
    }));
    try {
      const res = await api.get('/products');
      // Asegura que products siempre sea un array
      let products = res.data;
      if (!Array.isArray(products)) {
        // Si la API devuelve un objeto con 'products', úsalo, si no, array vacío
        products =
          products && Array.isArray(products.products) ? products.products : [];
      }
      set({ products });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error cargando productos';
      set((state) => ({
        error: {
          ...state.error,
          screen: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          fetchingProducts: false,
        },
      }));
    }
  },

  fetchMostPurchased: async () => {
    set((state) => ({
      loading: { ...state.loading, fetchingMostPurchased: true },
      error: { ...state.error, action: null },
    }));
    try {
      let { products } = get();
      if (!products || products.length === 0) {
        const prodRes = await api.get('/products');
        let fetched = prodRes.data;
        if (!Array.isArray(fetched)) {
          fetched =
            fetched && Array.isArray(fetched.products) ? fetched.products : [];
        }
        products = fetched;
        set({ products });
      }
      const validIds = new Set(products.map((p) => p.id));

      const res = await api.get('/most_purchased_products');
      const mostPurchased = (res.data.products || []).filter((p) =>
        validIds.has(p.id)
      );
      set({ mostPurchasedProducts: mostPurchased });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error cargando productos destacados';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, fetchingMostPurchased: false },
      }));
    }
  },

  addProduct: async (payload) => {
    set((state) => ({
      loading: { ...state.loading, addingProduct: true },
      error: { ...state.error, action: null },
    }));
    try {
      const res = await api.post('/products', {
        ...payload,
        price: Number(payload.price),
        stock: Number(payload.stock),
      });

      set((state) => ({ products: [...state.products, res.data] }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'No se pudo agregar el producto';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, addingProduct: false },
      }));
    }
  },

  updateProduct: async (id, payload) => {
    set((state) => ({
      loading: { ...state.loading, updatingProduct: true },
      error: { ...state.error, action: null },
    }));
    try {
      const res = await api.put(`/products/update/${id}`, payload);
      set({
        products: get().products.map((product) =>
          product.id === id ? res.data : product
        ),
      });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'No se pudo actualizar el producto';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, updatingProduct: false },
      }));
    }
  },

  deleteProduct: async (id) => {
    set((state) => ({
      loading: { ...state.loading, deletingProduct: true },
      error: { ...state.error, action: null },
    }));
    try {
      await api.delete(`/products/delete/${id}`);
      set({
        products: get().products.filter((product) => product.id !== id),
      });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'No se pudo actualizar el producto';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, deletingProduct: false },
      }));
    }
  },
}));

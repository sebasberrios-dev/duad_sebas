import { create } from 'zustand';
import api from '../api/axios.js';
import { calculateTotal } from '../utils/helpers.js';
import { useProductsStore } from './useProductsStore.jsx';

const initialCheckoutState = {
  order: {
    id: null,
    totalPrice: null,
    status: '',
  },
  customer: {
    fullName: '',
    email: '',
    phoneNumber: '',
  },
  shipping: {
    address: '',
  },
};

export const usePurchaseStore = create((set, get) => ({
  checkout: initialCheckoutState,
  loading: {
    creatingOrder: false,
    creatingCheckoutData: false,
    completingPurchase: false,
    confirmingOrder: false,
  },
  error: {
    action: null,
  },

  createOrder: async (cartId, currentItems) => {
    set((state) => ({
      loading: {
        ...state.loading,
        creatingOrder: true,
      },
      error: {
        ...state.error,
        action: null,
      },
    }));

    try {
      if (cartId == null) throw new Error('El carrito no existe');

      if (!currentItems.length) throw new Error('El carrito está vacío');

      const totalPrice = calculateTotal(currentItems, 0, 0);
      const productsPayload = currentItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderPayload = {
        cart_id: cartId,
        products: productsPayload,
        total_price: totalPrice,
      };
      const res = await api.post('/order', orderPayload);

      const data = res.data?.order;

      if (!data) throw new Error('El servidor no retornó la orden');

      const orderId = data.id;
      const total = data.total_price;
      const status = data.status;

      set((state) => ({
        checkout: {
          ...state.checkout,
          order: {
            ...state.checkout.order,
            id: orderId,
            totalPrice: total,
            status: status,
          },
        },
      }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error creando la orden';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: { ...state.loading, creatingOrder: false },
      }));
    }
  },

  createCheckoutData: async (payload) => {
    set((state) => ({
      loading: { ...state.loading, creatingCheckoutData: true },
      error: { ...state.error, action: null },
    }));
    const orderId = get().checkout.order?.id;

    try {
      if (orderId == null) throw new Error('No se encontró la orden');

      if (
        !payload.fullName ||
        !payload.email ||
        !payload.address ||
        !payload.phoneNumber
      )
        throw new Error('Faltan datos de facturación');

      const res = await api.post('/checkout/billing_info', {
        order_id: orderId,
        full_name: payload.fullName,
        email: payload.email,
        shipping_address: payload.address,
        phone_number: payload.phoneNumber,
      });

      const data = res.data.billing_info;
      if (!data)
        throw new Error('El servidor no retornó la información de facturación');

      set((state) => ({
        checkout: {
          ...state.checkout,
          customer: {
            ...state.checkout.customer,
            fullName: data.full_name,
            email: data.email,
            phoneNumber: data.phone_number,
          },
          shipping: {
            ...state.checkout.shipping,
            address: data.shipping_address,
          },
        },
      }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error creando la información de facturación';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: { ...state.loading, creatingCheckoutData: false },
      }));
    }
  },

  completePurchase: async (cartId, currentItems) => {
    set((state) => ({
      loading: { ...state.loading, completingPurchase: true },
      error: { ...state.error, action: null },
    }));

    const orderId = get().checkout.order?.id;

    try {
      if (cartId == null) throw new Error('No se encontró el carrito');
      if (!currentItems.length) throw new Error('El carrito está vacío');

      await Promise.all(
        currentItems.map((item) => {
          const payload = {
            quantity: item.quantity,
          };

          return api.put(`/products/reduce_stock/${item.product_id}`, payload);
        })
      );

      if (orderId == null) throw new Error('No se encontró la orden');

      const res = await api.put(`/checkout/complete_order/${orderId}`, {
        cart_id: cartId,
      });

      const updatedOrder = res.data.order;

      if (!updatedOrder)
        throw new Error('El servidor no retornó la orden actualizada');

      set({
        checkout: {
          ...get().checkout,
          order: updatedOrder,
        },
      });

      await useProductsStore.getState().fetchProducts();
      await useProductsStore.getState().fetchMostPurchased();
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error completando la compra';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          completingPurchase: false,
        },
      }));
    }
  },

  confirmOrder: async (cartId) => {
    set((state) => ({
      loading: { ...state.loading, confirmingOrder: true },
      error: {
        ...state.error,
        action: null,
      },
    }));
    const orderId = get().checkout.order?.id;
    const email = get().checkout.customer?.email;
    try {
      if (cartId == null) throw new Error('No existe el carrito');
      if (orderId == null) throw new Error('No existe la orden');
      if (!email?.trim())
        throw new Error(
          'Falta correo del usuario para enviar confirmación de la orden'
        );

      await api.post('/send_order_confirmation', {
        cart_id: cartId,
        email: email,
        order_id: orderId,
      });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error enviando correo de confirmación';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: { ...state.loading, confirmingOrder: false },
      }));
    }
  },

  clearCheckout: () => {
    set({
      checkout: initialCheckoutState,
    });
  },
}));

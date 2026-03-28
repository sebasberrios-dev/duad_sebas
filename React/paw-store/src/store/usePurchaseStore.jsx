import { create } from 'zustand';
import api from '../api/axios.js';
import { calculateTotal } from '../utils/helpers.js';
import { useProductsStore } from './useProductsStore.jsx';

const initialCartState = {
  cartId: null,
  items: [],
};

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
  createCart: async () => {
    try {
      const res = await api.post('/cart/new');
      const cartId = res.data.cart?.id;
      set((state) => ({
        cart: {
          ...state.cart,
          cartId: cartId,
        },
      }));
      return cartId;
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error creando carrito';
      set((state) => ({
        error: { ...state.error, screen: errorMessage },
      }));
      throw e;
    }
  },
  checkoutProccess: false,
  cart: initialCartState,
  checkout: initialCheckoutState,
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
  error: {
    screen: null,
    action: null,
  },

  fetchCart: async () => {
    set((state) => ({
      error: {
        ...state.error,
        screen: null,
      },
    }));
    try {
      const res = await api.get('/cart');
      const cartId = res.data.cart?.id;
      set((state) => ({
        cart: {
          ...state.cart,
          cartId: cartId,
        },
      }));
    } catch (e) {
      // Si el error es 401 o 400, limpia el token y redirige a login
      const status = e.response?.status;
      if (status === 401 || status === 400) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error obteniendo carrito';
      set((state) => ({
        error: { ...state.error, screen: errorMessage },
      }));
      throw e;
    }
  },

  fetchItems: async (cartId) => {
    set((state) => ({
      error: {
        ...state.error,
        screen: null,
      },
    }));
    if (!cartId) {
      set((state) => ({
        error: {
          ...state.error,
          screen: 'No se encontró el carrito',
        },
      }));
      return;
    }
    try {
      const res = await api.get(`/cart/products/${cartId}`);
      let items = res.data.products_in_cart.map((item) => ({
        ...item,
        product_id: item.product_id ?? item.id,
        price: typeof item.price === 'string' ? Number(item.price) : item.price,
        quantity:
          typeof item.quantity === 'string'
            ? Number(item.quantity)
            : item.quantity,
      }));
      const products = useProductsStore.getState().products;
      const validProductIds = new Set(
        (products || [])
          .filter((p) => p && p.stock > 0)
          .map((p) => p.id ?? p.product_id)
      );
      items = items.filter((item) => validProductIds.has(item.product_id));

      set((state) => ({
        cart: {
          ...state.cart,
          items: items,
        },
      }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error obteniendo productos al carrito';
      set((state) => ({
        error: {
          ...state.error,
          screen: errorMessage,
        },
      }));
      throw e;
    }
  },

  initializeCart: async () => {
    set((state) => ({
      loading: {
        ...state.loading,
        initializingCart: true,
      },
      error: {
        ...state.error,
        screen: null,
      },
    }));

    try {
      await get().fetchCart();
      let { cartId } = get().cart;
      // Si no hay carrito, créalo automáticamente
      if (!cartId) {
        cartId = await get().createCart();
      }
      // Refresca cartId después de crear carrito
      cartId = get().cart.cartId;
      if (!cartId) {
        set((state) => ({
          error: {
            ...state.error,
            screen: 'No se encontró el carrito después de crearlo',
          },
        }));
        return;
      }
      await get().fetchItems(cartId);
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error inicializando carrito';
      set((state) => ({
        error: {
          ...state.error,
          screen: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          initializingCart: false,
        },
      }));
    }
  },

  addToCart: async (payload) => {
    set((state) => ({
      loading: {
        ...state.loading,
        addingItemId: payload.product_id,
      },
      error: {
        ...state.error,
        action: null,
      },
    }));

    const { cartId } = get().cart;

    try {
      if (cartId == null) throw new Error('No se encontró el carrito');
      const res = await api.post('/cart/add_product', {
        cart_id: cartId,
        product_id: payload.product_id,
        quantity: payload.quantity,
      });
      const new_product = {
        ...res.data.product,
        product_id: res.data.product.product_id ?? res.data.product.id,
        price:
          typeof res.data.product.price === 'string'
            ? Number(res.data.product.price)
            : res.data.product.price,
        quantity:
          typeof res.data.product.quantity === 'string'
            ? Number(res.data.product.quantity)
            : res.data.product.quantity,
      };
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.some(
            (item) => item.product_id === new_product.product_id
          )
            ? state.cart.items.map((item) =>
                item.product_id === new_product.product_id ? new_product : item
              )
            : [...state.cart.items, new_product],
        },
      }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error agregando productos al carrito';
      set((state) => ({
        error: { ...state.error, action: errorMessage },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          addingItemId: null,
        },
      }));
    }
  },

  removeFromCart: async (product_id) => {
    set((state) => ({
      loading: {
        ...state.loading,
        removingItemId: product_id,
      },
      error: {
        ...state.error,
        action: null,
      },
    }));

    const { cartId } = get().cart;

    try {
      if (cartId == null) throw new Error('No se encontró el carrito');

      await api.delete('/cart/remove_product', {
        data: {
          cart_id: cartId,
          product_id: product_id,
        },
      });

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item) => item.product_id !== product_id
          ),
        },
      }));
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error eliminando producto del carrito';
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
          removingItemId: null,
        },
      }));
    }
  },

  increaseQuantity: (product_id) => {
    const cart = get().cart;
    if (!cart || !Array.isArray(cart.items)) return;

    const updatedItems = cart.items.map((item) =>
      item.product_id === product_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    set((state) => ({
      cart: {
        ...state.cart,
        items: updatedItems,
      },
    }));
  },

  /* decreaseQuantity */
  decreaseQuantity: (product_id) => {
    const cart = get().cart;
    const updatedItems = cart.items.map((item) =>
      item.product_id === product_id
        ? {
            ...item,
            quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
          }
        : item
    );
    set((state) => ({
      cart: {
        ...state.cart,
        items: updatedItems,
      },
    }));
  },

  syncCart: async () => {
    set((state) => ({
      loading: {
        ...state.loading,
        syncingCart: true,
      },
      error: {
        ...state.error,
        action: null,
      },
    }));

    const { cartId, items: currentItems } = get().cart;

    try {
      if (cartId == null) throw new Error('El carrito a sincronizar no existe');

      if (!currentItems?.length)
        throw new Error('No hay productos para sincronizar el carrito');

      await Promise.all(
        currentItems.map((item) => {
          const payload = {
            cart_id: cartId,
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          };

          return api.post('/cart/add_product', payload);
        })
      );
      set({ checkoutProccess: true });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ??
        e.message ??
        'Error sincronizando carrito al API';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
      throw e;
    } finally {
      set((state) => ({
        loading: { ...state.loading, syncingCart: false },
      }));
    }
  },

  createOrder: async () => {
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

    const { cartId, items: currentItems } = get().cart;

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
      console.log('Payload enviado a /order:', orderPayload);
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

  completePurchase: async () => {
    set((state) => ({
      loading: { ...state.loading, completingPurchase: true },
      error: { ...state.error, action: null },
    }));

    const { cartId, items: currentItems } = get().cart;

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
    } finally {
      set((state) => ({
        loading: {
          ...state.loading,
          completingPurchase: false,
        },
      }));
    }
  },

  confirmOrder: async () => {
    set((state) => ({
      loading: { ...state.loading, confirmingOrder: true },
      error: {
        ...state.error,
        action: null,
      },
    }));
    const { cartId } = get().cart;
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
    } finally {
      set((state) => ({
        loading: { ...state.loading, confirmingOrder: false },
      }));
    }
  },

  clearInfo: async () => {
    set((state) => ({
      loading: { ...state.loading, clearingInfo: true },
      error: { ...state.error, action: null },
    }));

    const cartId = get().cart.cartId;

    try {
      if (cartId == null) throw new Error('El carrito no existe');

      await api.delete(`/checkout/clear_cart/${cartId}`);

      set({
        checkoutProccess: false,
        cart: initialCartState,
        checkout: initialCheckoutState,
      });
    } catch (e) {
      const errorMessage =
        e.response?.data?.error ?? e.message ?? 'Error vaciando el carrito';
      set((state) => ({
        error: {
          ...state.error,
          action: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        loading: { ...state.loading, clearingInfo: false },
      }));
    }
  },
}));

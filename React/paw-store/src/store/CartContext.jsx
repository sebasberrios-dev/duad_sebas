import api from '../api/axios.js';
import { createContext, useState, useContext } from 'react';
import { useProductsStore } from './useProductsStore.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartId, setCartId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutProccess, setCheckoutProccess] = useState(false);

  const [screenError, setScreenError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const [initializingCart, setInitializingCart] = useState(false);

  const [addingItemId, setAddingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  const [syncingCart, setSyncingCart] = useState(false);

  const [clearingCart, setClearingCart] = useState(false);

  const createCart = async () => {
    const res = await api.post('/cart/new');
    const id = res.data.cart?.id;
    setCartId(id);
    return id;
  };

  const fetchCart = async () => {
    try {
      setScreenError(null);

      const res = await api.get('/cart');
      const id = res.data.cart?.id;

      if (!id) {
        return await createCart();
      }

      setCartId(id);
      return id;
    } catch (e) {
      const status = e.response?.status;
      if (status === 401 || status === 400) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return null;
      }
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setScreenError(`Error obteniendo el carrito: ${errorMessage}`);
      throw e;
    }
  };

  const fetchItems = async (id) => {
    try {
      setScreenError(null);

      if (!id) {
        setScreenError('No se encontró el carrito');
        return;
      }

      const res = await api.get(`/cart/products/${id}`);
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

      setCartItems(items);
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setScreenError(`Error obteniendo productos del carrito: ${errorMessage}`);
      throw e;
    }
  };

  const initializeCart = async () => {
    try {
      setInitializingCart(true);
      setScreenError(null);

      const id = await fetchCart();
      await fetchItems(id);
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setScreenError(`Error inicializando el carrito: ${errorMessage}`);
    } finally {
      setInitializingCart(false);
    }
  };

  const addToCart = async (payload) => {
    try {
      setAddingItemId(payload.product_id);
      setActionError(null);

      if (!cartId) throw new Error('No se encontró el carrito');
      const res = await api.post('/cart/add_product', {
        cart_id: cartId,
        product_id: payload.product_id,
        quantity: payload.quantity,
      });

      const newProduct = {
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

      setCartItems((prev) =>
        prev.some((item) => item.product_id === newProduct.product_id)
          ? prev.map((item) =>
              item.product_id === newProduct.product_id ? newProduct : item
            )
          : [...prev, newProduct]
      );
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setActionError(`Error añadiendo productos al carrito: ${errorMessage}`);
      throw e;
    } finally {
      setAddingItemId(null);
    }
  };

  const removeFromCart = async (product_id) => {
    try {
      setRemovingItemId(product_id);
      setActionError(null);

      if (!cartId) throw new Error('No se encontró el carrito');

      await api.delete('/cart/remove_product', {
        data: {
          cart_id: cartId,
          product_id: product_id,
        },
      });

      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== product_id)
      );
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setActionError(`Error eliminando producto del carrito: ${errorMessage}`);
      throw e;
    } finally {
      setRemovingItemId(null);
    }
  };

  const increaseQuantity = (product_id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (product_id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === product_id
          ? {
              ...item,
              quantity: item.quantity > 1 ? item.quantity - 1 : item.quantity,
            }
          : item
      )
    );
  };

  const syncCart = async () => {
    try {
      setSyncingCart(true);
      setActionError(null);

      if (!cartId) throw new Error('El carrito a sincronizar no existe');
      if (!cartItems?.length)
        throw new Error('No hay productos para sincronizar el carrito');

      await Promise.all(
        cartItems.map((item) => {
          const payload = {
            cart_id: cartId,
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          };

          return api.post('/cart/add_product', payload);
        })
      );
      setCheckoutProccess(true);
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setActionError(`Error sincronizando el carrito: ${errorMessage}`);
      throw e;
    } finally {
      setSyncingCart(false);
    }
  };

  const clearCart = async () => {
    try {
      setClearingCart(true);
      setActionError(null);

      if (!cartId) throw new Error('El carrito no existe');

      await api.delete(`/checkout/clear_cart/${cartId}`);

      setCheckoutProccess(false);
      setCartId(null);
      setCartItems([]);
    } catch (e) {
      const errorMessage = e.response?.data?.error ?? e.message ?? 'Inesperado';
      setActionError(`Error vaciando el carrito: ${errorMessage}`);
    } finally {
      setClearingCart(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        cartItems,
        checkoutProccess,
        screenError,
        actionError,
        initializingCart,
        addingItemId,
        removingItemId,
        syncingCart,
        clearingCart,
        initializeCart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        syncCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

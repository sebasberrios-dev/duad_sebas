import { ItemCart } from '../../components/PurchaseFlow/ItemCart.jsx';
import { ContinueCard } from '../../components/PurchaseFlow/ContinueCard.jsx';
import { LoadingPage } from '../../components/Messages-States/Loading.jsx';
import { useCart } from '../../store/CartContext.jsx';
import { usePurchaseStore } from '../../store/usePurchaseStore.jsx';
import { calculateSubTotal } from '../../utils/helpers.js';
import { useNavigate } from 'react-router';
import {
  showAlertError,
  showAlertConfirm,
} from '../../components/Messages-States/Alerts.jsx';
import { useEffect } from 'react';
import styles from './BuyingProccess.module.css';
import { ErrorPage } from '../../components/Messages-States/Error.jsx';

export default function ShoppingCart() {
  const navigate = useNavigate();

  const {
    initializingCart: isInitializing,
    syncingCart: isSyncingCart,
    screenError,
    initializeCart,
    cartId,
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removingItemId,
    removeFromCart,
    syncCart,
    clearCart,
    clearingCart,
  } = useCart();

  const isCreatingOrder = usePurchaseStore(
    (state) => state.loading.creatingOrder
  );
  const createOrder = usePurchaseStore((state) => state.createOrder);

  // Filtrar productos con price inválido (null, undefined, NaN, no numérico)
  const validCartItems = Array.isArray(cartItems)
    ? cartItems.filter(
        (item) =>
          typeof item.price === 'number' &&
          !isNaN(item.price) &&
          item.price !== null
      )
    : [];

  const subtotal = calculateSubTotal(validCartItems);

  const handleContinue = async () => {
    try {
      await syncCart();
      await createOrder(cartId, validCartItems);

      navigate('/checkout');
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ?? e.message ?? 'Error inesperado'
      );
    }
  };

  const handleClearCart = async () => {
    const result = await showAlertConfirm(
      '¿Vaciar carrito?',
      'Se eliminarán todos los productos del carrito.'
    );
    if (!result.isConfirmed) return;
    try {
      await clearCart();
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ?? e.message ?? 'No se pudo vaciar el carrito'
      );
    }
  };

  const handleRemoveItem = async (product_id) => {
    try {
      await removeFromCart(product_id);
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ??
          e.message ??
          'No se pudo eliminar el producto'
      );
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  return isInitializing ? (
    <LoadingPage element="carrito"></LoadingPage>
  ) : screenError ? (
    <ErrorPage text={screenError}></ErrorPage>
  ) : (
    <section className={styles.shoppingCart}>
      <h1 className={styles.title}>Carrito de compras</h1>
      <div className={styles.container}>
        {validCartItems.length === 0 ? (
          <div className={styles.itemContainer}>
            <div className={styles.emptyCartPlaceholder}>
              <div className={styles.emptyCartMsg}>
                No hay productos en el carrito.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.itemContainer}>
              {validCartItems.map((item) => (
                <ItemCart
                  key={item.product_id}
                  item={item}
                  onIncrease={() => increaseQuantity(item.product_id)}
                  onDecrease={() => decreaseQuantity(item.product_id)}
                  isRemoving={removingItemId === item.product_id}
                  onRemove={() => handleRemoveItem(item.product_id)}
                />
              ))}
              <button
                type="button"
                className={styles.clearCart}
                onClick={handleClearCart}
                disabled={clearingCart}
              >
                {clearingCart ? 'Vaciando...' : 'Vaciar carrito'}
              </button>
            </div>
            <ContinueCard
              isLoading={isSyncingCart || isCreatingOrder}
              onContinue={handleContinue}
              subtotal={subtotal}
              disabled={validCartItems.length === 0}
            ></ContinueCard>
          </>
        )}
      </div>
    </section>
  );
}

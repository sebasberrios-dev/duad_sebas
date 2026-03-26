import { ItemCart } from '../../components/PurchaseFlow/ItemCart.jsx';
import { ContinueCard } from '../../components/PurchaseFlow/ContinueCard.jsx';
import { LoadingPage } from '../../components/Messages-States/Loading.jsx';
import { usePurchaseStore } from '../../store/usePurchaseStore.jsx';
import { calculateSubTotal } from '../../utils/helpers.js';
import { useNavigate } from 'react-router';
import { showAlertError } from '../../components/Messages-States/Alerts.jsx';
import { useEffect } from 'react';
import styles from './BuyingProcess.module.css';
import shared from '../../components/shared.module.css';
import { ErrorPage } from '../../components/Messages-States/Error.jsx';

export default function ShoppingCart() {
  const navigate = useNavigate();

  const isInitializing = usePurchaseStore(
    (state) => state.loading.initializingCart
  );
  const isSyncingCart = usePurchaseStore((state) => state.loading.syncingCart);
  const isCreatingOrder = usePurchaseStore(
    (state) => state.loading.creatingOrder
  );

  const screenError = usePurchaseStore((state) => state.error.screen);

  const initializeCart = usePurchaseStore((state) => state.initializeCart);
  const cartItems = usePurchaseStore((state) => state.cart.items);
  // Filtrar productos con price inválido (null, undefined, NaN, no numérico)
  const validCartItems = Array.isArray(cartItems)
    ? cartItems.filter(
        (item) =>
          typeof item.price === 'number' &&
          !isNaN(item.price) &&
          item.price !== null
      )
    : [];

  const increaseQuantity = usePurchaseStore((state) => state.increaseQuantity);
  const decreaseQuantity = usePurchaseStore((state) => state.decreaseQuantity);

  const removingItemId = usePurchaseStore(
    (state) => state.loading.removingItemId
  );
  const removeFromCart = usePurchaseStore((state) => state.removeFromCart);

  const subtotal = calculateSubTotal(validCartItems);
  const syncCart = usePurchaseStore((state) => state.syncCart);
  const createOrder = usePurchaseStore((state) => state.createOrder);

  const handleContinue = async () => {
    try {
      await syncCart();
      await createOrder();

      navigate('/checkout');
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ?? e.message ?? 'Error inesperado'
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

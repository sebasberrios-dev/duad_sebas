import { useNavigate } from 'react-router';
import PurchaseSuccess from '../../components/Messages-States/PurchaseSuccess';
import PurchaseSummary from '../../components/PurchaseFlow/PurchaseSummary';
import shared from '../../components/shared.module.css';
import styles from './BuyingProccess.module.css';
import { usePurchaseStore } from '../../store/usePurchaseStore';
import { useEffect, useRef } from 'react';
import { calculateSubTotal } from '../../utils/helpers';

export default function PurchaseFinished() {
  const navigate = useNavigate();

  const items = usePurchaseStore((state) => state.cart.items);
  const total = calculateSubTotal(items);

  const clearInfo = usePurchaseStore((state) => state.clearInfo);

  const alreadyClearedRef = useRef(false);

  const clearOnce = async () => {
    if (alreadyClearedRef.current) return;
    alreadyClearedRef.current = true;
    await clearInfo();
  };

  const handleGoProducts = async () => {
    await clearOnce();
    navigate('/products');
  };

  const handleGoHome = async () => {
    await clearOnce();
    navigate('/');
  };

  useEffect(() => {
    return () => {
      clearOnce();
    };
  }, []);
  return (
    <section className={shared.container}>
      <div className={styles.purchaseFinished}>
        <PurchaseSuccess />
        <PurchaseSummary items={items} total={total} />
        <div className={styles.purchaseActions}>
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={handleGoProducts}
          >
            Volver al catálogo
          </button>
          <button
            className={`${shared.btn} ${shared.btnOutline}`}
            onClick={handleGoHome}
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </section>
  );
}

import styles from './ContinueCard.module.css';
import shared from '../shared.module.css';
export function ContinueCard({ onContinue, subtotal, isLoading, disabled }) {
  return (
    <div className={styles.continue}>
      <div className={styles.totalContainer}>
        <p className={styles.total}>Total:</p>
        <p className={styles.subtotal}>₡{subtotal}</p>
      </div>
      <button
        onClick={onContinue}
        disabled={isLoading || disabled}
        className={`${shared.btn} ${shared.btnPrimary} ${styles.btnContinue}`}
      >
        {isLoading ? 'Continuando...' : 'Continuar al checkout'}
      </button>
    </div>
  );
}

import styles from './ItemCart.module.css';
import { calculateItemPrice } from '../../utils/helpers.js';

export const QuantityControl = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className={styles.quantityControl}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Disminuir cantidad"
        className={`${styles.quantityButton}`}
      >
        <svg
          className={styles.quantityIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M200-440v-80h560v80H200Z" />
        </svg>
      </button>

      <span className={styles.quantity}>{quantity}</span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Aumentar cantidad"
        className={styles.quantityButton}
      >
        <svg
          className={styles.quantityIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </button>
    </div>
  );
};

export function ItemCart({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  isRemoving,
}) {
  return (
    <div className={styles.item}>
      <img src={item.image_url} alt={item.name} className={styles.itemImage} />
      <h4 className={styles.itemName}>{item.name}</h4>

      <QuantityControl
        quantity={item.quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />

      <div className={styles.prices}>
        <p className={styles.itemPrice}>Precio: ₡{item.price}</p>
        <p className={styles.itemSubtotal}>
          Subtotal: ₡{calculateItemPrice(item)}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        aria-label={`Eliminar del carrito`}
        className={`${styles.removeButton}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          className={styles.removeIcon}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
    </div>
  );
}

import styles from './ProductCard.module.css';
import shared from '../shared.module.css';

export function ProductCard({ product, onViewDetails }) {
  return (
    <div className={styles.card}>
      <img src={product.imagen} alt={product.nombre} className={styles.image} />
      <div className={styles.content}>
        <h3 className={shared.titleSm}>{product.nombre}</h3>
        <p className={shared.price}>₡{product.precio}</p>
        <p className={shared.textSmall}>{product.categoria}</p>
        <button
          className={`${shared.btn} ${shared.btnPrimary} ${shared.btnFull}`}
          onClick={() => onViewDetails(product)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

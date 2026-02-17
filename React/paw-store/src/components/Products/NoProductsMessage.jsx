import sadEmoji from '../../assets/sentiment_dissatisfied_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
import styles from './NoProductsMessage.module.css';
import shared from '../shared.module.css';

export function NoProductsMessage() {
  return (
    <section>
      <div className={shared.container}>
        <img
          src={sadEmoji}
          alt="No products available"
          className={styles.emoji}
        />
        <h2 className={shared.title}>
          No se encontraron productos disponibles
        </h2>
      </div>
    </section>
  );
}

import styles from './Maintenance.module.css';
import shared from '../shared.module.css';

export function Maintenance() {
  return (
    <section>
      <div className={`${shared.container} ${styles.fullHeight}`}>
        <h2 className={`${shared.title} ${shared.titleLg}`}>
          En mantenimiento...
        </h2>
        <p className={styles.text}>Esta página estará disponible pronto.</p>
      </div>
    </section>
  );
}

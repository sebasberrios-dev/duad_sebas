import shared from '../shared.module.css';
import styles from './MessagesStates.module.css';

export function LoadingPage({ element }) {
  return (
    <section className={shared.container}>
      <div className={styles.loader}></div>
      <h2 className={`${shared.title} ${styles.titleLoader}`}>
        Cargando {element}...
      </h2>
    </section>
  );
}

export function LoadingComponent() {
  <div className={styles.loader}></div>;
}

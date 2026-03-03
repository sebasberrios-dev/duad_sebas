import styles from './MessagesStates.module.css';
import shared from '../shared.module.css';

export function ErrorMessage({ text }) {
  return (
    <section>
      <div className={shared.container}>
        <h2 className={styles.errorTitle}>Ups, algo salió mal: {text}</h2>
      </div>
    </section>
  );
}

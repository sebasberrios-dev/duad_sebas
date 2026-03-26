import styles from './MessagesStates.module.css';
import shared from '../shared.module.css';

export function ErrorPage({ text }) {
  return (
    <section>
      <div className={shared.container}>
        <h2 className={styles.errorTitle}>Ups, algo salió mal: {text}</h2>
      </div>
    </section>
  );
}

export function ErrorMessage({ text }) {
  return <p className={shared.error}>{text}</p>;
}

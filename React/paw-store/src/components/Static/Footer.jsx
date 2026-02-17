import styles from './Footer.module.css';
import { memo } from 'react';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.text}>
            © PawStore 2025 — Todos los derechos reservados.
          </p>
        </div>
        <div className={styles.right}>
          <p className={styles.link}>Instagram</p>
          <p className={styles.link}>Facebook</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);

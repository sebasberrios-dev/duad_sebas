import styles from './Navbar.module.css';
import shared from '../shared.module.css';
import pawPrint from '../../assets/lucide-PawPrint-Outlined.svg';
import { useAuth } from '../../store/AuthContext.jsx';
import { memo } from 'react';

function Navbar({ onNavigate, currentPage }) {
  const { isLogged, isAdmin, user } = useAuth();

  return (
    <header>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={shared.badge}>
              <img
                src={pawPrint}
                alt="PawPrint Logo"
                className={`${shared.icon} ${styles.iconWhite}`}
              />
            </span>
            <span className={styles.brand}>PawStore</span>
          </div>

          <ul className={styles.links}>
            <li
              className={`${styles.item} ${currentPage === 'home' ? styles.active : ''}`}
              onClick={() => onNavigate('home')}
            >
              Inicio
            </li>
            <li
              className={`${styles.item} ${currentPage === 'products' ? styles.active : ''}`}
              onClick={() => onNavigate('products')}
            >
              Productos
            </li>
            <li
              className={`${styles.item} ${currentPage === 'contact' ? styles.active : ''}`}
              onClick={() => onNavigate('contact')}
            >
              Contacto
            </li>
            {isAdmin && (
              <li
                className={`${styles.item} ${currentPage === 'admin' ? styles.active : ''}`}
                onClick={() => onNavigate('admin')}
              >
                Administración
              </li>
            )}
            {isLogged ? ( // 7 8 12 14 20 21
              <>
                <li className={styles.userLabel}>Usuario: {user.role}</li>
                <li
                  className={`${styles.item} ${styles.logout}`}
                  onClick={() => onNavigate('logout')}
                >
                  Cerrar sesión
                </li>
              </>
            ) : (
              <li
                className={`${styles.item} ${styles.login} ${currentPage === 'login' ? styles.active : ''}`}
                onClick={() => onNavigate('login')}
              >
                Iniciar sesión
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default memo(Navbar);

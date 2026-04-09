import styles from './Navbar.module.css';
import shared from '../shared.module.css';
import pawPrint from '../../assets/lucide-PawPrint-Outlined.svg';
import { useAuth } from '../../store/AuthContext.jsx';
import { NavLink } from 'react-router';
import { memo } from 'react';
import { useNavigate } from 'react-router';

function Navbar() {
  const { isLogged, isAdmin, user, handleLogout } = useAuth();
  const navigate = useNavigate();

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
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              Productos
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.active : ''}`
              }
            >
              Contacto
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `${styles.item} ${isActive ? styles.active : ''}`
                }
              >
                Administración
              </NavLink>
            )}
            {isLogged ? (
              <>
                <NavLink
                  className={({ isActive }) =>
                    `${styles.item} ${isActive ? styles.active : ''}`
                  }
                  to="/cart"
                >
                  Carrito
                </NavLink>
                <li className={styles.userLabel}>Usuario: {user.role}</li>
                <button
                  type="button"
                  className={`${styles.item} ${styles.logout}`}
                  onClick={() => handleLogout(navigate)}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${styles.item} ${styles.login} ${isActive ? styles.active : ''}`
                }
              >
                Iniciar sesión
              </NavLink>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default memo(Navbar);

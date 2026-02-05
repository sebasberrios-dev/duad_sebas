import './Navbar.css';
import pawPrint from '../assets/lucide-PawPrint-Outlined.svg';
import { memo } from 'react';

function Navbar({ onNavigate, currentPage }) {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-badge">
              <img src={pawPrint} alt="PawPrint Logo" className="navbar-icon" />
            </span>
            <span className="logo-text">PawStore</span>
          </div>

          <ul className="navbar-links">
            <li
              className={`navbar-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Inicio
            </li>
            <li
              className={`navbar-item ${currentPage === 'products' ? 'active' : ''}`}
              onClick={() => onNavigate('products')}
            >
              Productos
            </li>
            <li
              className={`navbar-item ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => onNavigate('contact')}
            >
              Contacto
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default memo(Navbar);

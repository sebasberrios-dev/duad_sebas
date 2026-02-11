import './Components.css';
import { memo } from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p className="text-secondary">
            © PawStore 2025 — Todos los derechos reservados.
          </p>
        </div>
        <div className="footer-right">
          <p className="text-secondary">Instagram</p>
          <p className="text-secondary">Facebook</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);

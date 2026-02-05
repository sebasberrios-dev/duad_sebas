import './Footer.css';
import { memo } from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <p className="footer-text">
            © PawStore 2025 — Todos los derechos reservados.
          </p>
        </div>
        <div className="footer-right">
          <p className="footer-text">Instagram</p>
          <p className="footer-text">Facebook</p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);

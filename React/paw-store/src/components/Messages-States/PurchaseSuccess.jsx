import styles from './MessagesStates.module.css';
import shared from '../shared.module.css';
import { Title, Message } from './Restricted.jsx';

const Svg = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      fill="currentColor"
    >
      <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  );
};

export default function PurchaseSuccess() {
  return (
    <div className={styles.purchaseSuccess}>
      <Svg className={styles.successIcon} />
      <Title className={shared.titleLg} text="Compra realizada con éxito" />
      <Message
        className={shared.text}
        text="Tu pedido ha sido procesado correctamente. 
        Recibirás un correo de confirmación con los detalles de tu compra."
      />
    </div>
  );
}

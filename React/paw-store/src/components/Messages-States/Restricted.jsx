import shared from '../shared.module.css';
import styles from './MessagesStates.module.css';
import lockIcon from '../../assets/lock_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';

const Img = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);
const Title = ({ text, className }) => <h1 className={className}>{text}</h1>;
const Message = ({ text, className }) => <p className={className}>{text}</p>;
const Button = ({ text, onClick, className }) => (
  <button className={className} onClick={onClick}>
    {text}
  </button>
);

export function NoLoggedWarning({ onNavigate }) {
  return (
    <section className={shared.container}>
      <div className={styles.restricted}>
        <Img src={lockIcon} alt="lock" className={styles.lockImage} />
        <Title
          text="Debes iniciar sesión para continuar"
          className={shared.titleLg}
        />
        <Message
          text="Protege tus compras y gestiona tu perfil con facilidad"
          className={styles.message}
        />
        <Button
          text="Ir a iniciar sesión"
          onClick={() => onNavigate('login')}
          className={`${shared.btn} ${shared.btnPrimary}`}
        />
      </div>
    </section>
  );
}

export function NoAdminWarning({ onNavigate }) {
  return (
    <section className={shared.container}>
      <div className={styles.restricted}>
        <Img src={lockIcon} alt="lock" className={styles.lockImage} />
        <Title text="Acceso restringido" className={shared.titleLg} />
        <Message
          text="No tienes los permisos necesarios para acceder a esta sección"
          className={styles.message}
        />
        <Button
          text="Volver al inicio"
          onClick={() => onNavigate('home')}
          className={`${shared.btn} ${shared.btnPrimary}`}
        />
      </div>
    </section>
  );
}

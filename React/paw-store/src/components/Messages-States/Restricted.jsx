import shared from '../shared.module.css';
import styles from './MessagesStates.module.css';
import lockIcon from '../../assets/lock_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
import { useNavigate } from 'react-router';

export const Img = ({ src, alt, className }) => (
  <img src={src} alt={alt} className={className} />
);
export const Title = ({ text, className }) => (
  <h1 className={className}>{text}</h1>
);
export const Message = ({ text, className }) => (
  <p className={className}>{text}</p>
);
export const Button = ({ text, onClick, className }) => (
  <button className={className} onClick={onClick}>
    {text}
  </button>
);

export function LayoutRestricted({ props }) {
  return (
    <section className={shared.container}>
      <div className={styles.restricted}>
        <Img src={props.icon} alt="icon" className={styles.icon} />
        <Title text={props.title} className={shared.titleLg} />
        <Message text={props.message} className={styles.message} />
        <Button
          text={props.buttonText}
          onClick={props.onButtonClick}
          className={`${shared.btn} ${shared.btnPrimary}`}
        />
      </div>
    </section>
  );
}

export function NoLoggedWarning() {
  const navigate = useNavigate();
  const props = {
    icon: lockIcon,
    title: 'Acceso restringido',
    message: 'Debes iniciar sesión para acceder a esta sección',
    buttonText: 'Iniciar sesión',
    onButtonClick: () => navigate('/login'),
  };
  return <LayoutRestricted props={props} />;
}

export function NoAdminWarning() {
  const navigate = useNavigate();
  const props = {
    icon: lockIcon,
    title: 'Acceso restringido',
    message: 'No tienes permisos para acceder a esta sección',
    buttonText: 'Volver al inicio',
    onButtonClick: () => navigate('/'),
  };
  return <LayoutRestricted props={props} />;
}

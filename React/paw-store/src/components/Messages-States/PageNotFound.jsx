import errorIcon from '../../assets/error_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import { LayoutRestricted as LayoutErrorElement } from './Restricted';
import { useNavigate } from 'react-router';

export function PageNotFound() {
  const navigate = useNavigate();
  const props = {
    icon: errorIcon,
    title: 'Página no encontrada',
    message: 'La página que estás buscando no existe',
    buttonText: 'Volver al inicio',
    onButtonClick: () => navigate('/'),
  };
  return <LayoutErrorElement props={props} />;
}

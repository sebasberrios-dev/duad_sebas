import errorIcon from '../../assets/error_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import { LayoutRestricted as LayoutErrorElement } from './Restricted';
import { useNavigate } from 'react-router';

export function NotFound({ title, message }) {
  const navigate = useNavigate();
  const props = {
    icon: errorIcon,
    title: title,
    message: message,
    buttonText: 'Volver al inicio',
    onButtonClick: () => navigate('/'),
  };
  return <LayoutErrorElement props={props} />;
}

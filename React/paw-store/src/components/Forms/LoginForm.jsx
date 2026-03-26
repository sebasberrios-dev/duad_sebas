import styles from './Forms.module.css';
import shared from '../shared.module.css';
import { useAuth } from '../../store/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Form, Title, Field, Button } from './FormsComponents';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { login, loginError } = useAuth();

  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      reset();
      navigate('/');
    }
  };

  return (
    <section className={`${shared.container} ${styles.section}`}>
      <Form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
        <Title className={`${shared.title} ${styles.textAlign}`}>
          Iniciar sesión
        </Title>

        {loginError && <p className={styles.errorMessage}>{loginError}</p>}
        <Field
          divClassName={styles.field}
          labelClassName={styles.label}
          inputClassName={styles.input}
          inputErrorClassName={styles.inputError}
          errorClassName={styles.fieldError}
          type="email"
          id="email"
          placeholder="nombre.apellido@ejemplo.com"
          error={errors.email ? 'Correo electrónico obligatorio' : ''}
          {...register('email', { required: true })}
        >
          Correo electrónico
        </Field>

        <Field
          divClassName={styles.field}
          labelClassName={styles.label}
          inputClassName={styles.input}
          inputErrorClassName={styles.inputError}
          errorClassName={styles.fieldError}
          type="password"
          id="password"
          error={errors.password ? 'Contraseña obligatoria' : ''}
          {...register('password', { required: true })}
        >
          Contraseña
        </Field>

        <div className={styles.actions}>
          <Button
            type="submit"
            className={`${shared.btn} ${shared.btnPrimary} ${shared.btnFull}`}
          >
            Ingresar
          </Button>
          <div className={styles.registerLink}>
            <span>¿No tienes una cuenta?</span>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </Form>
    </section>
  );
}

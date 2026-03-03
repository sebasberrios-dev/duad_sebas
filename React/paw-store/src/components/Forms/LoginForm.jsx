import styles from './Forms.module.css';
import shared from '../shared.module.css';
import { useAuth } from '../../store/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { Form, Title, Field, Button } from './FormsComponents';

export function LoginForm({ onNavigate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { login, loginError } = useAuth();

  const handleFormSubmit = async (data, redirect) => {
    const success = await login(data);
    if (success) {
      reset();
      if (redirect) {
        onNavigate(redirect);
      }
    }
  };

  return (
    <section className={`${shared.container} ${styles.section}`}>
      <Form
        className={styles.form}
        onSubmit={handleSubmit((data) => handleFormSubmit(data, 'home'))}
      >
        <Title className={`${shared.title} ${styles.textAlign}`}>
          Iniciar sesión
        </Title>

        {loginError && <p className={styles.errorMessage}>{loginError}</p>}

        <div className={styles.field}>
          <Field
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
        </div>

        <div className={styles.field}>
          <Field
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
        </div>

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
              onClick={() => onNavigate('register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </Form>
    </section>
  );
}

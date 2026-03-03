import styles from './Forms.module.css';
import shared from '../shared.module.css';
import { useAuth } from '../../store/AuthContext.jsx';
import { useForm } from 'react-hook-form';
import { Form, Title, Field, Button } from './FormsComponents';

export function RegisterForm({ onNavigate }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const { registerUser, registerError } = useAuth();

  const password = watch('password');

  const handleFormSubmit = async (data, redirect) => {
    const success = await registerUser(data);
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
          Crear cuenta
        </Title>

        {registerError && <p className={styles.error}>{registerError}</p>}

        <div className={styles.field}>
          <Field
            labelClassName={styles.label}
            inputClassName={styles.input}
            inputErrorClassName={styles.inputError}
            errorClassName={styles.fieldError}
            id="full_name"
            type="text"
            placeholder="Introduce tu nombre completo"
            error={errors.full_name?.message}
            {...register('full_name', {
              required: 'El nombre completo es obligatorio',
            })}
          >
            Nombre completo
          </Field>
        </div>

        <div className={styles.field}>
          <Field
            labelClassName={styles.label}
            inputClassName={styles.input}
            inputErrorClassName={styles.inputError}
            errorClassName={styles.fieldError}
            type="email"
            id="email"
            placeholder="nombre.apellido@ejemplo.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Correo electrónico obligatorio',
            })}
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
            placeholder="Introduce una contraseña"
            error={errors.password?.message}
            {...register('password', { required: 'Contraseña obligatoria' })}
          >
            Contraseña
          </Field>
        </div>

        <div className={styles.field}>
          <Field
            labelClassName={styles.label}
            inputClassName={styles.input}
            inputErrorClassName={styles.inputError}
            errorClassName={styles.fieldError}
            type="password"
            id="confirm_password"
            placeholder="Confirma la contraseña"
            error={errors.confirm_password?.message}
            {...register('confirm_password', {
              required: 'Necesitas confirmar la contraseña',
              validate: (value) =>
                value === password || 'Las contraseñas no coinciden',
            })}
          >
            Confirmar contraseña
          </Field>
        </div>

        <div className={styles.actions}>
          <Button
            type="submit"
            className={`${shared.btn} ${shared.btnPrimary} ${shared.btnFull}`}
          >
            Registrarse
          </Button>
          <div className={styles.loginLink}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => onNavigate('login')}
            >
              Ya tengo una cuenta
            </button>
          </div>
        </div>
      </Form>
    </section>
  );
}

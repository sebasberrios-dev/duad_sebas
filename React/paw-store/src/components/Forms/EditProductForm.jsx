import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './EditProductForm.module.css';

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es obligatorio'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  precio: Yup.number()
    .typeError('El precio debe ser un número')
    .positive('El precio debe ser un número positivo')
    .required('El precio es obligatorio'),
  categoria: Yup.string().required('La categoría es obligatoria'),
  stock: Yup.number()
    .typeError('El stock debe ser un número')
    .integer('El stock debe ser un número entero')
    .positive('El stock debe ser un número positivo')
    .required('El stock es obligatorio'),

  imagen: Yup.string()
    .required('La imagen es obligatoria')
    .test('imagen-valida', 'La imagen debe ser una URL válida', (value) => {
      if (!value) {
        return false;
      }

      const normalized = value.trim();
      const isAbsoluteUrl = /^https?:\/\//i.test(normalized);
      const isRelativePath = /^(\.\.\/|\.\/|\/)/.test(normalized);

      return isAbsoluteUrl || isRelativePath;
    }),
});

export function EditProductForm({ product, onSubmit, onCancel }) {
  return (
    <Formik
      initialValues={{
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        categoria: product.categoria,
        stock: product.stock,
        imagen: product.imagen,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <div>
        <h1 className={styles.title}>Editar producto</h1>
        <Form className={styles.form}>
          <p className={styles.warning}>
            Por favor, completa todos los campos antes de guardar los cambios.
          </p>
          <div className={styles.group}>
            <label htmlFor="nombre" className={styles.label}>
              Nombre
            </label>
            <Field id="nombre" name="nombre" className={styles.input} />
            <ErrorMessage
              name="nombre"
              component="div"
              className={styles.error}
            />

            <label htmlFor="descripcion" className={styles.label}>
              Descripción
            </label>
            <Field
              id="descripcion"
              name="descripcion"
              as="textarea"
              className={styles.textarea}
            />
            <ErrorMessage
              name="descripcion"
              component="div"
              className={styles.error}
            />

            <label htmlFor="precio" className={styles.label}>
              Precio
            </label>
            <Field
              id="precio"
              name="precio"
              type="number"
              className={styles.input}
            />
            <ErrorMessage
              name="precio"
              component="div"
              className={styles.error}
            />

            <label htmlFor="categoria" className={styles.label}>
              Categoría
            </label>
            <Field id="categoria" name="categoria" className={styles.input} />
            <ErrorMessage
              name="categoria"
              component="div"
              className={styles.error}
            />

            <label htmlFor="stock" className={styles.label}>
              Stock
            </label>
            <Field
              id="stock"
              name="stock"
              type="number"
              className={styles.input}
            />
            <ErrorMessage
              name="stock"
              component="div"
              className={styles.error}
            />

            <label htmlFor="imagen" className={styles.label}>
              URL de la imagen
            </label>
            <Field id="imagen" name="imagen" className={styles.input} />
            <ErrorMessage
              name="imagen"
              component="div"
              className={styles.error}
            />

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.submitButton}>
                Guardar cambios
              </button>
            </div>
          </div>
        </Form>
      </div>
    </Formik>
  );
}

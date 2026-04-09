import { useForm } from 'react-hook-form';
import { Form, Title, Field, FieldTextarea, Button } from './FormsComponents';
import styles from './Forms.module.css';

export function AddProductForm({ onSubmit, saving }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = async (data) => {
    const ok = await onSubmit({
      ...data,
      price: Number(data.precio),
      stock: Number(data.stock),
    });
    if (ok) reset();
  };

  return (
    <Form className={styles.addForm} onSubmit={handleSubmit(handleFormSubmit)}>
      <Title className={styles.addTitle}>Agregar nuevo producto</Title>

      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="nombre"
              placeholder="Nombre del producto"
              error={errors.nombre?.message}
              {...register('nombre', { required: 'Este campo es obligatorio' })}
            >
              Nombre
            </Field>
          </div>

          <div className={styles.addField}>
            <FieldTextarea
              labelClassName={styles.productLabel}
              inputClassName={styles.productTextarea}
              id="descripcion"
              placeholder="Descripción detallada del producto"
              error={errors.descripcion?.message}
              {...register('descripcion', {
                required: 'Este campo es obligatorio',
              })}
            >
              Descripción
            </FieldTextarea>
          </div>

          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="precio"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.precio?.message}
              {...register('precio', {
                required: 'Este campo es obligatorio',
                min: {
                  value: 0,
                  message: 'El valor debe ser un número positivo',
                },
              })}
            >
              Precio
            </Field>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="categoria"
              placeholder="Categoría del producto (ej. Alimento, Juguetes)"
              error={errors.categoria?.message}
              {...register('categoria', {
                required: 'Este campo es obligatorio',
              })}
            >
              Categoría
            </Field>
          </div>

          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="imagen"
              placeholder="https://api.example.com/placeholder/image.jpg"
              error={errors.imagen?.message}
              {...register('imagen', { required: 'Este campo es obligatorio' })}
            >
              URL de la imagen
            </Field>
          </div>

          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="stock"
              type="number"
              placeholder="0"
              error={errors.stock?.message}
              {...register('stock', {
                required: 'Este campo es obligatorio',
                min: {
                  value: 0,
                  message: 'El valor debe ser un número positivo',
                },
              })}
            >
              Stock
            </Field>
          </div>
        </div>
      </div>

      <div className={styles.addActions}>
        <Button
          type="submit"
          className={styles.addPrimaryBtn}
          disabled={saving}
        >
          {saving ? 'Agregando...' : 'Agregar Producto'}
        </Button>
      </div>
      <div className={styles.addWarning}>
        <p>
          Por favor, complete todos los campos antes de agregar el producto.
        </p>
      </div>
    </Form>
  );
}

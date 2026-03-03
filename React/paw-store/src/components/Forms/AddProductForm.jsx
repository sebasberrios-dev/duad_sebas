import { useForm } from 'react-hook-form';
import { Form, Title, Field, FieldTextarea, Button } from './FormsComponents';
import styles from './Forms.module.css';

export function AddProductForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      precio: Number(data.precio),
      stock: Number(data.stock),
    });
    reset();
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
              error={errors.nombre ? 'Este campo es obligatorio' : ''}
              {...register('nombre', { required: true })}
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
              error={errors.descripcion ? 'Este campo es obligatorio' : ''}
              {...register('descripcion', { required: true })}
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
              error={
                errors.precio
                  ? 'Este campo es obligatorio y debe ser un número positivo'
                  : ''
              }
              {...register('precio', { required: true, min: 0 })}
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
              error={errors.categoria ? 'Este campo es obligatorio' : ''}
              {...register('categoria', { required: true })}
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
              error={errors.imagen ? 'Este campo es obligatorio' : ''}
              {...register('imagen', { required: true })}
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
              error={
                errors.stock
                  ? 'Este campo es obligatorio y debe ser un número positivo'
                  : ''
              }
              {...register('stock', { required: true, min: 0 })}
            >
              Stock
            </Field>
          </div>
        </div>
      </div>

      <div className={styles.addActions}>
        <Button type="submit" className={styles.addPrimaryBtn}>
          Agregar producto
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

import { useForm } from 'react-hook-form';
import { Form, Title, Field, FieldTextarea, Button } from './FormsComponents';
import styles from './Forms.module.css';
import closeIcon from '../../assets/close-svgrepo-com.svg';

export function EditProductForm({ product, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url,
    },
  });

  return (
    <Form className={styles.addForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.editHeader}>
        <Title className={styles.addTitle}>Editar producto</Title>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onCancel}
          aria-label="Cerrar"
        >
          <img src={closeIcon} alt="Cerrar" className={styles.closeIcon} />
        </button>
      </div>
      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="name"
              placeholder="Nombre del producto"
              error={errors.name ? 'El nombre es obligatorio' : ''}
              {...register('name', { required: true })}
            >
              Nombre
            </Field>
          </div>

          <div className={styles.addField}>
            <FieldTextarea
              labelClassName={styles.productLabel}
              inputClassName={styles.productTextarea}
              id="description"
              placeholder="Descripción detallada del producto"
              error={errors.description ? 'La descripción es obligatoria' : ''}
              {...register('description', { required: true })}
            >
              Descripción
            </FieldTextarea>
          </div>

          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={
                errors.price
                  ? 'El precio es obligatorio y debe ser un número positivo'
                  : ''
              }
              {...register('price', { required: true, min: 0 })}
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
              id="category"
              placeholder="Categoría del producto (ej. Alimento, Juguetes)"
              error={errors.category ? 'La categoría es obligatoria' : ''}
              {...register('category', { required: true })}
            >
              Categoría
            </Field>
          </div>

          <div className={styles.addField}>
            <Field
              labelClassName={styles.productLabel}
              inputClassName={styles.productInput}
              id="image_url"
              placeholder="https://api.example.com/placeholder/image.jpg"
              error={
                errors.image_url ? 'La URL de la imagen es obligatoria' : ''
              }
              {...register('image_url', { required: true })}
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
                  ? 'El stock es obligatorio y debe ser un número positivo'
                  : ''
              }
              {...register('stock', { required: true, min: 0 })}
            >
              Stock
            </Field>
          </div>
        </div>
      </div>

      <div className={styles.editFormActions}>
        <Button type="submit" className={styles.submitButton}>
          Guardar cambios
        </Button>
      </div>
      <div className={styles.addWarning}>
        <p>
          Por favor, complete todos los campos antes de guardar los cambios.
        </p>
      </div>
    </Form>
  );
}

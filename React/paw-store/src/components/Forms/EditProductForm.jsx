import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Form, Title, Field, FieldTextarea, Button } from './FormsComponents';
import styles from './Forms.module.css';
import closeIcon from '../../assets/close-svgrepo-com.svg';

export function EditProductForm({ product, onSubmit, onCancel, saving }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image_url: '',
    },
  });

  useEffect(() => {
    if (!product) return;

    reset({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price ?? 0,
      category: product.category ?? '',
      stock: product.stock ?? 0,
      image_url: product.image_url ?? '',
    });
  }, [product, reset]);

  const handleFormSubmit = async (data) => {
    const ok = await onSubmit({
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
    });

    return ok;
  };

  return (
    <Form className={styles.addForm} onSubmit={handleSubmit(handleFormSubmit)}>
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
              error={errors.name?.message}
              {...register('name', { required: 'El nombre es obligatorio' })}
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
              error={errors.description?.message}
              {...register('description', {
                required: 'La descripción es obligatoria',
              })}
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
              error={errors.price?.message}
              {...register('price', {
                required: 'El precio es obligatorio',
                min: {
                  value: 0,
                  message: 'El precio debe ser un número positivo',
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
              id="category"
              placeholder="Categoría del producto (ej. Alimento, Juguetes)"
              error={errors.category?.message}
              {...register('category', {
                required: 'La categoría es obligatoria',
              })}
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
              error={errors.image_url?.message}
              {...register('image_url', {
                required: 'La URL de la imagen es obligatoria',
              })}
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
                required: 'El stock es obligatorio',
                min: {
                  value: 0,
                  message: 'El stock debe ser un número positivo',
                },
              })}
            >
              Stock
            </Field>
          </div>
        </div>
      </div>

      <div className={styles.editFormActions}>
        <Button
          type="submit"
          className={styles.submitButton}
          disabled={!isDirty || saving}
          title={!isDirty ? 'No hay cambios para guardar' : ''}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
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

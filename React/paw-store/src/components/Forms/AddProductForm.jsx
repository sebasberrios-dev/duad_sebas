import { useForm } from 'react-hook-form';
import styles from './AddProductForm.module.css';

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
    <form className={styles.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className={styles.title}>Agregar nuevo producto</h2>
      <div className={styles.grid}>
        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              placeholder="Nombre del producto"
              {...register('nombre', { required: true })}
            />
            <div aria-live="assertive">
              {errors.nombre && <span>Este campo es obligatorio</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              placeholder="Descripción detallada del producto"
              {...register('descripcion', { required: true })}
            ></textarea>
            <div aria-live="assertive">
              {errors.descripcion && <span>Este campo es obligatorio</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="precio">Precio</label>
            <input
              id="precio"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('precio', { required: true, min: 0 })}
            />
            <div aria-live="assertive">
              {errors.precio && (
                <span>
                  Este campo es obligatorio y debe ser un número positivo
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.field}>
            <label htmlFor="categoria">Categoría</label>
            <input
              id="categoria"
              placeholder="Categoría del producto (ej. Alimento, Juguetes)"
              {...register('categoria', { required: true })}
            />
            <div aria-live="assertive">
              {errors.categoria && <span>Este campo es obligatorio</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="imagen">URL de la imagen</label>
            <input
              id="imagen"
              placeholder="/ap/placeholder/600x400"
              {...register('imagen', { required: true })}
            />
            <div aria-live="assertive">
              {errors.imagen && <span>Este campo es obligatorio</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="stock">Stock</label>
            <input
              id="stock"
              type="number"
              placeholder="0"
              {...register('stock', { required: true, min: 0 })}
            />
            <div aria-live="assertive">
              {errors.stock && (
                <span>
                  Este campo es obligatorio y debe ser un número positivo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit">Agregar producto</button>
      </div>
      <div className={styles.warning}>
        <p>
          Por favor, complete todos los campos antes de agregar el producto.
        </p>
      </div>
    </form>
  );
}

import { useState } from 'react';
import styles from './Administration.module.css';
import { AdminProductsTable } from '../components/Table/AdminProductsTable.jsx';
import { EditProductForm } from '../components/Forms/EditProductForm.jsx';
import { AddProductForm } from '../components/Forms/AddProductForm.jsx';
import { useProductsStore } from '../store/useProductsStore.jsx';

export default function Administration() {
  const { products, deleteProduct, updateProduct, addProduct, loading, error } =
    useProductsStore();
  const [editingProduct, setEditingProduct] = useState(null);
  const columns = ['ID', 'NOMBRE', 'PRECIO', 'CATEGORÍA', 'STOCK', 'ACCIONES'];
  const handleDelete = (product) => {
    deleteProduct(product.id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (values) => {
    if (!editingProduct) {
      return;
    }

    updateProduct(editingProduct.id, {
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      category: values.category.trim(),
      stock: Number(values.stock),
      image_url: values.image_url.trim(),
    });

    setEditingProduct(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = (data) => {
    const newProduct = {
      name: data.nombre.trim(),
      description: data.descripcion.trim(),
      price: data.precio,
      category: data.categoria.trim(),
      stock: data.stock,
      image_url: data.imagen.trim(),
    };
    addProduct(newProduct);
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Administración de Productos</h1>
        {loading && <p className={styles.message}>Cargando productos...</p>}
        {error && <p className={styles.error}>¡Ups algo salió mal!</p>}
        {!loading && !error && (
          <AdminProductsTable
            data={products}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {editingProduct ? (
          <EditProductForm
            product={editingProduct}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        ) : (
          <AddProductForm onSubmit={handleAddProduct} />
        )}
      </div>
    </section>
  );
}

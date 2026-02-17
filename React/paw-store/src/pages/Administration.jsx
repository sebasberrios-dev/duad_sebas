import { useState } from 'react';
import styles from './Administration.module.css';
import { AdminProductsTable } from '../components/Table/AdminProductsTable.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { EditProductForm } from '../components/Forms/EditProductForm.jsx';
import { AddProductForm } from '../components/Forms/AddProductForm.jsx';

export function Administration() {
  const { products, deleteProduct, updateProduct, addProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);

  const columns = ['ID', 'NOMBRE', 'PRECIO', 'CATEGORÍA', 'STOCK', 'ACCIONES'];

  const handleDelete = (product) => {
    deleteProduct(product.id);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = (values, helpers) => {
    if (!editingProduct) {
      return;
    }

    updateProduct(editingProduct.id, {
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim(),
      precio: Number(values.precio),
      categoria: values.categoria.trim(),
      stock: Number(values.stock),
      imagen: values.imagen.trim(),
    });

    setEditingProduct(null);

    if (helpers?.setSubmitting) {
      helpers.setSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = (data) => {
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      precio: data.precio,
      categoria: data.categoria.trim(),
      stock: data.stock,
      imagen: data.imagen.trim(),
    };
    addProduct(newProduct);
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <AdminProductsTable
          columns={columns}
          data={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          title="Administración de Productos"
          description="En esta sección puedes gestionar el catálogo de productos de Paw Store."
        />

        <AddProductForm onSubmit={handleAddProduct} />

        {editingProduct && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <EditProductForm
                product={editingProduct}
                onSubmit={handleUpdate}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

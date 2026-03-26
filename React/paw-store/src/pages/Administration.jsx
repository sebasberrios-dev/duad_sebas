import styles from './Administration.module.css';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import {
  showAlertError,
  showAlertSuccess,
} from '../components/Messages-States/Alerts.jsx';
import { AdminProductsTable } from '../components/Table/AdminProductsTable.jsx';
import { EditProductForm } from '../components/Forms/EditProductForm.jsx';
import { AddProductForm } from '../components/Forms/AddProductForm.jsx';
import { useProductsStore } from '../store/useProductsStore.jsx';

export default function Administration() {
  const products = useProductsStore((state) => state.products);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  const addProduct = useProductsStore((state) => state.addProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const deleteProduct = useProductsStore((state) => state.deleteProduct);

  const isFetchingProducts = useProductsStore(
    (state) => state.loading.fetchingProducts
  );
  const isAddingProduct = useProductsStore(
    (state) => state.loading.addingProduct
  );
  const isUpdatingProduct = useProductsStore(
    (state) => state.loading.updatingProduct
  );

  const actionError = useProductsStore((state) => state.error.action);
  const screenError = useProductsStore((state) => state.error.screen);

  const columns = ['ID', 'NOMBRE', 'PRECIO', 'CATEGORÍA', 'STOCK', 'ACCIONES'];
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, []);

  const handleDelete = async (product) => {
    try {
      await deleteProduct(product.id);
      showAlertSuccess('Éxito!', 'Producto eliminado correctamente');
    } catch (e) {
      showAlertError('Error', actionError);
    }
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleUpdate = async (values) => {
    if (!id) return;
    try {
      await updateProduct(Number(id), {
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        category: values.category.trim(),
        stock: Number(values.stock),
        image_url: values.image_url.trim(),
      });
      showAlertSuccess('Éxito!', 'Se modificó el producto correctamente.');
    } catch (e) {
      showAlertError('Error', actionError);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleAddProduct = async (data) => {
    const newProduct = {
      name: data.nombre.trim(),
      description: data.descripcion.trim(),
      price: data.precio,
      category: data.categoria.trim(),
      stock: data.stock,
      image_url: data.imagen.trim(),
    };
    try {
      await addProduct(newProduct);
      showAlertSuccess('Éxito!', 'Se eliminó el producto correctamente.');
    } catch (e) {
      showAlertError('Error', actionError);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Administración de Productos</h1>

        {isFetchingProducts && (
          <p className={styles.message}>Cargando productos...</p>
        )}
        {screenError && <p className={styles.error}>¡Ups algo salió mal!</p>}

        {
          <AdminProductsTable
            data={products}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        }
        {product ? (
          <EditProductForm
            product={product}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
            saving={isUpdatingProduct}
          />
        ) : (
          <AddProductForm
            onSubmit={handleAddProduct}
            saving={isAddingProduct}
          />
        )}
      </div>
    </section>
  );
}

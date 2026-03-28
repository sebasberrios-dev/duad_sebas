import styles from './ProductDetails.module.css';
import shared from '../components/shared.module.css';
import { useNavigate, useParams } from 'react-router';
import { useProductsStore } from '../store/useProductsStore.jsx';
import { usePurchaseStore } from '../store/usePurchaseStore.jsx';
import { useEffect } from 'react';
import { LoadingPage } from '../components/Messages-States/Loading.jsx';
import {
  ErrorMessage,
  ErrorPage,
} from '../components/Messages-States/Error.jsx';
import {
  showAlertError,
  showAlertSuccess,
} from '../components/Messages-States/Alerts.jsx';
import { NotFound } from '../components/Messages-States/NotFound.jsx';

function Image({ image }) {
  return (
    <div className={styles.imgContainer}>
      <img src={image} alt="Producto" className={styles.productImageDetail} />
    </div>
  );
}

export default function ProductDetail() {
  const navigate = useNavigate();

  const products = useProductsStore((state) => state.products);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  const isFetchingProducts = useProductsStore(
    (state) => state.loading.fetchingProducts
  );
  const screenError = useProductsStore((state) => state.error.screen);
  const actionError = usePurchaseStore((state) => state.error.action);
  const { id } = useParams();

  const initializeCart = usePurchaseStore((state) => state.initializeCart);
  const addToCart = usePurchaseStore((state) => state.addToCart);
  const addingItemId = usePurchaseStore((state) => state.loading.addingItemId);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    initializeCart();
  }, []);

  const product = products.find((p) => p.id === parseInt(id));

  const handleAddToCart = async () => {
    try {
      await addToCart({ product_id: product.id, quantity: 1 });
      showAlertSuccess('Éxito!', 'Producto añadido al carrito');
    } catch (e) {
      showAlertError('Error', actionError);
    }
  };

  if (isFetchingProducts) return <LoadingPage element={'producto'} />;
  if (screenError) return <ErrorPage text={screenError} />;
  if (!product)
    return (
      <NotFound
        title="Producto no encontrado"
        message="El producto que estás buscando no existe"
      />
    );

  return (
    <section className={styles.productDetailPage}>
      <Image image={product.image_url} />
      <div className={styles.container}>
        <h1 className={styles.detailTitle}>{product.name}</h1>
        <p className={styles.price}>₡{product.price}</p>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.description}>{product.description} </p>
        <div className={styles.actions}>
          <button
            className={`${shared.btn} `}
            onClick={handleAddToCart}
            disabled={addingItemId === product.id}
          >
            {addingItemId === product.id ? 'Añadiendo...' : 'Añadir al carrito'}
          </button>
          <button
            className={`${shared.btn} ${shared.btnPrimary}`}
            onClick={() => navigate('/products')}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    </section>
  );
}

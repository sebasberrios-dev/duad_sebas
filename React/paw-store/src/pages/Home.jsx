import { Link } from 'react-router';
import styles from './Home.module.css';
import { useEffect } from 'react';
import { useProductsStore } from '../store/useProductsStore.jsx';
import { useNavigate } from 'react-router';
import { ProductCard } from '../components/Products/ProductCard.jsx';

export function Home() {
  const mostPurchasedProducts = useProductsStore(
    (state) => state.mostPurchasedProducts
  );
  const fetchMostPurchased = useProductsStore(
    (state) => state.fetchMostPurchased
  );
  const isFetchingMostPurchased = useProductsStore(
    (state) => state.loading.fetchingMostPurchased
  );
  const actionError = useProductsStore((state) => state.error.action);

  const navigate = useNavigate();
  useEffect(() => {
    fetchMostPurchased();
  }, []);

  const onViewDetails = (product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <section>
      <div className={styles.homeContainer}>
        <h1 className={styles.homeTitle}>Bienvenido a PawStore</h1>
        <p className={styles.description}>
          Somos una tienda dedicada a ofrecer productos de calidad para tus
          mascotas.
        </p>
        <p className={styles.description}>
          Explora nuestro catálogo para encontrar camas, juguetes, accesorios y
          más.
        </p>
        <Link className={styles.productsLink} to="/products">
          Ver Productos
        </Link>
        <div className={styles.featuredSection}>
          <h2 className={styles.featuredTitle}>Productos Destacados</h2>
          {isFetchingMostPurchased && mostPurchasedProducts.length === 0 && (
            <p>Cargando productos destacados...</p>
          )}
          {actionError && <p className={styles.error}>{actionError}</p>}
          {mostPurchasedProducts.length === 0 && (
            <p className={styles.message}>
              No hay productos destacados disponibles.
            </p>
          )}
          <div className={styles.featuredGrid}>
            {mostPurchasedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

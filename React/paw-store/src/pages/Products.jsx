import styles from './Products.module.css';
import { NoProductsMessage } from '../components/Products/NoProductsMessage.jsx';
import { LoadingPage } from '../components/Messages-States/Loading.jsx';
import { ErrorPage } from '../components/Messages-States/Error.jsx';
import { ProductCard } from '../components/Products/ProductCard.jsx';
import { useProductsStore } from '../store/useProductsStore.jsx';
import { useCart } from '../store/CartContext.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function ProductsPage({ func, products }) {
  return (
    <section className={styles.productsPage}>
      <h1 className={styles.productsTitle}>Catalogo de Productos</h1>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={func}
          />
        ))}
      </div>
    </section>
  );
}

export default function Products() {
  const products = useProductsStore((state) => state.products);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);
  const isFetchingProducts = useProductsStore(
    (state) => state.loading.fetchingProducts
  );
  const screenError = useProductsStore((state) => state.error.screen);

  const { initializeCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
    initializeCart();
  }, []);

  const onViewDetails = (product) => {
    navigate(`/products/${product.id}`);
  };

  const filteredProducts = products.filter((p) => p.stock > 0);

  return isFetchingProducts ? (
    <LoadingPage element="catálogo" />
  ) : screenError ? (
    <ErrorPage text={screenError} />
  ) : filteredProducts.length === 0 ? (
    <NoProductsMessage />
  ) : (
    <ProductsPage func={onViewDetails} products={filteredProducts} />
  );
}

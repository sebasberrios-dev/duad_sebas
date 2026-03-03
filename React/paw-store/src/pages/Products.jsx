import './Products.css';
import { NoProductsMessage } from '../components/Products/NoProductsMessage.jsx';
import { Loading } from '../components/Messages-States/Loading.jsx';
import { ErrorMessage } from '../components/Messages-States/ErrorMesagge.jsx';
import { ProductCard } from '../components/Products/ProductCard.jsx';
import { useProductsStore } from '../store/useProductsStore.jsx';

function ProductsPage({ func, products }) {
  return (
    <section className="products-page">
      <h1 className="products-title">Catalogo de Productos</h1>
      <div className="products-grid">
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

export default function Products({ onViewDetails }) {
  const { products, loading, error } = useProductsStore();

  return (
    console.log('Products renderizado con:', { products, loading, error }) || (
      <>
        {loading && <Loading element={'catálogo'} />}
        {error && <ErrorMessage text={error} />}
        {products.length === 0 && !loading && !error && <NoProductsMessage />}
        {products.length > 0 && !loading && !error && (
          <ProductsPage func={onViewDetails} products={products} />
        )}
      </>
    )
  );
}

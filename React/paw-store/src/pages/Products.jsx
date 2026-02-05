import './Products.css';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { NoProductsMessage } from '../components/NoProductsMessage';
import { ErrorMessage } from '../components/ErrorMesagge';
import { ProductCard } from '../components/ProductCard';

export default function Products({ onViewDetails }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const data = await import('../data/products.json');
        setProducts(data.default);
      } catch (err) {
        setError('Error al cargar los productos.');
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading element={'productos'} />;
  }

  if (error) {
    return <ErrorMessage text={error} />;
  }

  if (products.length === 0) {
    return <NoProductsMessage />;
  }

  return (
    <section className="products-page">
      <h1 className="products-title">Catalogo de Productos</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}

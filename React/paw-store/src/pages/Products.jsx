import './Products.css';
import { NoProductsMessage } from '../components/Products/NoProductsMessage.jsx';
import { ProductCard } from '../components/Products/ProductCard.jsx';
import { useProducts } from '../context/ProductsContext.jsx';

export default function Products({ onViewDetails }) {
  const { products } = useProducts();

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

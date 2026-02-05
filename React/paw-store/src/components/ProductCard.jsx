import './ProductCard.css';

export function ProductCard({ product, onViewDetails }) {
  return (
    <div className="product-card">
      <img
        src={product.imagen}
        alt={product.nombre}
        className="product-image"
      />
      <div className="product-content">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-price">₡{product.precio}</p>
        <p className="product-category">{product.categoria}</p>
        <button
          className="details-button"
          onClick={() => onViewDetails(product)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

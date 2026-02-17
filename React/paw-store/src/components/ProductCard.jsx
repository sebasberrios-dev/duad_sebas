import './Components.css';

export function ProductCard({ product, onViewDetails }) {
  return (
    <div className="product-card">
      <img
        src={product.imagen}
        alt={product.nombre}
        className="product-image"
      />
      <div className="product-content">
        <h3 className="title-sm">{product.nombre}</h3>
        <p className="price">₡{product.precio}</p>
        <p className="text-small">{product.categoria}</p>
        <button
          className="btn btn-primary btn-full"
          onClick={() => onViewDetails(product)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}

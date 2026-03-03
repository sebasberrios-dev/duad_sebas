import './ProductDetails.css';

function Image({ image }) {
  return (
    <div className="img-container">
      <img src={image} alt="Producto" className="product-image-detail" />
    </div>
  );
}

export default function ProductDetail({ product, onNavigate }) {
  return (
    <section className="product-detail-page">
      <Image image={product.image_url} />
      <div className="container">
        <h1 className="detail-title">{product.name}</h1>
        <p className="price">₡{product.price}</p>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>
        <p className="message">
          Más adelante aquí se podrá agregar este producto al carrito y
          completar la compra
        </p>
        <button className="back" onClick={() => onNavigate('products')}>
          Volver al catálogo
        </button>
      </div>
    </section>
  );
}

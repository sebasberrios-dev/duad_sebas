import './Home.css';

export function Home({ onNavigate }) {
  return (
    <section>
      <div className="home-container">
        <h1 className="title">Bienvenido a PawStore</h1>
        <p className="description">
          Somos una tienda dedicada a ofrecer productos de calidad para tus
          mascotas.
        </p>
        <p className="description">
          Explora nuestro catálogo para encontrar camas, juguetes, accesorios y
          más.
        </p>
        <button
          className="primary-button"
          onClick={() => onNavigate('products')}
        >
          Ver Productos
        </button>
        <p className="message">
          Esta es la página principal de la aplicación. Más adelante aquí se
          podrán mostrar productos destacados.
        </p>
      </div>
    </section>
  );
}

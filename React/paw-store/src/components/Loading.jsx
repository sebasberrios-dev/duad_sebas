import './Loading.css';

export function Loading({ element }) {
  return (
    <section>
      <div className="loading-container">
        <h2 className="message">Cargando {element}...</h2>
      </div>
    </section>
  );
}

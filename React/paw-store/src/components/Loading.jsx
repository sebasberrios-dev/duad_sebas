import './Components.css';

export function Loading({ element }) {
  return (
    <section>
      <div className="centered-container loading-container">
        <h2 className="title">Cargando {element}...</h2>
      </div>
    </section>
  );
}

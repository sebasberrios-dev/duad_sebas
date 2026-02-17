import shared from '../shared.module.css';

export function Loading({ element }) {
  return (
    <section>
      <div className={shared.container}>
        <h2 className={shared.title}>Cargando {element}...</h2>
      </div>
    </section>
  );
}

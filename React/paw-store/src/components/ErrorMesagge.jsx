import './Components.css';
export function ErrorMessage({ text }) {
  return (
    <section>
      <div className="centered-container">
        <h2 className="title error-message">Ups, algo salió mal: {text}</h2>
      </div>
    </section>
  );
}

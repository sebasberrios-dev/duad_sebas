import './ErrorMessage.css';
export function ErrorMessage({ text }) {
  return (
    <section>
      <div className="error-container">
        <h2 className="error-message">Ups, algo salió mal: {text}</h2>
      </div>
    </section>
  );
}

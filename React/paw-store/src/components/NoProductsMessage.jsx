import sadEmoji from '../assets/sentiment_dissatisfied_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg';
import './NoProductsMessage.css';

export function NoProductsMessage() {
  return (
    <section>
      <div className="no-products-message">
        <img src={sadEmoji} alt="No products available" className="emoji" />
        <h2 className="text">No se encontraron productos disponibles</h2>
      </div>
    </section>
  );
}

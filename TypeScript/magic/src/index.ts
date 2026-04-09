import { getCardsByColor, getCardsByName, getCardsByRarity } from "./api";

async function main() {
  const cards = await getCardsByRarity("Rare");

  if (cards.length === 0) {
    console.log("No se encontraron cartas o hubo un error en la búsqueda.");
    return;
  }

  cards.forEach((card) => {
    console.log(`🎴 Nombre: ${card.name}`);
    console.log(`❓ Tipo: ${card.type}`);
    console.log(`🌈 Colores: ${card.colors?.join(", ") ?? "Incoloro"}`);
    console.log(`🖌️ Rareza: ${card.rarity}`);
    console.log("=====================================");
  });
}

main();

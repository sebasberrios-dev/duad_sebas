import fetch from "node-fetch";
import {
  BaseApiResponse,
  MagicCard,
  ApiResponse,
  MagicColor,
  Rarity,
} from "./types";

export async function fetchFromApi<T extends BaseApiResponse>(
  endpoint: string,
): Promise<T> {
  const url = `
https://api.magicthegathering.io/v1/
${endpoint}
`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Error en la API: ${response.statusText}`);

    const data = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Respuesta inválida de la API");
    }

    return data as T;
  } catch (e) {
    console.error("Error en la petición:", e);
    throw e;
  }
}

export async function getCardsByName(name: string): Promise<MagicCard[]> {
  try {
    const data = await fetchFromApi<ApiResponse<MagicCard>>(
      `cards?name=${encodeURIComponent(name)}`,
    );
    return data.cards;
  } catch (e) {
    console.warn(`⚠️ Error al buscar cartas con nombre ${name}`);
    console.error(e);
    return [];
  }
}

export async function getCardsByColor(color: MagicColor): Promise<MagicCard[]> {
  try {
    const data = await fetchFromApi<ApiResponse<MagicCard>>(
      `cards?colors?=${encodeURIComponent}`,
    );
    return data.cards;
  } catch (e) {
    console.warn(`⚠️ Error al buscar cartas con colores ${color}`);
    console.error(e);
    return [];
  }
}

export async function getCardsByRarity(rarity: Rarity): Promise<MagicCard[]> {
  try {
    const data = await fetchFromApi<ApiResponse<MagicCard>>(
      `cards?rarity=${encodeURIComponent(rarity)}`,
    );

    return data.cards;
  } catch (e) {
    console.warn(`⚠️ Error al buscar cartas con rareza tipo ${rarity}`);
    console.error(e);
    return [];
  }
}

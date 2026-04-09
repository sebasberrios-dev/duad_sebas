export type MagicColor = "White" | "Blue" | "Black" | "Red" | "Green";

export type Rarity = "Common" | "Uncommon" | "Rare" | "Mythic Rare";

export interface MagicCard {
  id: string;
  name: string;
  manaCost?: string;
  cmc?: number;
  colors?: MagicColor[];
  type: string;
  rarity: Rarity;
  set: string;
  text?: string;
  power?: string;
  toughness?: string;
  imageUrl?: string;
}

export interface BaseApiResponse {
  status: number;
  [key: string]: unknown;
}

export interface ApiResponse<T> extends BaseApiResponse {
  cards: T[];
}

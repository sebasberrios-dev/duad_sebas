const Days = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miercoles",
  thursday: "Jueves",
  friday: "Viernes",
} as const;

export type Days = (typeof Days)[keyof typeof Days];

export type Level = "Principiante" | "Intermedio" | "Avanzado";

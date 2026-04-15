# Fit Tracker

Aplicación de consola desarrollada en **TypeScript** para gestionar y visualizar rutinas de ejercicio semanales. Calcula calorías quemadas, ritmo (pace) y muestra un resumen del perfil del usuario junto con sus estadísticas de entrenamiento.

## Estructura del Proyecto

```
fit-tracker/
├── src/
│   ├── index.ts        # Punto de entrada principal
│   ├── interfaces.ts   # Interfaces (Exercise, RoutineEntry, Routine, User)
│   └── types.ts        # Types personalizados (Days, Level)
├── package.json
└── tsconfig.json
```

## Tecnologías

- **TypeScript** 5.8
- **Node.js**
- **tsx** (ejecución directa de TypeScript)

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- npm

## Instalación

```bash
cd TypeScript/fit-tracker
npm install
```

## Ejecución

### Modo desarrollo (recomendado)

Ejecuta directamente el archivo TypeScript sin necesidad de compilar:

```bash
npm run dev
```

### Compilar y ejecutar

Compila el proyecto a JavaScript y luego ejecútalo:

```bash
npm run build
node dist/index.js
```

## Salida Esperada

```
👤 Perfil de Usuario
=====================
Nombre: Sebastián Berríos Aguilera
Edad: 21
Nivel: Intermedio

📋 Rutina Semanal: Full Body Plan
──────────────────────────────────
Lunes:  Running - 45min - 8.65 min/km (468 cal)
Miercoles:  Squats - 30min (300 cal)
Viernes:  Swimming - 1h (720 cal)
──────────────────────────────────
Total semanal: 1488 calorías
Promedio por día: 496 (3 días entrenados)
──────────────────────────────────
```

## Funcionalidades

- **Perfil de usuario**: Muestra nombre, edad y nivel de entrenamiento.
- **Rutina semanal**: Define ejercicios asignados a días específicos de la semana.
- **Cálculo de calorías**: Calcula calorías por ejercicio y total semanal.
- **Cálculo de pace**: Muestra el ritmo (min/km) para ejercicios con distancia.
- **Formato de duración**: Convierte minutos a formato legible (ej: `1h30min`).
- **Promedio diario**: Calcula el promedio de calorías por día entrenado.

## Types Personalizados

| Type    | Valores                                                           |
| ------- | ----------------------------------------------------------------- |
| `Days`  | `"Lunes"` · `"Martes"` · `"Miercoles"` · `"Jueves"` · `"Viernes"` |
| `Level` | `"Principiante"` · `"Intermedio"` · `"Avanzado"`                  |

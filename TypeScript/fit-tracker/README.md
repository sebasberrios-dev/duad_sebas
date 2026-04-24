# Fit Tracker

Aplicación web de seguimiento de rutinas de ejercicio construida con React, TypeScript y Vite.

## Descripción

Fit Tracker permite a los usuarios registrarse, iniciar sesión y gestionar su rutina de ejercicios. Los usuarios pueden armar un catálogo de ejercicios y asociarlos a su perfil con detalles específicos según la categoría (Cardio, Fuerza o Flexibilidad). Al finalizar, pueden ver un resumen completo de su rutina con estadísticas de calorías, duración y ritmo.

## Tecnologías

- **React 19** + **TypeScript**
- **Vite** como bundler
- **React Hook Form** + **Zod** para manejo y validación de formularios
- **React Router** para navegación
- **Tailwind CSS** para estilos

## Arquitectura de datos (sin API)

Al no contar con una API ni base de datos real, la persistencia se resuelve con **`localStorage`** como capa de almacenamiento. Toda la lógica de lectura y escritura está centralizada en tres contextos de React:

### `UserContext`

Actúa como la "base de datos" de usuarios. Almacena el array completo de usuarios registrados en `localStorage` y expone funciones para agregar (`addUser`) y actualizar (`updateUser`) usuarios. Cualquier componente que necesite leer o modificar datos de usuarios consume este contexto.

### `SessionContext`

Maneja la sesión activa. En lugar de guardar todo el objeto del usuario en sesión, guarda únicamente el `id` del usuario activo en `localStorage`. Para obtener el `currentUser` completo, busca ese `id` dentro del array que provee `UserContext`. Esto garantiza que si el usuario es actualizado (por ejemplo al agregar un ejercicio a su rutina), la sesión siempre refleja los datos más recientes sin necesidad de sincronización manual.

> Aclaración: `SessionContext` no es un almacén de datos — es una capa de acceso que depende de `UserContext`. Por eso vive anidado dentro de `UserProvider` en el árbol de providers.

### `CatalogContext`

Almacena el catálogo de ejercicios disponibles para seleccionar al registrar una rutina. También persiste en `localStorage`. El catálogo no está asociado a ningún usuario — es un recurso compartido que cualquier usuario puede consultar.

## Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables (inputs, etc.)
├── context/           # UserContext, SessionContext, CatalogContext
├── pages/
│   ├── Admin/         # Registro de ejercicios al catálogo
│   ├── RegisterExercise/  # Registro de ejercicios en la rutina del usuario
│   └── User/          # Registro e inicio de sesión de usuarios
├── routes/            # Configuración de React Router
├── types/             # Interfaces y tipos TypeScript
└── utils/             # Funciones de cálculo y formato (calorías, duración, ritmo, etc.)
```

## Rutas

| Ruta              | Página                           |
| ----------------- | -------------------------------- |
| `/`               | Registro de usuario              |
| `/login`          | Inicio de sesión                 |
| `/exercise`       | Registrar ejercicio en la rutina |
| `/admin/exercise` | Agregar ejercicio al catálogo    |

## Instrucciones para correr el proyecto

```bash
npm install
npm run dev
```

### Flujo de uso

1. Ir a `/admin/exercise` y agregar al menos un ejercicio al catálogo (nombre, categoría y descripción).
2. Registrarse en `/` con nombre, edad, peso, nivel y plan de membresía. Al registrarse, se crea la sesión automáticamente y redirige a `/exercise`.
3. En `/exercise`, seleccionar un ejercicio del catálogo, completar los detalles según la categoría y guardar. El ejercicio se guarda en la rutina del usuario activo.
4. Hacer click en **"Ver mi rutina"** para imprimir en consola el resumen completo de la rutina con estadísticas.
5. Para cambiar de usuario, ir a `/login` e ingresar el nombre de un usuario ya registrado.

> Los datos persisten en `localStorage`, por lo que se mantienen al recargar la página.

---

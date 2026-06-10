# FitTracker

Aplicación web de seguimiento de rutinas de ejercicio construida con React 19, TypeScript y Vite. Soporta tres roles de usuario (Usuario, Coach, Administrador) con dashboards independientes y persistencia en `localStorage`.

## Tecnologías

- **React 19** + **TypeScript** (modo estricto)
- **Vite** como bundler
- **React Router v7** (data router) para navegación y guardas de ruta
- **React Hook Form v7** + **Zod v4** para manejo y validación de formularios
- **Tailwind CSS v4** para estilos
- **jsPDF** para exportación de reportes en PDF

## Arquitectura de datos

La persistencia se resuelve con `localStorage` como capa de almacenamiento. Toda la lógica está centralizada en un único proveedor global.

### `EntityStore<T>`

Clase genérica que implementa las operaciones CRUD básicas: `add`, `getAll`, `findById`, `replace`, `update`, `deleteById`, `findBy`. Opera en memoria y es serializable a JSON.

### `useStoredList<T>`

Hook de React que envuelve `EntityStore<T>` con sincronización automática a `localStorage` y validación con Zod al cargar. Incluye una guarda de inicialización lazy para evitar duplicados en React Strict Mode.

### `AppStoreProvider`

Proveedor único que compone tres instancias de `useStoredList` (usuarios, rutinas, catálogo) y expone el estado global a través de `AppStoreContext`. Exporta hooks de acceso por dominio: `useUsers()`, `useRoutines()`, `useCatalog()`.

### `SessionContext`

Maneja la sesión activa guardando únicamente el `id` del usuario en `localStorage`. Obtiene el objeto completo desde `AppStore` en cada render, garantizando que la sesión siempre refleje datos actualizados.

### Catálogo de ejercicios

El catálogo se carga desde la API pública de ExerciseDB (RapidAPI) al iniciar la aplicación. Si la API no está disponible, se usa el catálogo local guardado en `localStorage` como fallback.

## Roles y funcionalidades

### Usuario

- Registrar y visualizar su rutina semanal de ejercicios
- Ver estadísticas: calorías estimadas, duración total, recomendación semanal

### Coach

- Ver el listado de sus clientes asignados
- Acceder al catálogo de ejercicios

### Administrador

- Dashboard del estado del sistema: usuarios registrados, catálogo, rutinas activas, carga semanal, actividad reciente
- Asignar coaches a usuarios
- Agregar ejercicios locales al catálogo
- Exportar reporte completo del sistema en PDF (catálogo + perfiles de usuario)

## Estructura del proyecto

```
src/
├── components/          # Componentes UI reutilizables (inputs, labels, títulos)
├── context/
│   ├── AppStore.tsx     # Proveedor global único + hooks de acceso por dominio
│   ├── SessionContext.tsx
│   ├── types/           # Interfaces de los valores de contexto
│   └── utils/           # EntityStore, useStoredList, schemas Zod
├── features/            # Componentes organizados por feature
│   ├── auth/            # Campos de formulario reutilizables (email, password, etc.)
│   ├── catalog-exercise/# Tipos y schemas del catálogo
│   ├── sidebar/         # Sidebar, NavItem, iconos
│   └── system-dashboard/# StatsCard, WeeklyLoadTable, CategoryBreakdown, etc.
├── pages/
│   ├── Admin/           # RegisterCatalogExercise, AssignCoach, auth de admin
│   ├── Auth/            # LoginUser, RegisterUser, CoachLogin, CoachRegister
│   ├── Catalog/         # Vista del catálogo de ejercicios
│   ├── CoachView/       # Vista de clientes del coach
│   ├── Dashboard/       # Dashboard layout + SystemDashboard
│   ├── MyRoutines/      # Historial de rutinas del usuario
│   └── RegisterRoutine/ # Formulario de registro de rutina
├── routes/              # Configuración de React Router + RootRedirect
├── static/              # Sidebar (componente con estado de colapso)
├── types/               # Interfaces globales (User, Coach, Admin, Routine, etc.)
└── utils/               # Utilidades: cálculo de calorías, formateo, reporte, exportación PDF
```

## Rutas

| Ruta                              | Acceso    | Página                          |
| --------------------------------- | --------- | ------------------------------- |
| `/`                               | Todos     | Redirige según rol activo       |
| `/login`                          | Público   | Inicio de sesión de usuario     |
| `/register`                       | Público   | Registro de usuario             |
| `/coach/login`                    | Público   | Inicio de sesión de coach       |
| `/coach/register`                 | Público   | Registro de coach               |
| `/admin/login`                    | Público   | Inicio de sesión de admin       |
| `/admin/register`                 | Público   | Registro de admin               |
| `/dashboard`                      | Admin     | Estado del sistema              |
| `/dashboard/admin/assign_coach`   | Admin     | Asignar coach a usuarios        |
| `/dashboard/admin/register_exercise` | Admin  | Agregar ejercicio al catálogo   |
| `/dashboard/catalog`              | Admin/Coach | Catálogo de ejercicios        |
| `/dashboard/routine`              | Usuario   | Registrar rutina                |
| `/dashboard/my_routines`          | Usuario   | Ver mis rutinas                 |
| `/dashboard/coach/my_clients`     | Coach     | Ver mis clientes                |

## Instrucciones para correr el proyecto

```bash
pnpm install
pnpm dev
```

## Flujo de uso por rol

### Administrador
1. Registrarse en `/admin/register` e ingresar en `/admin/login`.
2. Desde el sidebar: ir a **Añadir ejercicio** para poblar el catálogo local.
3. Ir a **Asignar Coach** para vincular coaches con usuarios registrados.
4. El dashboard principal muestra el estado global del sistema.
5. Hacer clic en **Descargar reporte PDF** para exportar el reporte completo.

### Usuario
1. Registrarse en `/register` e ingresar en `/login`.
2. En **Registrar rutina**, seleccionar ejercicios del catálogo y completar los detalles según la categoría (Cardio, Fuerza o Flexibilidad).
3. En **Ver mis rutinas**, consultar el historial con estadísticas de calorías, duración y recomendación semanal.

### Coach
1. Registrarse en `/coach/register` e ingresar en `/coach/login`.
2. En **Mis clientes**, ver el listado de usuarios asignados.
3. En **Catálogo**, consultar los ejercicios disponibles.

> Los datos persisten en `localStorage`, por lo que se mantienen al recargar la página.

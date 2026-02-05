# PawStore - Tienda de Productos para Mascotas

Aplicación web desarrollada con Vite + React para la venta de productos para mascotas.

## Instalación y Ejecución

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm

### Pasos de Instalación

1. Clona el repositorio
2. Navega a la carpeta del proyecto:

```bash
cd paw-store
```

3. Instala las dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre tu navegador e ingresa a la URL local que aparece en la terminal (generalmente `http://localhost:5173`)

## Navegación

La aplicación inicia en la **página de inicio**. Desde ahí puedes navegar por el sitio usando el menú de navegación:

- **Inicio**: Página principal con información de bienvenida
- **Productos**: Catálogo de productos disponibles
- **Contacto**: Página en mantenimiento

## Comportamiento de Carga

### Página de Productos

- **Primera vez**: Se renderizan primero los componentes del catálogo, luego se cargan los productos del JSON. Verás la pantalla de carga del catálogo y de los productos.
- **Siguientes visitas**: Solo se cargarán los productos (ya no verás la carga del catálogo). Esto es porque los componentes del catálogo se cargan antes que los productos, y si no se pone un timer se renderiza el mensaje "no hay productos" antes de que el catálogo con productos esté listo.

### Página de Detalle

Solo hay espera la primera vez que se monta el componente.

## Estructura del Proyecto

```
paw-store/
├── src/
│   ├── components/     # Componentes reutilizables (Navbar, Footer, ProductCard, etc.)
│   ├── pages/         # Páginas (Home, Products, ProductDetails)
│   ├── data/          # Datos JSON con productos
│   ├── assets/        # Recursos estáticos (imágenes, iconos)
│   ├── App.jsx        # Componente principal
│   └── main.jsx       # Punto de entrada
└── public/            # Archivos públicos
```

## Características

- Catálogo de productos con imágenes
- Vista de detalles de cada producto
- Navegación sin recarga de página
- Lazy loading de componentes
- Diseño responsive
- Manejo de estados de carga y error

## Tecnologías

- React 19.2.0
- Vite 7.2.5 (rolldown-vite)
- ESLint 9.39.2
- Prettier 3.8.1

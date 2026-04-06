# 🐾 Paw Store

Aplicación e-commerce full-stack para la venta de productos para mascotas. Frontend SPA construido con React 19 + Vite, backend REST API con Flask y base de datos PostgreSQL.

---

## Características Principales

- **Autenticación JWT** — Registro e inicio de sesión con tokens almacenados en `localStorage`
- **Control de acceso por roles** — Rutas protegidas para usuarios autenticados y panel exclusivo para administradores
- **Catálogo de productos** — Listado con tarjetas, vista de detalle individual y productos destacados en Home
- **Carrito de compras** — Agregar/eliminar productos, control de cantidades, sincronización con el backend
- **Flujo de checkout completo** — Formulario de datos de facturación, resumen de orden y confirmación de compra
- **Confirmación por email** — Envío de email de confirmación al completar una compra (Flask-Mail)
- **Panel de administración** — CRUD completo de productos en vista de tabla (solo admin)
- **Alertas interactivas** — SweetAlert2 para confirmaciones, errores y estados de carga
- **Manejo de estados** — Loading, error, página no encontrada, mantenimiento y acceso restringido
- **Diseño responsive** — CSS Modules con variables compartidas y SASS
- **Testing** — 17 archivos de tests con Vitest + Testing Library

---

## Tech Stack

| Frontend                   | Backend      |
| -------------------------- | ------------ |
| React 19.2                 | Python Flask |
| Vite (rolldown-vite 7.2.5) | Flask-CORS   |
| React Router 7.13          | Flask-Mail   |
| Zustand 5.0                | SQLAlchemy   |
| React Hook Form 7.71       | PostgreSQL   |
| Formik + Yup               | bcrypt       |
| Axios 1.13                 | PyJWT        |
| CSS Modules + SASS         | —            |
| SweetAlert2                | —            |
| Vitest + Testing Library   | —            |
| ESLint 9 + Prettier 3      | —            |

---

## Manejo de Estados

La aplicación utiliza una estrategia mixta de **React Context** y **Zustand** para el manejo del estado global:

### React Context — `AuthContext`

Maneja el estado de **autenticación** de la aplicación. Envuelve toda la app en `<AuthProvider>`.

- **Estado**: `user`, `token`, `isLogged`, `isAdmin`, `isLoggingOut`, `loginError`, `registerError`
- **Acciones**: `login()`, `registerUser()`, `logout()`, `handleLogout()`
- **Persistencia**: Token JWT almacenado en `localStorage`, decodificado al iniciar para restaurar la sesión
- **Hook**: `useAuth()` para acceder al contexto desde cualquier componente

### React Context — `CartContext`

Maneja el estado del **carrito de compras**. Envuelve toda la app en `<CartProvider>`.

- **Estado**: `cartId`, `cartItems[]`, `checkoutProccess`, `screenError`, `actionError`, loading flags (`initializingCart`, `addingItemId`, `removingItemId`, `syncingCart`, `clearingCart`)
- **Acciones**: `initializeCart()`, `addToCart()`, `removeFromCart()`, `increaseQuantity()`, `decreaseQuantity()`, `syncCart()`, `clearCart()`
- **Sincronización**: El carrito se sincroniza con el backend antes del checkout mediante `syncCart()`
- **Validación**: `fetchItems()` cruza los items contra `useProductsStore` para mostrar solo productos con stock disponible
- **Hook**: `useCart()` para acceder al contexto desde cualquier componente

```jsx
// main.jsx — Providers envuelven toda la app
<AuthProvider>
  <CartProvider>
    <RouterProvider router={router} />
  </CartProvider>
</AuthProvider>
```

### Zustand — `useProductsStore`

Store global para el **catálogo de productos**. Accesible desde cualquier componente sin necesidad de providers.

- **Estado**: `products[]`, `mostPurchasedProducts[]`, `loading` (flags por operación), `error` (screen / action)
- **Acciones**: `fetchProducts()`, `fetchMostPurchased()`, `addProduct()`, `updateProduct()`, `deleteProduct()`
- **Patrón**: Cada acción maneja su propio estado de `loading` y `error` de forma independiente
- **Validación**: `fetchMostPurchased()` filtra los productos destacados contra el catálogo real para evitar mostrar productos eliminados

### Zustand — `usePurchaseStore`

Store global para el **flujo de checkout**. Maneja las operaciones de compra una vez que se sale del carrito.

- **Estado**: `checkout` (order, checkoutData), `loading` (creatingOrder, creatingCheckoutData, completingPurchase, confirmingOrder), `error` (action)
- **Acciones**: `createOrder(cartId, currentItems)`, `createCheckoutData(payload)`, `completePurchase(cartId, currentItems)`, `confirmOrder(cartId)`, `clearCheckout()`
- **Patrón**: Recibe `cartId` y `currentItems` como parámetros desde `CartContext` en vez de manejar estado interno del carrito

### ¿Por qué esta separación?

| Aspecto     | React Context                                                | Zustand                                            |
| ----------- | ------------------------------------------------------------ | -------------------------------------------------- |
| Uso         | Autenticación y carrito de compras                           | Catálogo de productos y flujo de checkout          |
| Re-renders  | Todos los consumidores se re-renderizan                      | Solo los componentes que leen el estado modificado |
| Provider    | Requiere `<AuthProvider>` y `<CartProvider>` en el árbol     | No requiere provider, acceso directo al store      |
| Complejidad | Media (auth simple, carrito con múltiples operaciones async) | Media (catálogo CRUD, checkout secuencial)         |

---

## Estructura del Proyecto

```
paw-store/
├── src/
│   ├── api/
│   │   └── axios.js                  # Instancia Axios con interceptor JWT
│   ├── assets/                        # Iconos SVG
│   ├── components/
│   │   ├── Forms/
│   │   │   ├── LoginForm.jsx          # Formulario de login
│   │   │   ├── RegisterForm.jsx       # Formulario de registro
│   │   │   ├── AddProductForm.jsx     # Formulario agregar producto (admin)
│   │   │   ├── EditProductForm.jsx    # Formulario editar producto (admin)
│   │   │   ├── PurchaseInfoForm.jsx   # Formulario de checkout
│   │   │   ├── FormsComponents.jsx    # Componentes reutilizables de formulario
│   │   │   └── __tests__/
│   │   ├── Messages-States/
│   │   │   ├── Alerts.jsx             # Wrappers de SweetAlert2
│   │   │   ├── Loading.jsx            # Spinner de carga
│   │   │   ├── Error.jsx              # Páginas y mensajes de error
│   │   │   ├── Maintenance.jsx        # Página en mantenimiento
│   │   │   ├── PageNotFound.jsx       # Página 404
│   │   │   ├── PurchaseSuccess.jsx    # Mensaje de compra exitosa
│   │   │   └── Restricted.jsx         # Páginas de acceso restringido
│   │   ├── Products/
│   │   │   ├── ProductCard.jsx        # Tarjeta de producto
│   │   │   └── NoProductsMessage.jsx  # Mensaje sin productos
│   │   ├── PurchaseFlow/
│   │   │   ├── ItemCart.jsx           # Item del carrito con controles
│   │   │   ├── ContinueCard.jsx       # Tarjeta de total y continuar
│   │   │   ├── PurchaseSummary.jsx    # Resumen de compra (tabla)
│   │   │   └── __tests__/
│   │   ├── Static/
│   │   │   ├── Navbar.jsx             # Barra de navegación
│   │   │   ├── Footer.jsx             # Pie de página
│   │   │   └── __tests__/
│   │   └── Table/
│   │       ├── AdminProductsTable.jsx # Tabla de productos (admin)
│   │       ├── Head.jsx               # Encabezado de tabla
│   │       └── Body.jsx               # Cuerpo de tabla
│   ├── pages/
│   │   ├── Home.jsx                   # Página de inicio con destacados
│   │   ├── Products.jsx               # Catálogo de productos
│   │   ├── ProductDetails.jsx         # Detalle de un producto
│   │   ├── Administration.jsx         # Panel de administración
│   │   ├── BuyingProcess/
│   │   │   ├── ShoppingCart.jsx       # Carrito de compras
│   │   │   └── PurchaseFinished.jsx   # Compra finalizada
│   │   └── __tests__/
│   ├── routes/
│   │   ├── router.jsx                 # Configuración de rutas
│   │   └── protected.jsx              # Wrapper de rutas protegidas
│   ├── store/
│   │   ├── AuthContext.jsx            # Context de autenticación
│   │   ├── CartContext.jsx            # Context del carrito de compras
│   │   ├── useProductsStore.jsx       # Zustand store de productos
│   │   ├── usePurchaseStore.jsx       # Zustand store de checkout
│   │   └── __tests__/
│   ├── utils/
│   │   ├── helpers.js                 # Funciones de cálculo de precios
│   │   └── __tests__/
│   ├── App.jsx                        # Layout principal (Navbar + Outlet + Footer)
│   ├── main.jsx                       # Punto de entrada
│   └── index.css                      # Estilos globales
├── services/                          # Backend Flask
│   ├── app.py                         # Entry point del servidor
│   ├── extensions.py                  # Extensiones Flask (Mail)
│   ├── auth/
│   │   ├── auth.py                    # Decoradores require_auth / require_role
│   │   └── jwt_manager.py            # Clase JWTManager (encode/decode)
│   ├── db/
│   │   └── db.py                      # SQLAlchemy engine, tablas y esquema
│   ├── repositories/
│   │   ├── users_repo.py             # Repositorio de usuarios
│   │   ├── products_repo.py          # Repositorio de productos
│   │   └── purchase_flow_repo.py     # Repositorio de carrito y órdenes
│   └── routes/
│       ├── users_route.py            # Endpoints de auth (/login, /register)
│       ├── products_route.py         # Endpoints de productos
│       └── purchase_flow_route.py    # Endpoints de carrito y checkout
└── public/
    └── 1084899.svg                    # Favicon
```

---

## Instalación y Uso

### Requisitos Previos

- **Node.js** 16 o superior + npm
- **Python** 3.10 o superior
- **PostgreSQL** (servidor corriendo en `localhost:5432`)

### Frontend

```bash
cd React/paw-store
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

### Backend

```bash
cd React/paw-store/services

# Instalar dependencias de Python
pip install flask flask-cors flask-mail sqlalchemy psycopg2-binary bcrypt pyjwt

# Iniciar el servidor
python app.py
```

La API estará disponible en `http://localhost:5000`.

> **Nota:** El esquema `paw_store` en PostgreSQL se crea automáticamente al iniciar el servidor gracias a SQLAlchemy.

---

## Scripts Disponibles

| Script   | Comando            | Descripción                               |
| -------- | ------------------ | ----------------------------------------- |
| Dev      | `npm run dev`      | Inicia el servidor de desarrollo con Vite |
| Build    | `npm run build`    | Genera el build de producción             |
| Preview  | `npm run preview`  | Previsualiza el build de producción       |
| Lint     | `npm run lint`     | Ejecuta ESLint en el proyecto             |
| Lint Fix | `npm run lint:fix` | Corrige errores de ESLint automáticamente |
| Format   | `npm run format`   | Formatea con Prettier y corrige lint      |
| Test     | `npm run test`     | Ejecuta los tests con Vitest              |
| Test UI  | `npm run test:ui`  | Abre la interfaz visual de Vitest         |
| Test Run | `npm run test:run` | Ejecuta los tests una sola vez            |

---

## API Endpoints

### Autenticación

| Método | Ruta        | Descripción                  |
| ------ | ----------- | ---------------------------- |
| POST   | `/register` | Registrar nuevo usuario      |
| POST   | `/login`    | Iniciar sesión (retorna JWT) |

### Productos

| Método | Ruta                       | Acceso | Descripción                |
| ------ | -------------------------- | ------ | -------------------------- |
| GET    | `/products`                | Auth   | Listar todos los productos |
| GET    | `/most_purchased_products` | Auth   | Productos más vendidos     |
| POST   | `/products`                | Admin  | Crear producto             |
| PUT    | `/products/update/:id`     | Admin  | Actualizar producto        |
| DELETE | `/products/:id`            | Admin  | Eliminar producto          |

### Carrito y Checkout

| Método | Ruta                       | Descripción                        |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/cart`                    | Crear carrito                      |
| GET    | `/cart`                    | Obtener carrito activo             |
| GET    | `/cart/:id/products`       | Obtener productos del carrito      |
| POST   | `/cart/add`                | Agregar producto al carrito        |
| DELETE | `/cart/remove/:product_id` | Eliminar producto del carrito      |
| PUT    | `/cart/sync`               | Sincronizar cantidades del carrito |
| POST   | `/order`                   | Crear orden desde el carrito       |
| POST   | `/checkout`                | Guardar datos de facturación       |
| PUT    | `/complete-purchase`       | Completar compra (reduce stock)    |
| POST   | `/confirm-order`           | Enviar email de confirmación       |

---

## Rutas del Frontend

| Ruta                         | Acceso  | Página                                   |
| ---------------------------- | ------- | ---------------------------------------- |
| `/`                          | Pública | Home — Bienvenida y productos destacados |
| `/login`                     | Pública | Formulario de inicio de sesión           |
| `/register`                  | Pública | Formulario de registro                   |
| `/contact`                   | Pública | Página en mantenimiento                  |
| `/products`                  | Auth    | Catálogo de productos                    |
| `/products/:id`              | Auth    | Detalle de un producto                   |
| `/cart`                      | Auth    | Carrito de compras                       |
| `/checkout`                  | Auth    | Formulario de datos de compra            |
| `/purchase-finished`         | Auth    | Confirmación de compra exitosa           |
| `/admin/products`            | Admin   | Panel de administración de productos     |
| `/admin/products/edit/:id`   | Admin   | Edición de producto                      |
| `/no-access/unauthenticated` | Pública | Acceso denegado (no logueado)            |
| `/no-access/unauthorized`    | Pública | Acceso denegado (no admin)               |

---

## Testing

El proyecto cuenta con **17 archivos de tests** usando **Vitest**, **@testing-library/react** y **jsdom**.

```bash
npm run test:run    # Ejecuta todos los tests una vez
npm run test:ui     # Abre la interfaz visual de Vitest
```

### Cobertura de tests

| Área            | Archivos testeados                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| **Stores**      | `AuthContext`, `useProductsStore`, `usePurchaseStore`                                                    |
| **Páginas**     | `Home`, `Products`, `ProductDetails`, `Administration`, `ShoppingCart`, `PurchaseFinished`               |
| **Componentes** | `Navbar`, `LoginForm`, `RegisterForm`, `PurchaseInfoForm`, `ItemCart`, `ContinueCard`, `PurchaseSummary` |
| **Utilidades**  | `helpers` (cálculos de precios)                                                                          |

---

## Base de Datos

El backend utiliza **PostgreSQL** con las siguientes tablas bajo el esquema `paw_store`:

| Tabla            | Descripción                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `users`          | Usuarios (id, full_name, email, password, role)                                  |
| `products`       | Productos (id, name, description, price, category, stock, image_url)             |
| `shopping_cart`  | Carritos de compra (id, user_id, status)                                         |
| `cart_products`  | Productos en carrito (cart_id, product_id, quantity)                             |
| `orders`         | Órdenes (id, cart_id, total_price, created_at, status)                           |
| `order_products` | Productos en orden (order_id, product_id, quantity, price_at_purchase)           |
| `billing_info`   | Datos de facturación (user_id, full_name, email, shipping_address, phone_number) |
| `order_info`     | Relación orden-facturación (order_id, billing_info_id)                           |

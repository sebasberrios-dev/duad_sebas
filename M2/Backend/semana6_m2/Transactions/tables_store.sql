--SQLite
--Crea tablas de usuarios, productos y facturas
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER 
);

CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT REFERENCES users(id) NOT NULL,
    product_id REFERENCES products(id) NOT NULL,
    total REAL NOT NULL,
    status VARCHAR(10) NOT NULL 
);
--Inserta datos de ejemplo
INSERT INTO users (full_name, email) 
VALUES ('Sebastian Berrios', 'berriossebas@email.com');

INSERT INTO products (name, price, quantity)
VALUES ('Teclado OMEN', 35000, 2);

--Inicia la transacción
BEGIN TRANSACTION;

--Compra de un producto
--1. Validar que existe stock del producto
IF EXISTS (
    SELECT 1 
    FROM products 
    WHERE id == 1 AND quantity > 0
    ) THEN RETURN;
END IF;

--2. Validar que el usuario existe
IF EXISTS (
    SELECT 1 
    FROM users 
    WHERE id == 1) 
    THEN RETURN;
END IF;

--3. Crear la factura con el usuario relacionado
INSERT INTO invoices (user_id, product_id, total, status) 
VALUES (1, 1, 35000, 'pending');
--4. Reducir el stock del producto
UPDATE products
SET quantity = quantity - 1
WHERE products.id == 1;

SAVEPOINT invoice_created;

--Retorno de un producto
--1. Validar que la factura existe en la DB
IF EXISTS (
    SELECT 1 
    FROM invoices 
    WHERE id == 1) 
    THEN ROLLBACK TO invoice_created; 
RETURN;
END IF;
--2. Aumentar el stock del producto en la cantidad que se compró
UPDATE products
SET quantity = quantity + 1
WHERE products.id == 1;
--3. Actualizar la factura y marcarla como retornada.
UPDATE invoices 
SET status TO 'returned'
WHERE invoices.id == 1;

COMMIT;
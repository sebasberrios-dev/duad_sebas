-- SQLite
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INT NOT NULL,
    date_added CHAR NOT NULL DEFAULT (datetime('now')),
    brand CHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date CHAR NOT NULL DEFAULT (datetime('now')),
    email VARCHAR(25) NOT NULL, 
    total INT NOT NULL
);

CREATE TABLE IF NOT EXISTS invoice_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INT REFERENCES invoices(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    amount INT NOT NULL
);

CREATE TABLE IF NOT EXISTS shopping_cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    costumer_email VARCHAR(25) REFERENCES invoices(email),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL
);


INSERT INTO products (name, price, date_added, brand) VALUES
('Teclado', 30000,'27/5/2025','OMEN'),
('Monitor', 200000,'23/5/2025', 'MSI'),
('Audífonos', 25000,'24/5/2025', 'SONY');

INSERT INTO invoices (date, email, total) VALUES
('15/7/2025', 'sberrios@gmail.com', 230000),
('14/7/2025', 'fjimenez@gmail.com', 55000),
('16/7/2025', 'gramirez@gmail.com', 425000);

INSERT INTO invoice_products (invoice_id, product_id, quantity, amount) VALUES
(1, 1, 1, 30000),
(1, 2, 1, 200000),
(2, 1, 1, 30000),
(2, 3, 1, 25000),
(3, 2, 2, 400000),
(3, 3, 1, 25000);


INSERT INTO shopping_cart (costumer_email, product_id, quantity) VALUES
('sberrios@gmail.com', 1 , 1),
('sberrios@gmail.com', 2 , 1),
('fjimenez@gmail.com', 3 , 1),
('fjimenez@gmail.com', 1 , 1),
('gramirez@gmail.com', 2 , 2),
('gramirez@gmail.com', 3 , 1);

-- No se puede agregar una columna con valor unique, por lo que el numero de telefono no puede ser unique
-- y se agrega un valor por defecto de 00000000 
ALTER TABLE invoices
    ADD phone_number VARCHAR(8) NOT NULL DEFAULT '00000000';
ALTER TABLE invoices
    ADD employee_id INT;

SELECT name FROM products;
SELECT name FROM products WHERE price > 50000;
SELECT id FROM invoice_products WHERE product_id = 1;
SELECT product_id, SUM(amount) FROM invoice_products GROUP BY product_id;
SELECT * FROM invoices WHERE email = 'sberrios@gmail.com';
SELECT * FROM invoices ORDER BY total DESC;
SELECT * FROM invoices WHERE id = 1;




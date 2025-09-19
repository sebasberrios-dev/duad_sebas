-- SQLite
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(25) NOT NULL);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(30) NOT NULL,
    author_id INT REFERENCES authors(id)
    );

CREATE TABLE IF NOT EXISTS costumers(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS rents(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INT REFERENCES books(id),
    costumer_id INT REFERENCES costumers(id),
    state CHAR(8) NOT NULL DEFAULT 'ON TIME');

/* INSERT INTO authors (name) VALUES 
('Miguel de Cervantes'), 
('Dante Alighieri'), 
('Takehiko Inoue'), 
('Akira Toriyama'), 
('Walt Disney');

INSERT INTO books(title, author_id) VALUES 
('Don Quijote', 1),
('La Divina Comedia', 2),
('Vagabond 1,3', 3),
('Dragon Ball 1', 4),
('The Book of the 5 Rings', NULL);

INSERT INTO costumers (name, email) VALUES
('John Doe', 'j.doe@email.com'),
('Jane Doe', 'jane@doe.com'),
('Luke Skywalker', 'darth.son@email.com');

INSERT INTO rents (book_id, costumer_id, state) VALUES
(1, 2, 'Returned'),
(2, 2, 'Returned'),
(1, 1, 'On time'),
(3, 1, 'On time'),
(2, 2, 'Overdue'); */

SELECT b.title, a.name
FROM books AS b
INNER JOIN authors AS a ON b.author_id = a.id;

SELECT b.title
FROM books AS b
LEFT JOIN authors AS a ON b.author_id = a.id 
WHERE a.name IS NULL;

SELECT a.name
FROM authors AS a
LEFT JOIN books AS b ON a.id = b.author_id  
WHERE b.id IS NULL;

/* Se cuenta cuantas veces se rentaron los libros con la función de agregación COUNT() */
SELECT b.title, COUNT(r.id) AS total_rentas
FROM books AS b
INNER JOIN rents AS r ON b.id = r.book_id
GROUP BY b.title;


SELECT b.title
FROM books AS b
LEFT JOIN rents AS r ON b.id = r.book_id
WHERE r.id IS NULL;

SELECT c.name
FROM costumers AS c
LEFT JOIN rents AS r ON c.id = r.costumer_id
WHERE r.id IS NULL;

SELECT b.title 
FROM books AS b
INNER JOIN rents AS r ON b.id = r.book_id
WHERE r.state = 'Overdue';


-- Active: 1689025397536@@127.0.0.1@3306

-- create users table

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

-- insert users

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'Fulana',
        'fulana@email.com',
        'fulana123',
        dateTime ('now')
    ), (
        'u002',
        'Ciclano',
        'ciclano@email.com',
        'ciclano123',
        dateTime ('now')
    ), (
        'u003',
        'Beltrana',
        'beltrana@email.com',
        'beltrana123',
        dateTime ('now')
    );

-- creat products table

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

-- Insert product

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod001',
        'Mouse gamer',
        250,
        'Melhor mouse do mercado!',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod002',
        'Monitor',
        900,
        'Monitor LED Full HD 24 polegadas',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod003',
        'Fone de ouvido',
        50,
        'Fone sem fio com microfone',
        'https://picsum.photos/seed/Fone%20deouvido/400'
    ), (
        'prod004',
        'Mesa digitalizadora',
        500,
        'Mesa digitalizadora ideal para designers e artistas digitais',
        'https://picsum.photos/seed/Mesa%20digitalizadora/400'
    ), (
        'prod005',
        'Kindle',
        340,
        'Kindle para estimular a leitura em qualquer lugar',
        'https://picsum.photos/seed/Kindle%20/400'
    );

-- get all users

SELECT * FROM users;

-- get all products

SELECT * FROM products;

-- get all products with word "gamer"

SELECT * FROM products WHERE name LIKE '%gamer%';

-- create user

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u004',
        'Astrodev',
        'astrodev@email.com',
        'astrodev123',
        dateTime ('now')
    );

-- create product

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'prod006',
        'Caixa de som',
        600,
        'Som em alta qualidade',
        'https://picsum.photos/seed/Caixa%20desom/400'
    );

-- delete user by id

DELETE FROM users WHERE id = 'u004';

-- delete product by id

DELETE FROM products WHERE id = 'prod006';

-- edit product by id

UPDATE products
SET
    name = 'Kindle 2',
    price = 380,
    description = 'Kindle 2. Nova versão para estimular a leitura em qualquer lugar',
    image_url = 'https://picsum.photos/seed/Kindle%20novo/400'
WHERE id = 'prod005';

-- create purchase table
CREATE TABLE purchases (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	buyer TEXT NOT NULL,
	total_price REAL NOT NULL,
	created_at TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

-- insert product in purchases
INSERT INTO purchases (id, buyer, total_price, created_at)
VALUES ('pc001', 'u001', 650, dateTime ('now')),
('pc002', 'u002', 820, dateTime ('now'));

-- edit item form purschases
UPDATE purchases
SET total_price = 780
WHERE id = 'pc002'; 

-- get user purchase
SELECT 
    purchases.id AS purchase_id,
    users.id AS buyer_id,
    users.name AS buyer_name,
    users.email,
    purchases.total_price,
    purchases.created_at
FROM purchases
INNER JOIN users
ON users.id = purchases.buyer;
-- Active: 1689025397536@@127.0.0.1@3306
CREATE TABLE users (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
    created_at TEXT NOT NULL
);
INSERT INTO users (id, name, email, password, created_at)
VALUES
  ('u001', 'Fulana', 'fulana@email.com', 'fulana123', dateTime ('now')),
  ('u002', 'Ciclano', 'ciclano@email.com', 'ciclano123', dateTime ('now')),
  ('u003', 'Beltrana', 'beltrana@email.com', 'beltrana123', dateTime ('now'));

CREATE TABLE products (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	name TEXT NOT NULL,
	price REAL NOT NULL,
	description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

INSERT INTO products (id, name, price, description, image_url)
VALUES
  ('prod001', 'Mouse gamer', 250, 'Melhor mouse do mercado!', 'https://picsum.photos/seed/Mouse%20gamer/400'),
  ('prod002', 'Monitor', 900, 'Monitor LED Full HD 24 polegadas', 'https://picsum.photos/seed/Monitor/400'),
  ('prod003', 'Fone de ouvido', 50, 'Fone sem fio com microfone', 'https://picsum.photos/seed/Fone%20deouvido/400'),
  ('prod004', 'Mesa digitalizadora', 500, 'Mesa digitalizadora ideal para designers e artistas digitais', 'https://picsum.photos/seed/Mesa%20digitalizadora/400'),
  ('prod005', 'Kindle', 340, 'Kindle para estimular a leitura em qualquer lugar', 'https://picsum.photos/seed/Kindle%20/400');

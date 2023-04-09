BEGIN TRANSACTION;
CREATE TABLE user (
  id SMALLINT UNSIGNED PRIMARY KEY NOT NULL,
  name VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  uf CHAR(2) NOT NULL,
  password VARCHAR(250) NOT NULL
);
INSERT INTO user VALUES 
(1, 'Admin', 'a@a', 'SP', 'SENHA_TEMPORARIA');

CREATE TABLE uf (
  id CHAR(2) PRIMARY KEY NOT NULL,
  name CHAR(255) NOT NULL
);
INSERT INTO uf VALUES 
('SP', 'São Paulo'),
('RJ', 'Rio de Janeiro'),
('MG', 'Minas Gerais');

CREATE TABLE categoria (
  id SMALLINT UNSIGNED PRIMARY KEY NOT NULL,
  description VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  image VARCHAR(1024) NOT NULL
);
INSERT INTO categoria VALUES 
(1, 'Bebês', 'bebes', 'http://localhost:3001/images/bebes.gif'),
(2, 'Carros', 'carros', 'http://localhost:3001/images/carros.gif'),
(3, 'Roupas', 'roupas', 'http://localhost:3001/images/roupas.gif'),
(4, 'Eletrônicos', 'eletronicos', 'http://localhost:3001/images/eletronicos.gif');

CREATE TABLE ad (
  id SMALLINT UNSIGNED PRIMARY KEY NOT NULL,
  user_id SMALLINT UNSIGNED NOT NULL,
  categoria_id SMALLINT UNSIGNED NOT NULL,
  title VARCHAR(100) NOT NULL,
  price FLOAT UNSIGNED DEFAULT 0,
  priceNegotiable TINYINT DEFAULT 0,
  date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  views SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  description TEXT,
  CONSTRAINT fk_ad_user FOREIGN KEY (user_id) REFERENCES user (id),
  CONSTRAINT fk_ad_categoria FOREIGN KEY (categoria_id) REFERENCES categoria (id)
);
INSERT INTO ad (id, user_id, categoria_id, title, price, priceNegotiable, description) VALUES 
(1, 1, 4, 'Notebook Acer 18''', 1599, 1, 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W'),
(2, 1, 4, 'Notebook Acer 17''', 1599, 0, 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W'),
(3, 1, 4, 'Notebook Acer 20''', 1599, 0, 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W');

CREATE TABLE ad_image (
  ad_id SMALLINT REFERENCES ad (id),
  image VARCHAR(1024) NOT NULL
);
INSERT INTO ad_image VALUES 
(1, 'http://localhost:3001/images/ads/notebook-1.gif'),
(1, 'http://localhost:3001/images/ads/notebook-2.gif'),
(2, 'http://localhost:3001/images/ads/notebook-2.gif'),
(2, 'http://localhost:3001/images/ads/notebook-1.gif'),
(3, 'http://localhost:3001/images/ads/notebook-1.gif');
COMMIT;
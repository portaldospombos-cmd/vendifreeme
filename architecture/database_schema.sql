-- Database Schema for Classifieds Platform (OLX-style)
-- Compatible with PostgreSQL and MySQL

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_registo TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    categoria_pai_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Table: anuncios (listings)
CREATE TABLE IF NOT EXISTS anuncios (
    id SERIAL PRIMARY KEY,
    utilizador_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    categoria_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(12, 2) NOT NULL,
    localizacao VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'vendido', 'expirado')),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX idx_anuncios_titulo ON anuncios(titulo);
CREATE INDEX idx_anuncios_preco ON anuncios(preco);
CREATE INDEX idx_anuncios_localizacao ON anuncios(localizacao);

-- 4. Table: imagens
CREATE TABLE IF NOT EXISTS imagens (
    id SERIAL PRIMARY KEY,
    anuncio_id INTEGER REFERENCES anuncios(id) ON DELETE CASCADE,
    url_imagem VARCHAR(255) NOT NULL,
    e_principal BOOLEAN DEFAULT FALSE
);

-- 5. Table: mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id SERIAL PRIMARY KEY,
    anuncio_id INTEGER REFERENCES anuncios(id) ON DELETE CASCADE,
    remetente_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    destinatario_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (Exemplos)
-- ==========================================

-- Users
INSERT INTO users (nome, email, password_hash, telefone) VALUES
('João Silva', 'joao@email.com', 'hash123', '912345678'),
('Maria Santos', 'maria@email.com', 'hash456', '987654321');

-- Categories (Main and Sub)
INSERT INTO categories (nome, slug, categoria_pai_id) VALUES
('Imobiliário', 'imobiliario', NULL),
('Tecnologia', 'tecnologia', NULL),
('Apartamentos', 'apartamentos', 1),
('Smartphones', 'smartphones', 2);

-- Listings
INSERT INTO anuncios (utilizador_id, categoria_id, titulo, descricao, preco, localizacao, status) VALUES
(1, 3, 'T2 Moderno em Lisboa', 'Apartamento totalmente remodelado no centro da cidade.', 350000.00, 'Lisboa', 'ativo'),
(2, 4, 'iPhone 15 Pro Max', 'Como novo, com fatura e garantia.', 1100.00, 'Porto', 'ativo');

-- Images
INSERT INTO imagens (anuncio_id, url_imagem, e_principal) VALUES
(1, 'https://exemplo.com/casa1.jpg', TRUE),
(1, 'https://exemplo.com/casa1_int.jpg', FALSE),
(2, 'https://exemplo.com/iphone.jpg', TRUE);

-- Messages
INSERT INTO mensagens (anuncio_id, remetente_id, destinatario_id, conteudo) VALUES
(1, 2, 1, 'Ainda está disponível? Tenho interesse em visitar.');

-- ==========================================
-- EXAMPLE QUERY
-- Filtrar por categoria, intervalo de preço e cidade
-- ==========================================
/*
SELECT a.*, c.nome as categoria_nome
FROM anuncios a
JOIN categories c ON a.categoria_id = c.id
WHERE c.slug = 'apartamentos'
  AND a.preco BETWEEN 100000 AND 500000
  AND a.localizacao ILIKE '%Lisboa%'
  AND a.status = 'ativo'
ORDER BY a.data_criacao DESC;
*/

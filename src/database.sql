-- Database schema for events review system

CREATE DATABASE IF NOT EXISTS eventos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eventos_db;

-- Production events table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    local VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    link VARCHAR(255),
    dia DATE,
    hora TIME,
    genero VARCHAR(150),
    detalhes TEXT,
    artista VARCHAR(150),
    entrada VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Raw events table for curation
CREATE TABLE IF NOT EXISTS events_raw (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    local VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    bairro VARCHAR(100),
    link VARCHAR(255),
    dia DATE NOT NULL,
    hora TIME,
    genero VARCHAR(150),
    detalhes TEXT,
    artista VARCHAR(150),
    entrada VARCHAR(50),
    raw_json JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    status ENUM('PENDING','REVIEWED','REJECTED') DEFAULT 'PENDING',
    review_user VARCHAR(100),
    reviewed_at TIMESTAMP NULL
);

-- Sample data for testing
INSERT INTO events_raw (local, endereco, bairro, link, dia, hora, genero, detalhes, artista, entrada, raw_json) VALUES
('Teatro Municipal', 'Av. Paulista, 1000', 'Centro', 'https://teatro.com.br', '2023-12-15', '20:00:00', 'Teatro', 'Peça clássica brasileira', 'Companhia Teatral XYZ', 'R$ 50,00', '{"source": "site", "import_date": "2023-11-01"}'),
('Arena Concert Hall', 'Rua das Flores, 500', 'Jardins', 'https://arena.com.br', '2023-12-20', '21:30:00', 'Rock', 'Show da banda famosa', 'Banda Rockstars', 'R$ 80,00', '{"source": "app", "import_date": "2023-11-05"}');
CREATE DATABASE db_oauth;
USE db_oauth;

CREATE TABLE users(
	id INT PRIMARY KEY AUTO_INCREMENT,
    username varchar(255),
    password varchar(255),
    rol varchar(1)
);

CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accessToken VARCHAR(255) NOT NULL UNIQUE,
    accessTokenExpiresAt DATETIME NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE clients (
    id VARCHAR(255) PRIMARY KEY,
    clientSecret VARCHAR(255) NOT NULL,
    grants VARCHAR(255) NOT NULL 
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagenProducto VARCHAR(255),
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clients (id, clientSecret, grants)
VALUES ('client1', 'secret1', 'password');
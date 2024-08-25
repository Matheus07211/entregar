CREATE DATABASE sistema;

USE sistema;

CREATE TABLE autor(
    aut_codigo INT NOT NULL AUTO_INCREMENT,
    aut_nome VARCHAR(100) NOT NULL,
    CONSTRAINT pk_categoria PRIMARY KEY(aut_codigo)
);

CREATE TABLE livro(
    liv_codigo INT NOT NULL AUTO_INCREMENT,
    liv_descricao VARCHAR(100) NOT NULL,
    liv_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
    liv_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    aut_codigo INT NOT NULL,
    CONSTRAINT pk_livro PRIMARY KEY(liv_codigo),
    CONSTRAINT fk_autor FOREIGN KEY(aut_codigo) REFERENCES autor(aut_codigo)
);
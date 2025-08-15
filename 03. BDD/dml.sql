-- Tabla de Ciudades
CREATE TABLE IF NOT EXISTS ciudades (
    id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
    codigo_ciudad VARCHAR(3) NOT NULL UNIQUE,
    nombre_ciudad VARCHAR(100) NOT NULL
);

-- Tabla de Vuelos
CREATE TABLE IF NOT EXISTS vuelos (
    id_vuelo INT AUTO_INCREMENT PRIMARY KEY,
    codigo_vuelo VARCHAR(10) NOT NULL UNIQUE,
    id_ciudad_origen INT NOT NULL,
    id_ciudad_destino INT NOT NULL,
    valor DECIMAL(7,2) NOT NULL,
    hora_salida DATETIME NOT NULL,
    capacidad INT NOT NULL,
    disponibles INT NOT NULL,
    FOREIGN KEY (id_ciudad_origen) REFERENCES ciudades(id_ciudad),
    FOREIGN KEY (id_ciudad_destino) REFERENCES ciudades(id_ciudad)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    username VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    telefono VARCHAR(15),
    cedula VARCHAR(20) NOT NULL DEFAULT '0000000000',
    correo VARCHAR(150) NOT NULL DEFAULT 'sincorreo@correo.com'
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(20) NOT NULL UNIQUE,
    id_usuario INT NOT NULL,
    precio_sin_iva DECIMAL(10,2) NOT NULL,
    precio_con_iva DECIMAL(10,2) NOT NULL,
    fecha_factura DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla de Asientos
CREATE TABLE IF NOT EXISTS asientos (
    id_asiento INT AUTO_INCREMENT PRIMARY KEY,
    id_vuelo INT NOT NULL,
    numero_asiento INT NOT NULL, -- del 1 al 100
    estado ENUM('DISPONIBLE', 'OCUPADO') DEFAULT 'DISPONIBLE',
    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id_vuelo) ON DELETE CASCADE,
    UNIQUE (id_vuelo, numero_asiento) -- no repetir número en el mismo vuelo
);

-- Tabla de Boletos
CREATE TABLE IF NOT EXISTS boletos (
    id_boleto INT AUTO_INCREMENT PRIMARY KEY,
    numero_boleto VARCHAR(20) NOT NULL UNIQUE,
    id_vuelo INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_compra DECIMAL(7,2) NOT NULL,
    id_asiento INT NULL,
    nombre_propietario VARCHAR(100) NOT NULL DEFAULT '',
    cedula_propietario VARCHAR(20) NOT NULL DEFAULT '0000000000',
    id_factura INT NULL,
    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id_vuelo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura),
    FOREIGN KEY (id_asiento) REFERENCES asientos(id_asiento)
);

-- Tabla de Amortización de Boletos
CREATE TABLE IF NOT EXISTS amortizacion_boletos (
    id_amortizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_factura INT NOT NULL,
    numero_cuota INT NOT NULL,
    valor_cuota DECIMAL(10,2),
    interes_pagado DECIMAL(10,2),
    capital_pagado DECIMAL(10,2),
    saldo DECIMAL(10,2),
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
);

-- Tabla de Escalas
CREATE TABLE IF NOT EXISTS escalas (
    id_escala INT AUTO_INCREMENT PRIMARY KEY,
    id_vuelo INT NOT NULL,
    id_ciudad INT NOT NULL,
    orden_escala INT NOT NULL, -- Para determinar el orden de las escalas

    FOREIGN KEY (id_vuelo) REFERENCES vuelos(id_vuelo) ON DELETE CASCADE,
    FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad) ON DELETE CASCADE,
    
    UNIQUE (id_vuelo, orden_escala) -- Una misma escala no puede repetirse en el mismo orden para el mismo vuelo
);
create database inventario;
use inventario;

create table productos(
	id_producto int auto_increment primary key,
    nombre varchar(100) not null unique,
    cantidad int default 0,
    activo boolean not null default true
);


INSERT INTO productos (nombre) VALUES
('Laptop Gamer RGB X1'),
('Teclado Mecánico HyperX'),
('Mouse Óptico Logitech G502'),
('Monitor Curvo Samsung 27"');

INSERT INTO productos (nombre, activo) VALUES
('Webcam 1080p Genérica', FALSE),
('Tablet Fire 7', FALSE); 


create table usuarios(
	id_usuario int auto_increment primary key,
    nombre varchar(100) not null,
    correo varchar(100) not null unique,
    password_hash varchar(255) not null,
    rol enum('administrador','almacenista'),
    estatus enum('activo','inactivo')
);
INSERT INTO usuarios (nombre, correo, password_hash, rol, estatus) VALUES
('Antonio Perez', 'antonio.perez@empresa.com', SHA2('admin123', 256), 'administrador', 'activo');
INSERT INTO usuarios (nombre, correo, password_hash, rol, estatus) VALUES
('Maria Garcia', 'maria.garcia@empresa.com', SHA2('almacen123', 256), 'almacenista', 'activo');


create table historial_movimientos(
	id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario int not null,
    id_producto int not null,
    tipo_movimiento enum('entrada','salida'),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (id_usuario) references usuarios(id_usuario),
    foreign key(id_producto) references productos(id_producto)
);
ALTER TABLE historial_movimientos
ADD COLUMN cantidad_movida INT NOT NULL AFTER tipo_movimiento;



 
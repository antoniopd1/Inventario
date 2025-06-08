create database inventario;

use inventario;

create table productos(
	id_producto int  AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(40) not null unique,
    precio DECIMAL(16,2) not null
);


show tables;

create table ventas(
	id_venta int auto_increment primary key,
    cantidad int not null,
    id_producto int not null,
    foreign key (id_producto) references productos(id_producto)
);
INSERT INTO productos (nombre, precio) VALUES
('LAPTOP', 3000.00),
('PC', 4000.00),
('MOUSE', 100.00),
('TECLADO', 150.00),
('MONITOR', 2000.00),
('MICROFONO', 350.00),
('AUDIFONOS', 450.00);

INSERT INTO ventas (id_producto, cantidad) VALUES
(5, 8),
(1, 15),
(6, 13),
(6, 4),
(2, 3),
(5,1),
(4, 5),
(2, 5),
(6, 2),
(1, 8);


SELECT DISTINCT p.id_producto, p.nombre, p.precio
FROM productos p
INNER JOIN ventas v ON p.id_producto = v.id_producto;
    
SELECT p.id_producto, p.nombre, SUM(v.cantidad) AS cantidad_total_vendida 
FROM productos p
INNER JOIN ventas v ON p.id_producto = v.id_producto
GROUP BY p.id_producto, p.nombre;
    
SELECT p.id_producto, p.nombre, COALESCE(SUM(v.cantidad * p.precio), 0.00) AS total_dinero_vendido
FROM productos p
LEFT JOIN ventas v ON p.id_producto = v.id_producto
GROUP BY p.id_producto, p.nombre, p.precio
ORDER BY p.id_producto;


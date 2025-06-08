Documentación del Proyecto de Sistema de Inventario
Este README.md proporciona información esencial para desarrolladores y usuarios sobre cómo configurar y ejecutar el Sistema de Inventario.

IDE Utilizado
El desarrollo de este proyecto se realizó principalmente con:

Visual Studio Code (VS Code)

Se recomienda su uso por la excelente integración con Node.js, React, y extensiones para MySQL, ESLint y Prettier.

Versión del Lenguaje de Programación Utilizado
Node.js: v18.x (o superior)

Se recomienda usar una versión LTS (Long Term Support) para mayor estabilidad.

npm (Node Package Manager): v8.x (o superior)

Generalmente viene incluido con la instalación de Node.js.

DBMS Utilizado y su Versión
Sistema de Gestión de Bases de Datos (DBMS): MySQL

Versión de MySQL: 8.0 (o superior)

Se recomienda utilizar MySQL Workbench o cualquier cliente SQL compatible para la gestión de la base de datos.

Pasos para Correr la Aplicación
Sigue estos pasos para configurar y ejecutar tanto el backend como el frontend de la aplicación.

1. Configuración de la Base de Datos MySQL
Crea una Base de Datos:

Accede a tu servidor MySQL (por ejemplo, a través de MySQL Workbench o la línea de comandos).

Crea una nueva base de datos. Puedes llamarla inventario_db o el nombre que prefieras.

CREATE DATABASE inventario_db;
USE inventario_db;

Crea las Tablas:

Los scripts SQL para la creación de las tablas y inserts  (usuarios, productos, historial_movimientos) se encuentran en la carpeta del proyecto llamada scripts/.

Por favor, ejecuta esos scripts en tu base de datos inventario_db (o el nombre que hayas elegido).

2. Configuración del Backend
Navega al directorio backend:

cd backend

Instala las dependencias:

npm install

Crea el archivo de configuración de entorno:

Crea un archivo llamado .env en la raíz del directorio backend.

Copia el contenido de .env.example y rellénalo con tus credenciales de MySQL y una clave secreta para JWT.

PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_de_mysql
DB_DATABASE=inventario_db
JWT_SECRET=una_clave_secreta_fuerte_y_larga

Asegúrate de que DB_PASSWORD sea tu contraseña real de MySQL y JWT_SECRET sea una cadena aleatoria y compleja.

Inicia el servidor backend:

npm start

Deberías ver un mensaje como Servidor backend corriendo en http://localhost:3001 en tu terminal. Mantén esta terminal abierta.

3. Configuración del Frontend
Navega al directorio mi-app-inventario-frontend:

Abre una nueva terminal.

cd ../mi-app-inventario-frontend

Instala las dependencias:

npm install

Crea el archivo de configuración de entorno:

Crea un archivo llamado .env en la raíz del directorio mi-app-inventario-frontend.

Añade la URL base de tu API.

VITE_API_BASE_URL=http://localhost:3001/api

Inicia la aplicación frontend:

npm run dev

Deberías ver un mensaje indicando que la aplicación se está ejecutando, usualmente en http://localhost:5173/ o similar. Tu navegador se abrirá automáticamente.

Una vez que ambos servidores estén corriendo, la aplicación frontend se conectará al backend, y podrás interactuar con tu sistema de inventario.

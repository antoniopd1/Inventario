
require('dotenv').config();
console.log('DEBUG: app.js - Variables de entorno cargadas.');

const express = require('express');
const cors = require('cors'); 

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes'); 


const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);


console.log('DEBUG: app.js - Montando rutas de productos en /api/products.');
app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes); 


app.use((req, res, next) => {
  console.log('DEBUG: 404 - Ruta no encontrada:', req.originalUrl);
  res.status(404).json({ message: 'Ruta no encontrada' }); 
});


app.use((err, req, res, next) => {
  console.error('DEBUG: Error Global Catch:', err.stack); 
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});
console.log('DEBUG: app.js - Manejador de errores global configurado.');


const PORT = process.env.PORT || 3001;


app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

require('./config/db');

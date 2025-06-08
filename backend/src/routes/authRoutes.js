
const express = require('express');
const router = express.Router(); 
const authController = require('../controllers/authController'); 

console.log('DEBUG: authRoutes - Cargando rutas de autenticación.');

router.post('/login', authController.login);


module.exports = router;

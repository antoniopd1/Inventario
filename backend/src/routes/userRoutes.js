
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware'); 

console.log('DEBUG: userRoutes - Cargando rutas de usuarios.');

router.get('/', authenticateToken, authorizeRole(['administrador']), userController.getAllUsers);

router.get('/:id', authenticateToken, authorizeRole(['administrador']), userController.getUserById);

router.post('/', authenticateToken, authorizeRole(['administrador']), userController.createUser);

router.put('/:id', authenticateToken, authorizeRole(['administrador']), userController.updateUser);

router.delete('/:id', authenticateToken, authorizeRole(['administrador']), userController.deleteUser);

module.exports = router; 

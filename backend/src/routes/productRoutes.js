
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

console.log('DEBUG: productRoutes - Cargando rutas de productos.');


router.get('/history', authenticateToken, authorizeRole(['administrador']), productController.getMovementHistory);

router.get('/', authenticateToken, productController.getAllProducts);


router.get('/:id', authenticateToken, productController.getProductById);


router.post('/', authenticateToken, authorizeRole(['administrador']), productController.addProduct);


router.put('/:id', authenticateToken, authorizeRole(['administrador', 'almacenista']), productController.updateProduct);


router.patch('/:id/status', authenticateToken, authorizeRole(['administrador']), productController.toggleProductStatus);


router.delete('/:id', authenticateToken, authorizeRole(['administrador']), productController.deleteProduct);


router.patch('/:id/withdraw', authenticateToken, authorizeRole(['administrador', 'almacenista']), productController.withdrawProduct);



module.exports = router;

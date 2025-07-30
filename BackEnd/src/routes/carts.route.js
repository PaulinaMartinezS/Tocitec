const express = require('express');
const cartController = require('../controllers/carts.model');
const router = express.Router();

// Operations
router.put('/add', cartController.addProductToCart);
router.post('/remove', cartController.removeProductFromCart);

// CRUD
router.get('/', cartController.getCarts);
router.get('/:id', cartController.getCartById);
router.post('/', cartController.createCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;

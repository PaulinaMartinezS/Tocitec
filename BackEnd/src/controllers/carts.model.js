const Cart = require('../models/carts.model');

// Obtener todos los carritos
const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('cartProducts.product');
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener un carrito por ID
const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('cartProducts.product');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        const cart = new Cart(req.body);
        await cart.save();
        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Actualizar un carrito
const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar un carrito
const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json({ message: 'Cart deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Agregar producto al carrito
const addProductToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productIndex = cart.cartProducts.findIndex(
            item => item.product.toString() === productId
        );

        if (productIndex > -1) {
            // Si el producto ya está, suma la cantidad
            cart.cartProducts[productIndex].quantity += quantity;
        } else {
            // Si no está, lo agrega
            cart.cartProducts.push({ product: productId, quantity });
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Quitar producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await Cart.findById(req.params.id);
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.cartProducts = cart.cartProducts.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getCarts,
    getCartById,
    createCart, 
    updateCart,
    deleteCart,
    addProductToCart,
    removeProductFromCart,
};
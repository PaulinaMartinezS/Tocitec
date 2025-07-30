const mongoose = require('mongoose');
const { randomUUID: uuid } = require('crypto');

const { Schema, model } = mongoose;

const cartsModel = new Schema({
    cartId: {
        unique: true,
        required: true,
        type: String,
        default: uuid
    },
    cartProducts: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, { versionKey: false, timestamps: true });

const Cart = model('Cart', cartsModel);
module.exports = Cart;
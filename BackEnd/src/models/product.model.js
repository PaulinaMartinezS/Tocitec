const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productModel = new Schema({
    productSerialNumber: {
        unique: true,
        required: true,
        type: String,
    },
    productName: {
        required: true,
        type: String,
        maxLength: 100,
    },
    productDescription: {
        required: true,
        type: String,
        default: null,
    },
    productCategory: {
        required: true,
        type: String,
        enum: ['cpu', 'gpu', 'ram', 'almacenamiento', 'placa', 'fuente', 'refrigeracion', 'gabinete', 'monitor', 'periferico'],
    },
    productPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    productImage: {
        type: String,
        default: null,
    },
    productStock: {
        type: Number,
        required: true,
        min: 0,
    },
}, { versionKey: false, timestamps: true });


const Product = model('Product', productModel);
module.exports = Product;
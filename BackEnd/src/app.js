const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const appConf = require('./conf-files/app.conf');

const productsRoutes = require('./routes/products.route');
const cartsRoutes = require('./routes/carts.route');


const app = express();
app.use(cors());

mongoose.connect(appConf.MONGO_URL)
    .then(() => console.log('Successful connection to MongoDB'))
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });


app.use(bodyParser.json());
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

// Default path
app.use((req, res, next) => {
    res.status(404).json(
        {
            code: 404,
            message: "Path not found",
            details: 'The requested path does not exist.'
        });
});

module.exports = app;
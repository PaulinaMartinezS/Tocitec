require('dotenv').config();
const app = require('./app');
const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on the port: ${PORT}`);
});

module.exports = { app };
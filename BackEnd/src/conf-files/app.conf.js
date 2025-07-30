module.exports = {
    MONGO_URL: `mongodb://${process.env.MONGO_SERVER}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE_NAME}`,
};
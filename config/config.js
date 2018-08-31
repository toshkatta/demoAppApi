require('dotenv').config()

module.exports = {
    port: process.env.PORT,
    db: {
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        options: {
            dialect: process.env.DIALECT,
            host: process.env.HOST
        }
    }
}
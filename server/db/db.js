const Sequelize = require("sequelize");

require("dotenv").config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {   
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: 5432
    });
// DATABASE_URL = "postgres://postgres:postgres1@localhost:5432/messenger"

module.exports = db;

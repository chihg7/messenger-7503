const Sequelize = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL 
  || "postgres://postgres:postgres1@localhost:5432/messenger");

module.exports = db;

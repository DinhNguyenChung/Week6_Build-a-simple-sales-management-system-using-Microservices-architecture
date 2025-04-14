const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST || "order-db",
  database: process.env.DB_NAME || "orderdb",
  password: "123456",
  port: 5432,
});

module.exports = pool;

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: process.env.DB_HOST || "customer-db",
  database: process.env.DB_NAME || "customerdb",
  password: "123456",
  port: 5432,
});

module.exports = pool;

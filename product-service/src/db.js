const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "product-db",
  database: "productdb",
  password: "123456",
  port: 5432,
});

module.exports = pool;

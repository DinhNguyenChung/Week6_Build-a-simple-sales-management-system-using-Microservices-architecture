const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost", // hoặc container name nếu dùng Docker
  database: "inventorydb", // tên DB bạn tạo
  password: "123456", // mật khẩu DB
  port: 5436,
});

module.exports = pool;

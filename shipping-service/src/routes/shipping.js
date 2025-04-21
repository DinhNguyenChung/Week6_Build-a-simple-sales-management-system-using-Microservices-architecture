const express = require("express");
const router = express.Router();
const pool = require("../db");

// Tạo đơn giao hàng
router.post("/shipping", async (req, res) => {
  const { order_id, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO shipping (order_id, status) VALUES ($1, $2) RETURNING *`,
      [order_id, status || "processing"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Lấy tất cả đơn giao hàng
router.get("/shipping", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shipping");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

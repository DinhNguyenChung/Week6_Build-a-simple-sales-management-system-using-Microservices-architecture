const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE: Tạo đơn hàng mới
router.post("/orders", async (req, res) => {
  const { customer_id, product_id, quantity, total_price, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_id, product_id, quantity, total_price, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [customer_id, product_id, quantity, total_price, status || "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send(err.message);
  }
});

// READ ALL: Lấy danh sách tất cả đơn hàng
router.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ ONE: Lấy thông tin một đơn hàng theo ID
router.get("/orders/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [
      req.params.id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).send("Order not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE: Cập nhật đơn hàng
router.put("/orders/:id", async (req, res) => {
  const { customer_id, product_id, quantity, total_price, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE orders
       SET customer_id = $1, product_id = $2, quantity = $3, total_price = $4, status = $5
       WHERE id = $6
       RETURNING *`,
      [customer_id, product_id, quantity, total_price, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Order not found");
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE: Xoá đơn hàng
router.delete("/orders/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send("Order not found");
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db");

// Thêm sản phẩm vào kho
router.post("/inventory", async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) RETURNING *`,
      [product_id, quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Giảm số lượng khi có đơn hàng
router.put("/inventory/decrease/:product_id", async (req, res) => {
  const { quantity } = req.body;
  const { product_id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 RETURNING *`,
      [quantity, product_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../db");

// Tạo thanh toán mới
router.post("/payments", async (req, res) => {
  const { order_id, amount, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO payments (order_id, amount, status) VALUES ($1, $2, $3) RETURNING *`,
      [order_id, amount, status || "pending"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Cập nhật trạng thái thanh toán
router.put("/payments/:id", async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE payments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

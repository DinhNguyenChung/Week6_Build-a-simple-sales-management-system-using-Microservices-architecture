const express = require("express");
const router = express.Router();
const pool = require("../db");

// CREATE
router.post("/customers", async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (name, address, contact) VALUES ($1, $2, $3) RETURNING *",
      [name, address, contact]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ ALL
router.get("/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// READ ONE
router.get("/customers/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE
router.put("/customers/:id", async (req, res) => {
  const { name, address, contact } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET name = $1, address = $2, contact = $3 WHERE id = $4 RETURNING *",
      [name, address, contact, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
router.delete("/customers/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM customers WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

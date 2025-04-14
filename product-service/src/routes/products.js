const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
  const { name, price, description, stock } = req.body;
  const result = await db.query(
    "INSERT INTO products(name, price, description, stock) VALUES($1, $2, $3, $4) RETURNING *",
    [name, price, description, stock]
  );
  res.json(result.rows[0]);
});

router.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM products");
  res.json(result.rows);
});

router.get("/:id", async (req, res) => {
  const result = await db.query("SELECT * FROM products WHERE id = $1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

router.put("/:id", async (req, res) => {
  const { name, price, description, stock } = req.body;
  const result = await db.query(
    "UPDATE products SET name=$1, price=$2, description=$3, stock=$4 WHERE id=$5 RETURNING *",
    [name, price, description, stock, req.params.id]
  );
  res.json(result.rows[0]);
});

router.delete("/:id", async (req, res) => {
  await db.query("DELETE FROM products WHERE id=$1", [req.params.id]);
  res.json({ message: "Deleted" });
});

module.exports = router;

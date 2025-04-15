const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let inventory = [
  { productId: 1, quantity: 50 },
  { productId: 2, quantity: 100 },
];

app.post("/api/inventory/decrease", (req, res) => {
  const { productId, quantity } = req.body;
  const product = inventory.find((p) => p.productId == productId);
  if (!product || product.quantity < quantity) {
    return res.status(400).send("Not enough stock");
  }
  product.quantity -= quantity;
  res.json(product);
});

app.get("/api/inventory", (req, res) => {
  res.json(inventory);
});

app.listen(4005, () => console.log("Inventory Service running on port 4005"));

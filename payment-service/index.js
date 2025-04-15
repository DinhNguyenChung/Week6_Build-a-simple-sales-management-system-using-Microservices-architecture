const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let payments = []; // simple in-memory data

app.post("/api/payment", (req, res) => {
  const { orderId, amount, method } = req.body;
  const payment = {
    id: payments.length + 1,
    orderId,
    amount,
    method,
    status: "paid",
    createdAt: new Date(),
  };
  payments.push(payment);
  res.status(201).json(payment);
});

app.get("/api/payment/:orderId", (req, res) => {
  const payment = payments.find((p) => p.orderId == req.params.orderId);
  res.json(payment || {});
});

app.listen(4004, () => console.log("Payment Service running on port 4004"));

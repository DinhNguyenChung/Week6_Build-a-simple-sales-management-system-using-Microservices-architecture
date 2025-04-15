const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

let shippingOrders = [];

app.post("/api/shipping", (req, res) => {
  const { orderId, address } = req.body;
  const ship = {
    id: shippingOrders.length + 1,
    orderId,
    address,
    status: "shipping",
    createdAt: new Date(),
  };
  shippingOrders.push(ship);
  res.status(201).json(ship);
});

app.put("/api/shipping/:id", (req, res) => {
  const shipping = shippingOrders.find((s) => s.id == req.params.id);
  if (!shipping) return res.status(404).send("Not found");
  shipping.status = req.body.status || shipping.status;
  res.json(shipping);
});

app.listen(4006, () => console.log("Shipping Service running on port 4006"));

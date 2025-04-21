const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/inventory"); // shipping.js / inventory.js / payment.js

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(4005, () => {
  console.log("Service đang chạy tại cổng 4005");
});

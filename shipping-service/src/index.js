const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/shipping.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(4004, () => {
  console.log("Service đang chạy tại cổng 400x");
});

const express = require("express");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orders");
const cors = require("cors");

// Khởi tạo app
const app = express();

// Sử dụng middleware CORS
app.use(
  cors({
    origin: "*", // Chỉ cho phép yêu cầu từ API Gateway
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json()); // Để parse JSON request body
app.use("/api", orderRoutes); // Đường dẫn cho các API orders

app.listen(4003, () => {
  console.log("Order Service running on port 4003");
});

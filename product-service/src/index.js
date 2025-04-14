const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products");
const cors = require("cors");

// Khởi tạo app trước
const app = express();

// Sử dụng middleware CORS
app.use(
  cors({
    origin: "*", // Chỉ cho phép yêu cầu từ API Gateway
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use("/products", productRoutes);

app.listen(4001, () => console.log("Product Service running on port 4001"));

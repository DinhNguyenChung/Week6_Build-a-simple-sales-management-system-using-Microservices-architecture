const express = require("express");
const bodyParser = require("body-parser");
const customerRoutes = require("./routes/customer");
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
app.use("/api", customerRoutes); // Đường dẫn cho các API customers

app.listen(4002, () => {
  console.log("Customer Service running on port 4002");
});

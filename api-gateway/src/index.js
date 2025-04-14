const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:4001";
const CUSTOMER_SERVICE_URL =
  process.env.CUSTOMER_SERVICE_URL || "http://customer-service:4002";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://order-service:4003";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 KHÔNG dùng app.use(express.json()); ở đây nữa!

app.use(
  "/api/product-service",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/product-service": "",
    },
    bodyParser: false,
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

app.use(
  "/api/customer-service",
  createProxyMiddleware({
    target: CUSTOMER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/customer-service": "/api" },
    timeout: 10000,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy Error: " + err.message);
    },
  })
);

app.use(
  "/api/order-service",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/order-service": "/api" },
    timeout: 10000,
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).send("Proxy Error: " + err.message);
    },
  })
);

// Apply express.json() cho route này nếu cần
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
  console.log(`Product service URL: ${PRODUCT_SERVICE_URL}`);
  console.log(`Customer service URL: ${CUSTOMER_SERVICE_URL}`);
  console.log(`Order service URL: ${ORDER_SERVICE_URL}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the API Gateway");
});

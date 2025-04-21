const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const CircuitBreaker = require("opossum");

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

// RATE LIMITER – Giới hạn 5 request/phút mỗi IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 5,
  message: "Bạn đã gửi quá nhiều request, thử lại sau 1 phút.",
});
app.use("/api/product-service", limiter);

// CIRCUIT BREAKER với axios gọi đến Product Service
const options = {
  timeout: 5000, // TIME LIMITER – 5 giây
  errorThresholdPercentage: 50, // mở mạch khi 50% lỗi
  resetTimeout: 10000, // 10 giây sau sẽ thử lại
};

const breaker = new CircuitBreaker(async (url) => {
  const response = await axios.get(url); // có thể POST, PUT,... nếu cần
  return response.data;
}, options);

breaker.fallback(() => ({
  message: "Circuit Breaker: Service currently unavailable!",
}));
breaker.on("open", () => console.log("Circuit Breaker: OPEN"));
breaker.on("halfOpen", () => console.log("Circuit Breaker: HALF OPEN"));
breaker.on("close", () => console.log("Circuit Breaker: CLOSED"));
// RETRY FUNCTION - To use with Circuit Breaker
const retryOperation = async (fn, retries = 3, delay = 1000, backoff = 2) => {
  let currentRetry = 0;

  const execute = async () => {
    try {
      return await fn();
    } catch (error) {
      currentRetry++;
      console.log(`Retry attempt ${currentRetry}/${retries}`);

      if (currentRetry >= retries) {
        console.log("Maximum retries reached. Giving up.");
        throw error;
      }

      // Calculate exponential backoff delay
      const nextDelay = delay * Math.pow(backoff, currentRetry - 1);
      console.log(`Waiting ${nextDelay}ms before next retry...`);

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, nextDelay));

      // Try again
      return execute();
    }
  };

  return execute();
};
// TEST CIRCUIT BREAKER VỚI RETRY
app.get("/api/test-circuit-breaker-with-retry", async (req, res) => {
  try {
    // Wrap the breaker call in the retry function
    const data = await retryOperation(
      async () => await breaker.fire(`${PRODUCT_SERVICE_URL}/products`),
      3, // 3 retries
      1000, // Initial delay of 1 second
      2 // Exponential backoff factor
    );

    res.json({
      success: true,
      message: "Request successful with circuit breaker and retry",
      data,
    });
  } catch (error) {
    console.error("Circuit breaker with retry failed:", error.message);
    res.status(500).json({
      success: false,
      error: "Service not responding after multiple retries!",
      message: error.message,
    });
  }
});
// TEST CIRCUIT BREAKER
app.get("/api/test-circuit-breaker", async (req, res) => {
  try {
    const data = await breaker.fire(`${PRODUCT_SERVICE_URL}/api/products`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Service not responding!" });
  }
});

// PROXY ROUTE – Gọi thẳng service (không qua breaker)
app.use(
  "/api/product-service",
  limiter,
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/product-service": "",
    },
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

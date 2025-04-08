const express = require('express');
const productRoutes = require('./routes/products');
const app = express();

app.use(express.json());
app.use('/products', productRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Product Service is running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const { initDb } = require('./db');
const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/products', productsRoutes);

app.get('/', (req, res) => {
  res.json({ service: 'invoice-products-service', version: '1.0.0', status: 'running' });
});

const start = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      await initDb();
      break;
    } catch (err) {
      console.log(`DB not ready, retrying... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`Products service running on port ${PORT}`);
  });
};

start();

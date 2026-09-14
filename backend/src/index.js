require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const { startExpirySweeper } = require('./jobs/expireReservations');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`E-commerce backend listening on port ${PORT}`);
  startExpirySweeper();
});

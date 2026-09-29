const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Cho phép API nhận dữ liệu JSON
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Product routes
app.use('/api/products', productRoutes);

module.exports = app;
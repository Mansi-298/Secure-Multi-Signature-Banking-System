const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
require('dotenv').config();

// Define PORT first
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const { router: authRoutes } = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const messagingRoutes = require('./routes/messaging');
const auditRoutes = require('./routes/audit');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/audit', auditRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend is alive');
});



// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/secure_banking')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start server only after DB connects
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Starting server without database connection...');
    
    // Start server even if DB fails (for development)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
  });
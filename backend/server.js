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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/audit', auditRoutes);
app.use('/api/messaging', messagingRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend is alive');
});



// MongoDB Connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017/secure_banking';
mongoose.connect(mongoUrl)
  .then(() => console.log('✅ Connected to MongoDB at:', mongoUrl))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    console.log('💡 Make sure MongoDB is running: mongod --dbpath=./data/db --bind_ip=0.0.0.0 --port=27017');
  });
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const User = require('../models/User');
const cryptoService = require('../services/cryptoService');
const { logAction } = require('../services/logService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists' 
      });
    }

    // Generate TOTP secret
    const totpSecret = cryptoService.generateTOTPSecret();
    
    // Generate key pair for digital signatures
    const keyPair = cryptoService.generateKeyPair();
    const encryptedPrivateKey = cryptoService.encryptPrivateKey(
      keyPair.privateKey, 
      password
    );

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash: password, // Will be hashed by pre-save middleware
      totpSecret: totpSecret.base32,
      publicKey: keyPair.publicKey,
      privateKeyEncrypted: JSON.stringify(encryptedPrivateKey)
    });

    await user.save();

    // Generate QR code for TOTP setup
    const qrCodeUrl = await QRCode.toDataURL(totpSecret.otpauth_url);

    res.status(201).json({
      message: 'User registered successfully',
      totpQR: qrCodeUrl,
      secret: totpSecret.base32,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error.message 
    });
  }
});

// Login with TOTP
router.post('/login', async (req, res) => {
  try {
    const { username, password, totpToken } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Verify TOTP token
    const isTotpValid = cryptoService.verifyTOTP(totpToken, user.totpSecret);
    if (!isTotpValid) {
      return res.status(401).json({ 
        error: 'Invalid TOTP token' 
      });
    }

    // Increment user nonce (prevent replay attacks)
    user.nonce += 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        nonce: user.nonce 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    await logAction({ user, action: 'LOGIN', status: 'success' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message 
    });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { router, authenticateToken };
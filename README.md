
# 🏦 Secure Multi-Signature Banking System

A comprehensive banking system implementing advanced cryptographic security features including TOTP authentication, threshold signatures, end-to-end encrypted messaging, and email notifications for transaction approvals.

## 🚀 Features

### 🔐 Authentication & Security
- **Two-Factor Authentication (2FA)** - TOTP-based authentication using Google Authenticator
- **JWT Token Management** - Secure session handling with refresh tokens
- **RSA 2048-bit Encryption** - Military-grade encryption for private keys
- **Replay Attack Protection** - Nonce-based security preventing duplicate transactions

### 💰 Transaction Management
- **Multi-Signature Approval** - Threshold signature scheme (3/5 approvers required)
- **High-Value Transaction Protection** - Automatic approval workflow for transactions ≥ ₹50 Lakhs
- **Digital Signatures** - ECDSA signatures for transaction authentication
- **Real-time Email Notifications** - Instant approval notifications to authorized personnel

### 💬 Secure Messaging
- **End-to-End Encryption** - RSA/AES hybrid encryption for messages
- **Message Integrity** - Digital signatures ensuring message authenticity
- **Real-time Communication** - Secure messaging between system users

### 📊 Audit & Compliance
- **Comprehensive Audit Trail** - Complete logging of all system activities
- **Real-time Monitoring** - Live audit log viewer with filtering capabilities
- **Tamper-proof Logs** - Cryptographically secured audit records

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express Server │◄──►│   MongoDB DB    │
│   (Frontend)    │    │   (Backend)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│ Crypto Services │
                         │ Email Services  │
                         └─────────────────┘
```

### Technology Stack
- **Frontend**: React 19, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cryptography**: Node.js Crypto, Speakeasy (TOTP), QRCode
- **Email**: Nodemailer with Gmail SMTP
- **Authentication**: JWT, bcrypt

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Gmail account with App Password for email notifications

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📱 Usage Guide

### User Registration
1. Navigate to the registration page
2. Fill in username, email, and password
3. Scan the generated QR code with Google Authenticator
4. Save your TOTP secret key securely

### User Login
1. Enter your username and password
2. Generate TOTP code from Google Authenticator
3. Enter the 6-digit code to complete login

### Creating Transactions
1. Navigate to Transaction Manager
2. Enter recipient details and amount
3. For amounts ≥ ₹50 Lakhs, the system automatically requires multi-signature approval
4. Approvers receive email notifications instantly

### Transaction Approval
1. Approvers receive email notifications with approval links
2. Login to the system and navigate to Approvals
3. Review transaction details and provide digital signature
4. Transaction executes automatically when threshold (3/5) is met

### Secure Messaging
1. Navigate to Secure Messaging
2. Select recipient from contacts
3. Compose message (automatically encrypted end-to-end)
4. Messages are signed and verified for integrity

### Audit Monitoring
1. Access Audit Log Viewer
2. Filter logs by user, action type, or date range
3. View detailed activity records with timestamps

## 🔒 Security Features

### Cryptographic Implementation
- **TOTP Authentication**: Time-based one-time passwords with 30-second windows
- **RSA Encryption**: 2048-bit keys for message encryption
- **AES-GCM**: Authenticated encryption for message content
- **ECDSA Signatures**: Digital signatures for transaction verification
- **SHA-256 Hashing**: Secure password storage with bcrypt

### Security Measures
- **Nonce Protection**: Prevents replay attacks
- **JWT Expiration**: Automatic session timeout
- **Input Validation**: Comprehensive sanitization
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: Complete activity monitoring

## 🧪 Testing

### API Testing
```bash
# Test server health
curl http://localhost:5000/api/test

# Test email functionality
curl http://localhost:5000/api/test-email
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📁 Project Structure

```
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── .env             # Environment variables
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.js       # Main React app
│   │   └── index.js     # Entry point
│   └── package.json
├── README.md
└── TESTING_GUIDE.md
```


## 🔮 Future Enhancements

- [ ] Mobile application support
- [ ] Hardware security module integration
- [ ] Advanced fraud detection algorithms
- [ ] Multi-currency support
- [ ] Blockchain integration for transaction immutability
- [ ] Advanced reporting and analytics


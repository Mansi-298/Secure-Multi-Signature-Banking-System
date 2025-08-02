
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

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd secure-banking-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/secure_banking

# Server Configuration
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
SMTP_FROM="Secure Banking System" <noreply@securebank.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Generate Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use the 16-character password in your `.env` file

### 4. Start the Application

**Backend Server:**
```bash
cd backend
npm start
```

**Frontend Application:**
```bash
cd frontend
npm start
```

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

## 🌐 Deployment

This application is configured for deployment on Replit with automatic environment setup.

### Replit Deployment
1. Fork/import the project to Replit
2. Configure environment variables in Secrets
3. Click the Run button to start the application
4. Use the provided URL to access your deployed app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [Testing Guide](TESTING_GUIDE.md) for detailed testing instructions
- Review the audit logs for system monitoring
- Ensure all environment variables are properly configured

## 🔮 Future Enhancements

- [ ] Mobile application support
- [ ] Hardware security module integration
- [ ] Advanced fraud detection algorithms
- [ ] Multi-currency support
- [ ] Blockchain integration for transaction immutability
- [ ] Advanced reporting and analytics

---

**Security Notice**: This system handles sensitive financial data. Ensure all security best practices are followed in production environments, including regular security audits, proper key management, and compliance with banking regulations.

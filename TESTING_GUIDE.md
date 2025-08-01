# Secure Multi-Signature Banking System - Testing Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Authenticator app (for 2FA testing)

## Quick Start Commands

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with:
# MONGO_URL=mongodb://localhost:27017/secure_banking
# PORT=5000
# JWT_SECRET=your_super_secret_jwt_key_here
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Module Testing Guide

### Module 1: Authentication System (2FA)

**Test Steps:**
1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPassword123!"
   }'
   ```

2. **Save the TOTP secret and QR code from response**

3. **Setup 2FA:**
   - Scan QR code with Google Authenticator
   - Or manually add secret to authenticator app

4. **Login with 2FA:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{
     "username": "testuser",
     "password": "TestPassword123!",
     "totpToken": "123456"
   }'
   ```
   *Replace "123456" with actual TOTP code from your authenticator*

**Expected Results:**
- Registration: Returns QR code and TOTP secret
- Login: Returns JWT token on successful 2FA verification

### Module 2: Transaction Management

**Test Steps:**
1. **Create a transaction (requires authentication):**
   ```bash
   curl -X POST http://localhost:5000/api/transactions/create \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
   -d '{
     "amount": 5000000,
     "recipient": "recipient@example.com",
     "description": "Test transaction"
   }'
   ```

2. **Get pending transactions:**
   ```bash
   curl -X GET http://localhost:5000/api/transactions/pending \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Approve transaction (requires 3 out of 5 signers):**
   ```bash
   curl -X POST http://localhost:5000/api/transactions/approve \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
   -d '{
     "transactionId": "TRANSACTION_ID",
     "signature": "DIGITAL_SIGNATURE"
   }'
   ```

**Expected Results:**
- Transaction creation: Returns transaction ID and status
- Approval: Transaction status updates based on signature count

### Module 3: Secure Messaging

**Test Steps:**
1. **Send encrypted message:**
   ```bash
   curl -X POST http://localhost:5000/api/messaging/send \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN" \
   -d '{
     "recipientId": "RECIPIENT_USER_ID",
     "message": "Secret message content",
     "subject": "Test Subject"
   }'
   ```

2. **Get received messages:**
   ```bash
   curl -X GET http://localhost:5000/api/messaging/received \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Get sent messages:**
   ```bash
   curl -X GET http://localhost:5000/api/messaging/sent \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

**Expected Results:**
- Message sent: Returns encrypted message ID
- Messages retrieved: Returns decrypted message content

### Module 4: Audit Logging

**Test Steps:**
1. **View audit logs:**
   ```bash
   curl -X GET http://localhost:5000/api/audit/logs \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Filter logs by action:**
   ```bash
   curl -X GET "http://localhost:5000/api/audit/logs?action=login" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Get logs by date range:**
   ```bash
   curl -X GET "http://localhost:5000/api/audit/logs?startDate=2024-01-01&endDate=2024-12-31" \
   -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

**Expected Results:**
- Returns chronological list of all system activities
- Includes user actions, transaction events, and security events

### Module 5: Frontend Integration Testing

**Test Steps:**
1. **Open browser to `http://localhost:3000`**
2. **Test Registration Flow:**
   - Fill registration form
   - Scan QR code with authenticator
   - Verify account creation

3. **Test Login Flow:**
   - Enter credentials
   - Enter TOTP code
   - Verify successful login

4. **Test Dashboard:**
   - View transaction history
   - Check pending approvals
   - Verify user information

5. **Test Transaction Creation:**
   - Create new transaction
   - Verify transaction appears in pending list

6. **Test Messaging:**
   - Send message to another user
   - Verify message encryption/decryption

7. **Test Audit Viewer:**
   - View audit logs
   - Filter by different criteria

## Security Testing

### 1. 2FA Bypass Attempt
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "testuser",
  "password": "TestPassword123!",
  "totpToken": "000000"
}'
```
**Expected:** Should return 401 Unauthorized

### 2. Replay Attack Prevention
```bash
# Try to reuse the same request multiple times
# Expected: Should fail due to nonce validation
```

### 3. Transaction Threshold Testing
- Create transaction requiring 3/5 approvals
- Try to approve with only 2 signers
- Verify transaction doesn't execute

## Performance Testing

### 1. Concurrent User Testing
```bash
# Use tools like Apache Bench or Artillery
ab -n 100 -c 10 http://localhost:5000/api/auth/health
```

### 2. Database Performance
- Monitor MongoDB query performance
- Check for proper indexing

## Error Handling Testing

### 1. Invalid Input Testing
```bash
# Test with malformed JSON
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{ invalid json }'
```

### 2. Missing Authentication
```bash
# Test protected endpoints without JWT
curl -X GET http://localhost:5000/api/transactions/pending
```

## Monitoring and Debugging

### 1. Backend Logs
```bash
# Monitor server logs for errors
tail -f backend/logs/server.log
```

### 2. Database Monitoring
```bash
# Check MongoDB status
mongo --eval "db.stats()"
```

### 3. Network Monitoring
```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/auth/health
```

## Troubleshooting Common Issues

### 1. MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string in .env
- Check network connectivity

### 2. JWT Token Issues
- Verify JWT_SECRET is set
- Check token expiration
- Validate token format

### 3. 2FA Issues
- Verify TOTP secret is correct
- Check time synchronization
- Ensure authenticator app is working

### 4. Frontend Build Issues
- Clear node_modules and reinstall
- Check for dependency conflicts
- Verify React version compatibility

## Success Criteria

✅ **Authentication Module:**
- User registration with 2FA setup
- Secure login with TOTP verification
- JWT token generation and validation

✅ **Transaction Module:**
- High-value transaction creation (₹50L+)
- Multi-signature approval process (3/5 threshold)
- Digital signature verification

✅ **Messaging Module:**
- End-to-end encrypted messaging
- RSA/AES hybrid encryption
- Message integrity verification

✅ **Audit Module:**
- Comprehensive activity logging
- Real-time audit trail
- Secure log storage and retrieval

✅ **Security Features:**
- Replay attack prevention
- Data tampering protection
- Nonce-based security

This testing guide covers all major modules and security features of your Secure Multi-Signature Banking System. Test each module systematically and document any issues you encounter. 
import React, { useState } from 'react';
import axios from 'axios';

// Registration Form Component
function RegisterForm({ setCurrentView }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'initiator'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setQrCode(response.data.totpQR);
      setTotpSecret(response.data.secret);
      setRegistered(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>✅ Registration Successful!</h2>
          <div className="qr-container">
            <h3>Setup Two-Factor Authentication</h3>
            <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
            
            {qrCode && <img src={qrCode} alt="TOTP QR Code" className="qr-code" />}
            
            <div className="secret-backup">
              <p><strong>Backup Secret Key:</strong></p>
              <code>{totpSecret}</code>
              <small>Save this secret key securely. You can use it to manually add the account to your authenticator app.</small>
            </div>
            
            <div className="instructions">
              <h4>Instructions:</h4>
              <ol>
                <li>Install Google Authenticator or similar app on your phone</li>
                <li>Scan the QR code above</li>
                <li>Your app will generate 6-digit codes every 30 seconds</li>
                <li>Use these codes to login to the banking system</li>
              </ol>
            </div>
            
            <button onClick={() => setCurrentView('login')} className="auth-button">
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📝 Create Account</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="initiator">Initiator - Can create transactions</option>
              <option value="approval">Approval - Can approve transactions</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? '🔄 Creating Account...' : '🎯 Register'}
          </button>
        </form>
        
        <p>
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="link-button"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
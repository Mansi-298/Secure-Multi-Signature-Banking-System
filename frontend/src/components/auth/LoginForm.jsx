import React, { useState } from 'react';
import axios from 'axios';

// Login Form Component with TOTP
function LoginForm({ setUser, setCurrentView }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    totpToken: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/login', formData);
      
      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setUser(response.data.user);
      setCurrentView('dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Secure Login</h2>
        <form onSubmit={handleLogin}>
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
            <label>TOTP Code (from Authenticator App):</label>
            <input
              type="text"
              name="totpToken"
              value={formData.totpToken}
              onChange={handleChange}
              placeholder="123456"
              maxLength="6"
              required
            />
            <small>Enter the 6-digit code from your authenticator app</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </button>
        </form>
        
        <p>
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentView('register')}
            className="link-button"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user info
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      // In a real app, you'd have an endpoint to get user info from token
      const userInfo = JSON.parse(localStorage.getItem('user'));
      setUser(userInfo);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm setUser={setUser} setCurrentView={setCurrentView} />;
      case 'register':
        return <RegisterForm setCurrentView={setCurrentView} />;
      case 'dashboard':
        return <Dashboard user={user} setCurrentView={setCurrentView} logout={logout} />;
      case 'transactions':
        return <TransactionManager user={user} setCurrentView={setCurrentView} />;
      case 'messaging':
        return <SecureMessaging user={user} setCurrentView={setCurrentView} />;
      case 'approvals':
        return <TransactionApprovals user={user} setCurrentView={setCurrentView} />;
      default:
        return <LoginForm setUser={setUser} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏦 Secure Banking System</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        )}
      </header>
      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
}

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

// Registration Form Component
function RegisterForm({ setCurrentView }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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
        password: formData.password
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

// Dashboard Component
function Dashboard({ user, setCurrentView, logout }) {
  const [stats, setStats] = useState({
    pendingTransactions: 0,
    unreadMessages: 0,
    approvalsPending: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch pending transactions
      const txResponse = await axios.get('/transactions/pending/list');
      setStats(prev => ({
        ...prev,
        pendingTransactions: txResponse.data.transactions.length
      }));

      // Fetch unread messages
      const msgResponse = await axios.get('/messaging/received');
      const unreadCount = msgResponse.data.messages.filter(msg => !msg.isRead).length;
      setStats(prev => ({
        ...prev,
        unreadMessages: unreadCount
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🏠 Dashboard</h2>
        <p>Welcome to your secure banking system, {user.username}!</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>📊 System Status</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.pendingTransactions}</span>
              <span className="stat-label">Pending Transactions</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.unreadMessages}</span>
              <span className="stat-label">Unread Messages</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.approvalsPending}</span>
              <span className="stat-label">Awaiting Approval</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>🚀 Quick Actions</h3>
        <div className="action-grid">
          <button 
            onClick={() => setCurrentView('transactions')}
            className="action-card"
          >
            <span className="action-icon">💰</span>
            <span className="action-title">Manage Transactions</span>
            <span className="action-desc">Create and view high-value transactions</span>
          </button>

          <button 
            onClick={() => setCurrentView('approvals')}
            className="action-card"
          >
            <span className="action-icon">✅</span>
            <span className="action-title">Transaction Approvals</span>
            <span className="action-desc">Sign and approve pending transactions</span>
          </button>

          <button 
            onClick={() => setCurrentView('messaging')}
            className="action-card"
          >
            <span className="action-icon">🔒</span>
            <span className="action-title">Secure Messaging</span>
            <span className="action-desc">Send encrypted messages</span>
          </button>
        </div>
      </div>

      <div className="security-info">
        <h3>🔐 Security Information</h3>
        <div className="security-features">
          <div className="feature-item">
            <span className="feature-icon">🔑</span>
            <div>
              <strong>RSA 2048-bit Encryption</strong>
              <p>Your private keys are encrypted with military-grade RSA encryption</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <div>
              <strong>TOTP Authentication</strong>
              <p>Time-based one-time passwords prevent unauthorized access</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <strong>Multi-Signature Approval</strong>
              <p>High-value transactions require multiple authorized signatures</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <div>
              <strong>Replay Attack Protection</strong>
              <p>Unique nonces prevent replay and man-in-the-middle attacks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Transaction Manager Component
function TransactionManager({ user, setCurrentView }) {
  const [activeTab, setActiveTab] = useState('create');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    recipient: '',
    description: ''
  });

  useEffect(() => {
    if (activeTab === 'list') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/transactions/pending/list');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/transactions/create', newTransaction);
      alert('✅ Transaction created successfully!');
      setNewTransaction({ amount: '', recipient: '', description: '' });
      setActiveTab('list');
    } catch (error) {
      alert('❌ Failed to create transaction: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transaction-container">
      <div className="page-header">
        <h2>💰 Transaction Management</h2>
        <button onClick={() => setCurrentView('dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'create' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('create')}
        >
          ➕ Create Transaction
        </button>
        <button 
          className={activeTab === 'list' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('list')}
        >
          📋 View Transactions
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="create-transaction">
          <h3>Create High-Value Transaction</h3>
          <form onSubmit={handleCreateTransaction}>
            <div className="form-group">
              <label>Amount ($):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value
                })}
                required
              />
            </div>

            <div className="form-group">
              <label>Recipient Account:</label>
              <input
                type="text"
                value={newTransaction.recipient}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  recipient: e.target.value
                })}
                placeholder="Enter recipient account number"
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({
                  ...newTransaction,
                  description: e.target.value
                })}
                placeholder="Transaction description"
                rows="3"
              />
            </div>

            <div className="security-notice">
              <h4>🔐 Security Notice:</h4>
              <p>This transaction will require <strong>3 out of 5</strong> authorized signatures before execution. Each signature uses RSA digital signing for maximum security.</p>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? '🔄 Creating...' : '🚀 Create Transaction'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="transaction-list">
          <h3>Pending Transactions</h3>
          {loading ? (
            <div className="loading">🔄 Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="no-data">📭 No pending transactions</div>
          ) : (
            <div className="transactions-grid">
              {transactions.map((tx) => (
                <div key={tx.id} className="transaction-card">
                  <div className="tx-header">
                    <span className="tx-id">#{tx.transactionId.substring(0, 8)}...</span>
                    <span className="tx-amount">${tx.amount.toLocaleString()}</span>
                  </div>
                  <div className="tx-details">
                    <p><strong>Recipient:</strong> {tx.recipient}</p>
                    <p><strong>Initiated by:</strong> {tx.initiator.username}</p>
                    <p><strong>Created:</strong> {new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="tx-progress">
                    <div className="signature-progress">
                      <span>Signatures: {tx.signaturesCount}/{tx.requiredSignatures}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(tx.signaturesCount / tx.requiredSignatures) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;